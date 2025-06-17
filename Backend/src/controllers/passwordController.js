import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/index.js'
import { UserRepository } from '../database/repositories/user-repository.js'
import { sendPasswordResetEmail } from '../services/email-services.js'

export class PasswordController {
  static async forgotPassword (req, res) {
    try {
      const { email } = req.body

      // Validación robusta del email
      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Se requiere un correo electrónico válido'
        })
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const trimmedEmail = email.trim().toLowerCase()

      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de correo electrónico inválido'
        })
      }

      // Respuesta estándar (security by obscurity)
      const standardResponse = {
        success: true,
        message: 'Si el correo existe en nuestro sistema, recibirás un correo con instrucciones'
      }

      try {
        const user = await UserRepository.findByEmail(trimmedEmail)

        if (!user) {
          return res.status(200).json(standardResponse)
        }

        // Verificación adicional del email
        if (!emailRegex.test(user.email)) {
          console.error(`Email inválido en DB para usuario ${user.id}: ${user.email}`)
          return res.status(200).json(standardResponse)
        }

        const resetToken = jwt.sign(
          {
            userId: user.id,
            action: 'password-reset',
            email: user.email
          },
          SECRET_JWT_KEY,
          { expiresIn: '1h' }
        )

        await UserRepository.saveResetToken(user.id, resetToken)

        sendPasswordResetEmail({
          email: user.email,
          username: user.username,
          resetLink: `http://localhost:3000/reset-password?token=${resetToken}`
        }).catch(emailError => {
          console.error('Error al enviar email:', emailError)
        })

        return res.status(200).json(standardResponse)
      } catch (dbError) {
        console.error('Error de base de datos:', dbError)
        return res.status(200).json(standardResponse)
      }
    } catch (error) {
      console.error('Error en forgotPassword:', error)
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      })
    }
  }

  static async resetPassword (req, res) {
    try {
      const { token, newPassword } = req.body

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token y nueva contraseña son requeridos'
        })
      }

      const decoded = jwt.verify(token, SECRET_JWT_KEY)

      if (decoded.action !== 'password-reset') {
        return res.status(400).json({
          success: false,
          error: 'Token inválido'
        })
      }

      const user = await UserRepository.findById(decoded.userId)
      if (!user || user.resetToken !== token) {
        return res.status(400).json({
          success: false,
          error: 'Token inválido o expirado'
        })
      }

      await UserRepository.updatePassword(decoded.userId, newPassword)
      await UserRepository.clearResetToken(decoded.userId)

      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      })
    } catch (error) {
      console.error('Error en resetPassword:', error)

      let errorMessage = 'Error al restablecer la contraseña'
      if (error instanceof jwt.TokenExpiredError) {
        errorMessage = 'El enlace de recuperación ha expirado'
      } else if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = 'Enlace de recuperación inválido'
      }

      res.status(400).json({
        success: false,
        error: errorMessage
      })
    }
  }
}
