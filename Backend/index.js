import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY, verifyDatabaseConnection } from './config.js'
import rateLimit from 'express-rate-limit'
import { UserRepository } from './user-repository.js'
import { sendPasswordResetEmail } from './email-services.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Verificación de conexión a la base de datos
verifyDatabaseConnection()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.get('/', (req, res) => {
  res.send('Backend funcionando. Usa /api para endpoints.');
});

// Middleware de autenticación
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.user = null

  if (token) {
    try {
      const data = jwt.verify(token, SECRET_JWT_KEY)
      req.user = data
    } catch (error) {
      console.error('Error verificando token:', error.message)
    }
  }
  next()
})

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    )

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000
    }).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/register', async (req, res) => {
  const { email, username, password, role = 'user' } = req.body

  try {
    const id = await UserRepository.create({ email, username, password, role })
    res.json({
      success: true,
      message: 'Usuario registrado correctamente',
      userId: id
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/logout', (req, res) => {
  res.clearCookie('access_token').json({
    success: true,
    message: 'Sesión cerrada correctamente'
  })
})

// Ruta para obtener información del usuario actual
app.get('/api/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'No autenticado'
    })
  }
  res.json({
    success: true,
    user: req.user
  })
})

// Ruta protegida de ejemplo
app.get('/api/protected', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado'
    })
  }
  res.json({
    success: true,
    message: `Bienvenido ${req.user.username}`,
    user: req.user
  })
})

// Rutas para administración
app.get('/api/admin', authorizeRole('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Panel de administración',
    user: req.user
  })
})

// Ruta para recuperación de contraseña
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Demasiados intentos, por favor intenta más tarde'
})

app.post('/api/forgot-password', passwordResetLimiter, async (req, res) => {
  const { email } = req.body

  try {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await UserRepository.findByEmail(normalizedEmail)

    if (user) {
      const resetToken = jwt.sign(
        {
          userId: user.id,
          action: 'password-reset',
          email: user.email,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        },
        SECRET_JWT_KEY,
        { algorithm: 'HS256' }
      )

      await UserRepository.saveResetToken(user.email, resetToken)

      await sendPasswordResetEmail({
        email: user.email,
        username: user.username,
        resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
      })
    }

    res.json({
      success: true,
      message: 'Si este correo está registrado, recibirás un enlace para restablecer tu contraseña'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    })
  }
})

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY)

    if (decoded.action !== 'password-reset') {
      return res.status(400).json({ error: 'Token inválido' })
    }

    const user = await UserRepository.findByResetToken(token)
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' })
    }

    await UserRepository.updatePassword(decoded.userId, newPassword)
    await UserRepository.clearResetToken(decoded.userId)

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    res.status(400).json({
      error: 'Token inválido o expirado'
    })
  }
})

// Middleware de autorización
function authorizeRole (requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado: Rol insuficiente' })
    }

    next()
  }
}

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' })
})

// Servir el frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
  })
}
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
