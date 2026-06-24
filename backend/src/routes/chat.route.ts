import { Router, Request, Response } from 'express'

const router = Router()

// POST /api/chat
// Body: { messages: [{role, content}, ...] }
router.post('/', async (req: Request, res: Response) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 768,
        temperature: 0.6,
        stream: false,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json() as any
    const reply = data.choices[0].message.content
    res.json({ reply })

  } catch (error) {
    console.error('Groq error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export const chatRoutes = router
