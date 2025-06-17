import { Router } from 'express'
import { AuthController } from '../controllers/authController.js'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/logout', AuthController.logout)
router.get('/user', AuthController.getCurrentUser)
router.get('/protected', AuthController.protectedRoute)

export default router
