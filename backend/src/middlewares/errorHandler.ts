import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ success: false, message: 'Data sudah ada (duplicate)' })
      return
    }
  }

  if (err.message.includes('tidak ditemukan')) {
    res.status(404).json({ success: false, message: err.message })
    return
  }

  const status = (err as any).status || 500
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  })
}
