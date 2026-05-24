import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'

import authRoutes from './routes/auth.js'
import waterRoutes from './routes/water.js'
import habitsRoutes from './routes/habits.js'
import journalRoutes from './routes/journal.js'
import chatRoutes from './routes/chat.js'
import communityRoutes from './routes/community.js'

// Load environment variables
dotenv.config()
dotenv.config({ path: './backend/.env' })

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to Database
connectDB().catch(err => {
  console.error('Database connection failed on startup:', err)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/water', waterRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/community', communityRoutes)

// Fallback Route for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

export default app
