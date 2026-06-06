import express from 'express'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { dbCreateUser, dbFindUserByEmail, dbFindUserById } from '../db.js'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML } from '../utils/security.js'

const router = express.Router()

// Fail-fast: crash loudly if JWT_SECRET is missing rather than silently using
// a hardcoded fallback that would allow anyone to forge valid tokens.
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start safely.')
}

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body

    name = ensureString(name).trim()
    email = ensureString(email).trim().toLowerCase()
    password = ensureString(password)

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    // Escape name for XSS prevention when displayed in UI
    const escapedName = escapeHTML(name)

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const existingUser = await dbFindUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const user = await dbCreateUser(escapedName, email, passwordHash)
    
    const userId = user._id ? user._id.toString() : user.id
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET))

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
        pranaPoints: user.pranaPoints || 0,
        activeSankalpa: user.activeSankalpa || 'calm',
        dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
        wisdom: user.wisdom || {}
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
    let { email, password } = req.body

    email = ensureString(email).trim().toLowerCase()
    password = ensureString(password)

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await dbFindUserByEmail(email)
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const userId = user._id ? user._id.toString() : user.id
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET))

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
        pranaPoints: user.pranaPoints || 0,
        activeSankalpa: user.activeSankalpa || 'calm',
        dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
        wisdom: user.wisdom || {}
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
        pranaPoints: user.pranaPoints || 0,
        activeSankalpa: user.activeSankalpa || 'calm',
        dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
        wisdom: user.wisdom || {}
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
    let { accessToken } = req.body
    accessToken = ensureString(accessToken)
    
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

    const email = ensureString(profile.email).trim().toLowerCase()
    const name = escapeHTML(ensureString(profile.name || 'User').trim())

    let user = await dbFindUserByEmail(email)
    if (!user) {
      const salt = await bcrypt.genSalt(10)
      const placeholderHash = await bcrypt.hash(Math.random().toString(36), salt)
      user = await dbCreateUser(name, email, placeholderHash)
    }

    const userId = user._id ? user._id.toString() : user.id
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET))

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
        pranaPoints: user.pranaPoints || 0,
        activeSankalpa: user.activeSankalpa || 'calm',
        dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
        wisdom: user.wisdom || {}
      }
    })
  } catch (err) {
    console.error('Google OAuth error:', err)
    return res.status(500).json({ error: 'Google sign-in failed' })
  }
})

export default router
