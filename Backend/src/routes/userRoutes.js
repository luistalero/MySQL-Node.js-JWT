import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { authorize } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', UserController.getProfile)
router.patch('/:userId/role', authorize(['admin']), UserController.updateRole)

export default router
