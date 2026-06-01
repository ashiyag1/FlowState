import express from 'express'
import cors from 'cors'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import waterRoutes from './routes/water.js'
import habitsRoutes from './routes/habits.js'
import journalRoutes from './routes/journal.js'
import chatRoutes from './routes/chat.js'
import communityRoutes from './routes/community.js'
import profileRoutes from './routes/profile.js'
import badgesRoutes from './routes/badges.js'

const app = express()

// Trust Vercel's proxy so express-rate-limit can read the real client IP
app.set('trust proxy', 1)

// ── CORS ─────────────────────────────────────────────────────────────────────
// Read allowed origins from .env — never use a wildcard in production.
// Add your Vercel/production URL to ALLOWED_ORIGINS in backend/.env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: origin "${origin}" is not allowed`))
  },
  credentials: true,
}))

// ── COMPRESSION ───────────────────────────────────────────────────────────────
// Gzip all API responses — reduces payload size by ~70% on average
app.use(compression())

// ── BODY PARSER ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))

// ── RATE LIMITING ─────────────────────────────────────────────────────────────
// Global: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a few minutes.' },
})

// Auth endpoints: only 10 attempts per 15 minutes (blocks brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
})

app.use('/api', globalLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/signup', authLimiter)

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
// Used by hosting platforms (Render, Railway, Fly.io) to verify the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/water', waterRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/badges', badgesRoutes)

// ── 404 FALLBACK ──────────────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

export default app
