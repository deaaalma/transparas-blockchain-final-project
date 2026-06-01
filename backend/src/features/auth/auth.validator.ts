import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Min 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(8, 'Min 8 karakter'),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

export type RegisterInput = z.infer<typeof registerSchema>['body']
export type LoginInput = z.infer<typeof loginSchema>['body']
