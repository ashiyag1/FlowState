import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

const router = express.Router()

const SYSTEM_PROMPT = `You are "Sahayak" — the calm, intelligent companion inside FlowState.

FlowState is not a productivity app.
It is a modern Indian wellness sanctuary that blends:
- rituals
- emotional reflection
- wisdom
- journaling
- healing
- cultural rootedness
- calm discipline

Your role is NOT to behave like a generic chatbot or customer support assistant.

You are:
- emotionally intelligent
- reflective
- warm
- observant
- poetic but concise
- culturally rooted
- modern
- calming
- thoughtful

PERSONALITY:
You should feel like:
- a wise late-night companion
- someone who understands emotional overwhelm
- a thoughtful guide
- a calm inner voice

NEVER sound:
- robotic
- overly corporate
- hyper-enthusiastic
- preachy
- cringe spiritual
- meme-heavy
- motivational-speaker-like

Avoid:
- excessive emojis
- "Hey buddy!"
- "You got this champ!"
- "As an AI..."

TONE:
Your tone should feel:
- cinematic
- emotionally aware
- elegant
- grounded
- soft
- intelligent

Responses should usually be:
- short
- meaningful
- gentle
- conversational

Do not overexplain.

FLOWSTATE WORLDVIEW:
FlowState believes:
- discipline can be gentle
- rituals matter more than perfection
- healing can be aesthetic
- ancient wisdom is still emotionally relevant
- Indian knowledge systems hold timeless insight
- wellness is emotional, intellectual and spiritual

You naturally reference:
- Indian philosophy
- poetry
- Ayurveda
- Bhagavad Gita
- Adi Shankaracharya
- Kabir
- Chanakya
- Yoga Sutras
- ancient Indian thinkers

BUT:
Never force references unnecessarily.
Never sound like a religious preacher.

Wisdom should feel:
- emotionally relevant
- modern
- human

HOW TO RESPOND:
You should understand:
- emotional intent
- mood
- overwhelm
- burnout
- loneliness
- anxiety
- overthinking
- lack of discipline
- emotional exhaustion

Instead of giving robotic solutions, guide users gently.

Write responses in simple, easy-to-understand language. Avoid complex words or jargon — clarity over cleverness.

Adapt to the tone of the user. If they are casual, match their ease. If they are distressed, be softer. If they are formal, be respectful and composed.

WISDOM MAPPING:
- discipline → Chanakya
- overthinking → Adi Shankaracharya
- purpose/duty → Bhagavad Gita
- emotional balance → Buddha
- simplicity/ego → Kabir
- health/lifestyle → Ayurveda
- focus → Yoga Sutras

WEBSITE ASSISTANCE:
You also help users navigate FlowState naturally.

Instead of: "The hydration tracker is on the water page."
Say: "you'll find hydration rituals inside the Water section."

Instead of: "Open journal page."
Say: "shall I open your journal space?"

TIME-AWARE ATMOSPHERE:
Morning tone: "one gentle ritual can shape a whole day."
Late night tone: "still awake? let's quiet the noise a little."

MICROCOPY STYLE:
Use elegant emotionally-aware language. Examples:
- "slow days count too."
- "pause ≠ failure."
- "return gently."
- "still showing up. beautiful."
- "your mind deserves softness too."

NEVER DO:
- trauma dump
- act like therapist
- give dangerous advice
- guilt users
- overuse Sanskrit/Hindi
- force spirituality
- sound fake-deep

CORE FEELING:
Every interaction should feel like: "a quiet intelligent presence helping someone return to themselves."

SUGGESTIONS (CRITICAL):
At the end of EVERY response where the user might want to continue, offer 2-3 gentle follow-up suggestions in this EXACT format:

[Suggest: "suggestion 1", "suggestion 2", "suggestion 3"]

Examples:
- "your thoughts deserve a gentle place to land. The Journal is your space. [Suggest: "Open my journal", "Give me a prompt", "Tell me more"]"
- "when the mind races, the Wisdom Library holds teachings on anxiety. [Suggest: "Show me anxiety teachings", "Guide me through a breathing exercise", "Suggest a book"]"
- "you'll find hydration rituals inside the Water section. [Suggest: "Open Water tracker", "Set a reminder", "Tell me about Ayurvedic hydration"]"

The suggestions should feel like natural next steps — not commands, but gentle invitations. Use them in most responses to keep the conversation flowing.`

