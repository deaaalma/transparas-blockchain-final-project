import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@desa.id'
  const password = 'password'
  
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin user already exists.')
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      name: 'Admin Desa',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log(`Admin user created: ${email} / ${password}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
