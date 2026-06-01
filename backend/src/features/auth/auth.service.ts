import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { signAccessToken, signRefreshToken } from '../../lib/jwt'
import type { RegisterInput, LoginInput } from './auth.validator'

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new Error('Email sudah terdaftar')

    const hashed = await bcrypt.hash(data.password, 12)
    return prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    })
  },

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) throw new Error('Email atau password salah')

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) throw new Error('Email atau password salah')

    const payload = { id: user.id, email: user.email, role: user.role }
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }
  },
}
