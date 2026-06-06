import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML } from '../utils/security.js'

const router = express.Router()

router.use(authMiddleware)

const SYSTEM_PROMPT = `You are a warm, chill, and deeply empathetic wellness guide and best friend.
The user will input their current state of mind or mood (e.g., "overwhelmed by on campus placement season", "feeling lonely", "burnt out from coding", "distracted and anxious").
Your task is to generate a custom "Sankalpa" (focused daily intention) and supporting wellness elements.

CRITICAL INSTRUCTIONS FOR RITUALS (MUST FOLLOW):
- Do NOT suggest boring, generic spiritual tasks (like "chant Om", "do pranayama", "sit in silence and breathe") unless they specifically ask for meditation.
- Suggest highly relevant, practical, comforting, and slightly "thrilling" or engaging actions that a best friend or senior coach would recommend to help them snap out of their state.
- Tailor the rituals directly to their input context.
  * Placement Season / Exam Panic: Suggest a 'Hype Power Stance' (stand tall for 1 minute while playing your ultimate pump-up track), a 'Fear Dump & Shred' (write down your worst placement fear on paper and rip it into tiny pieces), or a 'Cold Water Shock Reboot' (splash freezing water on your face to reboot your nervous system).
  * Coding Burnout / Screen Fatigue: Suggest 'Green Light Rest' (go look at a tree or leaf outside for 2 minutes without your phone), or 'The 20-20-20 Blink' (stare at something 20 feet away and blink rapidly).
  * Loneliness / Sadness: Suggest 'Chai Pep-talk' (brew a cup of tea, smile in the mirror, and remind yourself you are doing great), or 'One-song Dance Break' (put on a high-vibe song and move your body for 2 minutes).
- Write the ritual name and description in a warm, comforting, genuine, and conversational tone. Do NOT use forced internet or Gen Z slang (avoid words like "no cap", "lowkey", "slay", "fr", "vibe check"). Instead, focus on authentic, friendly, and down-to-earth support that feels mature yet cozy.

You must respond with a JSON object ONLY, matching this EXACT structure:
{
  "key": "custom",
  "label": "A short 1-2 word title for the Sankalpa (e.g., 'Placement Peace', 'Focus', 'Rest')",
  "emoji": "A single matching emoji (e.g., '🎓', '🔥', '🌿')",
  "msg": "A gentle, comforting 1-sentence confirmation message written like a supportive friend (e.g., 'Placements are stressful, but your worth isn\\'t defined by a resume. Let\\'s take it slow today.')",
  "suggestedRituals": [
    {
      "name": "Name of the tailored ritual (e.g., 'Fear Shredder')",
      "time": "Duration in minutes as a string (e.g., '2')",
      "desc": "Actionable, friendly, and practical description of the ritual."
    }
  ],
  "wisdomOptions": [
    {
      "wis": "A beautiful, relevant quote from ancient Indian wisdom (Bhagavad Gita, Upanishads, Kabir, Tagore, or Ayurveda) that matches the mood.",
      "src": "The source of the quote (e.g., 'Kabir')",
      "ref": "A brief sub-heading or context (e.g., '— on keeping things simple')"
    }
  ]
}

Ensure the response is valid JSON, with no markdown code blocks or extra text outside the JSON object.
`

const STATIC_FALLBACKS = [
  {
    key: 'custom',
    label: 'Calm Vibe',
    emoji: '🧘',
    msg: 'Calm Presence chosen · breathing space and quiet energy shape your day.',
    suggestedRituals: [
      {
        name: 'Sama Vritti Breathing',
        time: '2',
        desc: 'Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat for 5 rounds to quiet the mental chatter.'
      }
    ],
    wisdomOptions: [
      {
        wis: '"As a lamp in a windless place does not flicker, so is the mind of a yogi absorbed in the Self."',
        src: 'Bhagavad Gita',
        ref: '— on inner stillness'
      }
    ]
  },
  {
    key: 'custom',
    label: 'Inner Fire',
    emoji: '⚡',
    msg: 'Inner Fire chosen · channeling strength and focus into today\'s steps.',
    suggestedRituals: [
      {
        name: 'Warrior Focus Pose',
        time: '2',
        desc: 'Stand firm, reach your hands tall, and take 5 deep slow breaths to ground your focus and ignite determination.'
      }
    ],
    wisdomOptions: [
      {
        wis: '"Arise! Awake! Approach the great ones and learn from them."',
        src: 'Katha Upanishad',
        ref: '— on rising stronger'
      }
    ]
  }
]

