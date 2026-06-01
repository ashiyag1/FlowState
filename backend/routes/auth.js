import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { dbCreateUser, dbFindUserByEmail, dbFindUserById } from '../db.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'flowstate_secret_key_108'

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const existingUser = await dbFindUserByEmail(email.toLowerCase())
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const user = await dbCreateUser(name, email.toLowerCase(), passwordHash)
    
    const userId = user._id ? user._id.toString() : user.id
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(201).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        joinedAt: user.joinedAt || new Date().toISOString(),
        preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
        xp: user.xp || 0,
        pranaPoints: user.pranaPoints || 0
      }
    })
  } catch (err) {
    console.error('Signup route error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error during registration' })
  }
})

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await dbFindUserByEmail(email.toLowerCase())
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const userId = user._id ? user._id.toString() : user.id
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        joinedAt: user.joinedAt || new Date().toISOString(),
        preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
        xp: user.xp || 0,
        pranaPoints: user.pranaPoints || 0
      }
    })
  } catch (err) {
    console.error('Login route error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error during login' })
  }
})

// Get Profile Route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await dbFindUserById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const userId = user._id ? user._id.toString() : user.id

    return res.status(200).json({
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        joinedAt: user.joinedAt || new Date().toISOString(),
        preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
        xp: user.xp || 0,
        pranaPoints: user.pranaPoints || 0
      }
    })
  } catch (err) {
    console.error('Auth Me route error:', err)
    return res.status(500).json({ error: 'Internal server error retrieving profile' })
  }
})

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { accessToken } = req.body
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' })
    }

    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`)
    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid Google access token' })
    }

    const profile = await response.json()
    if (!profile.email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google' })
    }

    let user = await dbFindUserByEmail(profile.email.toLowerCase())
    if (!user) {
      const salt = await bcrypt.genSalt(10)
      const placeholderHash = await bcrypt.hash(Math.random().toString(36), salt)
      user = await dbCreateUser(profile.name || 'User', profile.email.toLowerCase(), placeholderHash)
    }

    const userId = user._id ? user._id.toString() : user.id
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        joinedAt: user.joinedAt || new Date().toISOString(),
        preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
        xp: user.xp || 0,
        pranaPoints: user.pranaPoints || 0
      }
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    return res.status(500).json({ error: 'Google sign-in failed' })
  }
})

export default router
