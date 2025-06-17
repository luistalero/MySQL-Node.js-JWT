import { Router } from 'express'
import authRoutes from './authRoutes.js'
import passwordRoutes from './passwordRoutes.js'
import userRoutes from './userRoutes.js'

const router = Router()

router.use('/api', authRoutes)
router.use('/api', userRoutes)
router.use('/api', passwordRoutes)

router.use('/api', (req, res) => {
  res.status(400).json({ error: 'Endopint no encontrado ' })
})

export default router
