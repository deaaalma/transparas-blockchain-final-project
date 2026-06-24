import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://transparas-blockchain-final-project.vercel.app'
    ]
    if (process.env.FRONTEND_URL) {
      allowed.push(...process.env.FRONTEND_URL.split(',').map(item => item.trim()))
    }
    const isVercelPreview = origin ? (
      origin.endsWith('.vercel.app') ||
      /^https:\/\/transparas-blockchain-.*\.vercel\.app$/.test(origin)
    ) : false;

    if (!origin || allowed.includes(origin) || allowed.includes(origin.replace(/\/$/, '')) || isVercelPreview) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

