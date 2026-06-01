import 'dotenv/config'
import app from './app'
import { prisma } from './lib/prisma'

const PORT = process.env.PORT || 3000

async function main() {
  await prisma.$connect()
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
