import { UserRepository } from '../database/repositories/user-repository.js'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/index.js'

export class AuthController {
  static async login (req, res) {
    try {
      const { username, password } = req.body
      const user = await UserRepository.login({ username, password })

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        SECRET_JWT_KEY,
        { expiresIn: '1h' }
      )

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
      }).json({ success: true, user })
    } catch (error) {
      res.status(401).json({ success: false, error: error.message })
    }
  }

  static async register (req, res) {
    try {
      const { email, username, password } = req.body
      const id = await UserRepository.create({ email, username, password })
      res.status(201).json({ success: true, userId: id })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message }
      )
    }
  }

  static logout (req, res) {
    res.clearCookies('access_token').json({ success: true })
  }

  static getCurrentUser = (req, res) => {
  }

  static protectedRoute = (req, res) => {
    //
  }
}
