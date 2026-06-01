import { Router } from 'express'
import { authController } from './auth.controller'
import { validate } from '../../middlewares/validate'
import { registerSchema, loginSchema } from './auth.validator'

export const authRoutes = Router()

authRoutes.post('/register', validate(registerSchema), authController.register)
authRoutes.post('/login', validate(loginSchema), authController.login)
