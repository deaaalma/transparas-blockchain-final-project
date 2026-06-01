import { Router } from 'express'
import { authRoutes } from '../features/auth/auth.routes'

export const router = Router()

router.use('/auth', authRoutes)
