import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { verifyDatabaseConnection } from './config/index.js'
import mainRouter from './routes/index.js'
import { authenticate } from './middlewares/authMiddleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

verifyDatabaseConnection()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.get('/', (req, res) => {
  res.json({
    data: {
      saludo: 'Bienvenido a mi Backend',
      message: 'Este es el inicio del Backend de mi proyecto con Node.js y React.js',
      creator: 'Luis Talero',
      repository: 'https://github.com/luistalero/MySQL-Node.js-JWT'
    }
  })
})

app.use(authenticate)
app.use(mainRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
  })
}

export default app
