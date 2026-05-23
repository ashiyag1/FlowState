import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are "Sahayak" — the wise AI companion for Tarang·FlowState, a wellness dashboard rooted in Indian spiritual wisdom.

Your role: Answer questions ONLY about Tarang·FlowState's features, content, and purpose. If asked anything outside this scope, politely say you can only answer about Tarang·FlowState.

About Tarang·FlowState:
- A React-based wellness dashboard with a gold/amber Indian aesthetic
- Features: water intake tracking, habit/ritual tracking, journaling, wisdom library
- The wisdom library contains teachings from: Bhagavad Gita, Chanakya Neeti, Swami Vivekananda, Patanjali's Yoga Sutras
- Topics covered: Relationships, Anxiety & Stress, Focus, Discipline, Purpose, Life Lessons, Success, Health, Bhagavad Gita, Chanakya Neeti, Ayurveda
- Users can save pages, take notes, track reading streaks
- Built with React, Vite, Tailwind CSS, Framer Motion

Tone: Calm, warm, wise, supportive — like a modern-day rishi. Use simple English. Keep answers short (2-4 sentences). Never make up information — if you don't know, say so.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    })

    const text = result.response.text()
    res.status(200).json({ reply: text })
  } catch (err) {
    console.error('Gemini error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
