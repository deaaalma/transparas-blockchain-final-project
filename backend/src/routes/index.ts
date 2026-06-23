import { Router } from 'express'
import { authRoutes } from '../features/auth/auth.routes'

import profileRoutes from '../features/profile/profile.route'
import { chatRoutes } from './chat.route'

export const router = Router()

router.use('/auth', authRoutes)
router.use('/profile', profileRoutes)
router.use('/chat', chatRoutes)
