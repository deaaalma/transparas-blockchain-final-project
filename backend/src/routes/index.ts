import { Router } from 'express'
import { authRoutes } from '../features/auth/auth.routes'

import profileRoutes from '../features/profile/profile.route'

export const router = Router()

router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
