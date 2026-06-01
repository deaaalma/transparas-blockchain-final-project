import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwt'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { res.status(401).json({ message: 'Unauthorized' }); return }

  try {
    const payload = verifyAccessToken(token) as { id: string; email: string; role: string }
    req.user = payload
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}