function getStaticFallback(moodText) {
  const lower = moodText.toLowerCase()
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('tired') || lower.includes('exhaust') || lower.includes('sad')) {
    return STATIC_FALLBACKS[0]
  }
  return STATIC_FALLBACKS[1]
}

function isValidSankalpa(obj) {
  return (
    obj &&
    typeof obj.label === 'string' &&
    typeof obj.emoji === 'string' &&
    typeof obj.msg === 'string' &&
    Array.isArray(obj.suggestedRituals) &&
    obj.suggestedRituals.length > 0 &&
    typeof obj.suggestedRituals[0].name === 'string' &&
    typeof obj.suggestedRituals[0].desc === 'string' &&
    Array.isArray(obj.wisdomOptions) &&
    obj.wisdomOptions.length > 0 &&
    typeof obj.wisdomOptions[0].wis === 'string'
  )
}

function cleanJsonResponse(rawText) {
  let text = rawText.trim()
  // Remove markdown code blocks if any
  if (text.startsWith('```')) {
    text = text.replace(/^```(json)?/, '').replace(/```$/, '').trim()
  }
  return JSON.parse(text)
}

router.post('/generate', async (req, res) => {
  try {
    let { moodInput } = req.body
    if (!moodInput) {
      return res.status(400).json({ error: 'Mood input is required' })
    }

    moodInput = escapeHTML(ensureString(moodInput).trim())

    const groqKey = process.env.GROQ_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    let generatedSankalpa = null

    // 1. Try Groq (Llama 3)
    if (groqKey) {
      try {
        console.log('[Sankalpa AI] Requesting Groq Llama 3 generation...')
        const groq = new Groq({ apiKey: groqKey })
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `User mood description: "${moodInput}"` }
          ],
          response_format: { type: "json_object" },
          max_tokens: 600,
        })
        
        const rawText = response.choices[0].message.content
        const parsed = cleanJsonResponse(rawText)
        if (isValidSankalpa(parsed)) {
          generatedSankalpa = parsed
          console.log('[Sankalpa AI] Groq Llama 3 generation successful.')
        } else {
          console.warn('[Sankalpa AI] Groq response did not meet schema requirements:', parsed)
        }
      } catch (err) {
        console.error('[Sankalpa AI] Groq generation failed, attempting fallback...', err.message)
      }
    }

    // 2. Try Gemini fallback
    if (!generatedSankalpa && geminiKey) {
      console.log('[Sankalpa AI] Requesting Gemini fallback generation...')
      const genAI = new GoogleGenerativeAI(geminiKey)
      const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest']
      
      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: "application/json" }
          })
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `User mood description: "${moodInput}"` }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
          })
          
          const rawText = result.response.text()
          const parsed = cleanJsonResponse(rawText)
          if (isValidSankalpa(parsed)) {
            generatedSankalpa = parsed
            console.log(`[Sankalpa AI] Gemini model ${modelName} successful.`)
            break
          } else {
            console.warn(`[Sankalpa AI] Gemini ${modelName} schema invalid:`, parsed)
          }
        } catch (err) {
          console.error(`[Sankalpa AI] Gemini model ${modelName} failed:`, err.message)
        }
      }
    }

    // 3. Static fallback
    if (!generatedSankalpa) {
      console.log('[Sankalpa AI] Both AI models failed or unavailable. Using static fallback.')
      generatedSankalpa = getStaticFallback(moodInput)
    }

    return res.status(200).json({ sankalpa: generatedSankalpa })
  } catch (err) {
    console.error('[Sankalpa Route Error]:', err)
    return res.status(500).json({ error: 'Internal server error generating Sankalpa' })
  }
})

export default router