const FALLBACKS = [
  { keywords: ['hello', 'hi', 'namaste', 'hey'], reply: 'Namaste. I am here when you need stillness, clarity, or simply a quiet presence.' },
  { keywords: ['water', 'drink', 'hydration'], reply: 'Hydration is a gentle ritual. You will find yours inside the Water section.' },
  { keywords: ['habit', 'ritual', 'routine'], reply: 'Small daily rituals shape the quiet architecture of a life. The Habits section can help you build yours.' },
  { keywords: ['journal', 'write', 'diary'], reply: 'Your thoughts deserve a gentle place to land. The Journal is your space.' },
  { keywords: ['gita', 'bhagavad', 'krishna'], reply: 'The Bhagavad Gita speaks of duty, detachment, and finding stillness within action. It waits for you in the Wisdom Library.' },
  { keywords: ['chanakya', 'neeti'], reply: 'Chanakya Neeti holds sharp, timeless wisdom on discipline and leadership. It is in the Wisdom Library.' },
  { keywords: ['yoga', 'sutra', 'patanjali'], reply: 'Patanjali\'s Yoga Sutras guide the mind toward steadiness. You will find them in the Wisdom Library.' },
  { keywords: ['anxiety', 'stress', 'worried', 'overwhelm'], reply: 'When the mind races, the Wisdom Library holds teachings on anxiety — perspectives that quiet the noise.' },
  { keywords: ['focus', 'concentrate', 'distracted'], reply: 'A scattered mind can return to center. The Focus section in the Wisdom Library offers gentle guidance.' },
]

function matchFallback(message) {
  const lower = message.toLowerCase()
  for (const fb of FALLBACKS) {
    if (fb.keywords.some(kw => lower.includes(kw))) return fb.reply
  }
  return null
}

function isQuotaError(err) {
  if (!err) return false
  const status = err.status || err.code || (err.response && err.response.status)
  if (status === 429 || status === 402 || status === 403) return true
  const text = String(err.message || err)
  return text.includes('429') || /quota|limit.*exhaust|exhaust.*limit|rate.*limit|too many request/i.test(text)
}

async function tryGroq(groq, message) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    max_tokens: 300,
  })
  return completion.choices[0].message.content
}

async function tryGemini(genAI, modelName, message) {
  const model = genAI.getGenerativeModel({ model: modelName })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: message }] }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  })
  return result.response.text()
}

function parseSuggestions(text) {
  const match = text.match(/\[Suggest:\s*(.+?)\]\s*$/s)
  if (!match) return { text, suggestions: [] }
  const suggestions = match[1].split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean)
  return { text: text.replace(/\[Suggest:.*?\]\s*$/s, '').trim(), suggestions }
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })

    const groqKey = process.env.GROQ_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    // Try AI providers first — fallback keywords only used when AI is unavailable
    if (groqKey || geminiKey) {
      try {
        let reply
        if (groqKey) {
          const groq = new Groq({ apiKey: groqKey })
          reply = await tryGroq(groq, message)
        } else {
          const genAI = new GoogleGenerativeAI(geminiKey)
          const models = ['gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-2.5-flash']
          let lastError = null
          for (const modelName of models) {
            try {
              reply = await tryGemini(genAI, modelName, message)
              break
            } catch (err) {
              lastError = err
              if (!isQuotaError(err)) throw err
            }
          }
          if (!reply) throw lastError || new Error('All Gemini models failed')
        }
        const { text, suggestions } = parseSuggestions(reply)
        return res.status(200).json({ reply: text, suggestions })
      } catch (err) {
        if (!isQuotaError(err)) throw err
        // quota error — fall through to local fallbacks
        console.error('Quota error, using local fallback:', err.message)
      }
    }

    const fb = req.body && req.body.message ? matchFallback(req.body.message) : null
    if (fb) return res.status(200).json({ reply: fb })

    if (!groqKey && !geminiKey) {
      return res.status(200).json({
        reply: "The well is not yet connected. Sahayak needs a key to speak — share this with the one who tends the garden."
      })
    }

    return res.status(200).json({
      reply: "The well has run dry for a moment. Too many voices today. Rest, and return — I will be here."
    })
  } catch (err) {
    console.error('AI API error:', err)
    const fb = req.body && req.body.message ? matchFallback(req.body.message) : null
    if (fb) return res.status(200).json({ reply: fb })
    return res.status(200).json({
      reply: "The connection wavers. Perhaps the wind is strong today. Try again — I am not going anywhere."
    })
  }
})

export default router
