import 'dotenv/config'
import app from './app'
import { prisma } from './lib/prisma'

const PORT = parseInt(process.env.PORT || '3000', 10) || 3000

async function main() {
  // Start server immediately so it doesn't hang the deployment if DB is down
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`)
  })

  // Try connecting to DB in the background
  try {
    await prisma.$connect()
    console.log('Successfully connected to the database')
  } catch (err) {
    console.error('Failed to connect to the database. Non-database routes will still work.', err)
  }
}

main().catch((err) => {
  console.error('Critical server startup error:', err)
})
