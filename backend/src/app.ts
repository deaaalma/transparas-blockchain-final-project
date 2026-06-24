import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { corsConfig } from './config/cors'
import { router } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import { notFound } from './middlewares/notFound'

const app = express()

app.set('trust proxy', 1)

app.use(helmet())
app.use(cors(corsConfig))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(compression())

app.use('/api/v1', router)
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use(notFound)
app.use(errorHandler)

export default app
