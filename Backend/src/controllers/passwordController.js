import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/index.js'
import { UserRepository } from '../database/repositories/user-repository.js'
import { sendPasswordResetEmail } from '../services/email-services.js'

export class PasswordController {
  static async forgotPassword (req, res) {
    try {
      const { email } = req.body
      const user = await UserRepository.findByEmail(email)

      if (user) {
        const resetToken = jwt.sing(
          { userId: user.id, action: 'password-reset' },
          SECRET_JWT_KEY,
          { expiresIn: '1h' }
        )

        await UserRepository.saveResetToken(user.id, resetToken)
        await sendPasswordResetEmail({
          email: user.email,
          username: user.username,
          resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
        })
      }

      res.json({
        success: true,
        message: 'si el email existe, recibiras un enlace'
      })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

  static async resetPassword (req, res) {
  }
}
