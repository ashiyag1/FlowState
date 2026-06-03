import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
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

const isPrivateIP = (url) => {
  try {
    const hostname = new URL(url).hostname
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    )
  } catch {
    return false
  }
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || isPrivateIP(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: origin "${origin}" is not allowed`))
  },
  credentials: true,
}))

// ── SECURITY HEADERS ──────────────────────────────────────────────────────────
// helmet sets X-Frame-Options, Content-Security-Policy, HSTS, and 10+ other
// protective headers to guard against clickjacking, XSS, and MIME sniffing.
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Needed so Google OAuth popup doesn't break
  contentSecurityPolicy: false,     // Managed by Vercel/Vite frontend instead
}))

// ── COMPRESSION ───────────────────────────────────────────────────────────────
// Gzip all API responses — reduces payload size by ~70% on average
app.use(compression())

// ── BODY PARSER ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))

// ── API VERSIONING FALLBACK ──────────────────────────────────────────────────
// Automatically rewrites legacy /api/... requests to /api/v1/... to ensure zero breakage.
app.use((req, res, next) => {
  if (req.url.startsWith('/api/') && !req.url.startsWith('/api/v1/')) {
    req.url = req.url.replace('/api/', '/api/v1/');
  }
  next();
});

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

// AI Chat endpoint (Sahayak): strict minutely rate limiter to prevent scraping
const aiChatMinutelyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many queries to Sahayak. Please pause, breathe, and try again in a minute.' },
})

// AI Chat endpoint (Sahayak): strict hourly rate limiter to prevent billing abuse
const aiChatHourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You have reached your hourly limit for AI guidance. Rest, and return in an hour — Sahayak will be here.' },
})

app.use('/api/v1', globalLimiter)
app.use('/api/v1/auth/login', authLimiter)
app.use('/api/v1/auth/signup', authLimiter)

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
// Used by hosting platforms (Render, Railway, Fly.io) to verify the server is alive
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/water', waterRoutes)
app.use('/api/v1/habits', habitsRoutes)
app.use('/api/v1/journal', journalRoutes)
app.use('/api/v1/chat', aiChatMinutelyLimiter, aiChatHourlyLimiter, chatRoutes)
app.use('/api/v1/community', communityRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/badges', badgesRoutes)

// ── 404 FALLBACK ──────────────────────────────────────────────────────────────
app.use('/api/v1/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

export default app
