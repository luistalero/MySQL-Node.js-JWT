import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/index.js'

export function authenticate (req, res, next) {
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1]

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY)
    req.user = decoded
  } catch (error) {
    console.error('Error de Token: ', error.message)
  }
  next()
}

export function authorize (requiredRole) {
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
