import { Router } from 'express'
import { passwordResetLimiter } from '../middlewares/rateLimitMiddleware.js'
import { PasswordController } from '../controllers/passwordController.js'

const router = Router()

router.post('/forgot-password', passwordResetLimiter, PasswordController.forgotPassword)
router.post('/reset-password', PasswordController.resetPassword)

export default router
