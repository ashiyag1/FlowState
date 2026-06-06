import express from 'express'
import bcrypt from 'bcrypt'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML, sanitizeNoSql } from '../utils/security.js'
import {
  dbFindUserById,
  dbUpdateUserProfile,
  dbUpdateUserAvatar,
  dbChangePassword,
  dbDeleteUser,
  dbAdjustUserPoints
} from '../db.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// PUT / — Update profile info (name, bio, location, preferences, activeSankalpa, dailySankalpa, wisdom)
router.put('/', async (req, res) => {
  try {
    const { name, bio, location, preferences, activeSankalpa, dailySankalpa, wisdom } = req.body
    const updates = {}
    
    if (name !== undefined) updates.name = escapeHTML(ensureString(name).trim())
    if (bio !== undefined) updates.bio = escapeHTML(ensureString(bio).trim())
    if (location !== undefined) updates.location = escapeHTML(ensureString(location).trim())
    if (preferences !== undefined) updates.preferences = sanitizeNoSql(preferences)
    if (activeSankalpa !== undefined) {
      if (typeof activeSankalpa === 'string') {
        updates.activeSankalpa = escapeHTML(ensureString(activeSankalpa).trim())
      } else {
        updates.activeSankalpa = sanitizeNoSql(activeSankalpa)
      }
    }
    if (dailySankalpa !== undefined) {
      updates.dailySankalpa = sanitizeNoSql(dailySankalpa)
    }
    if (wisdom !== undefined) {
      updates.wisdom = sanitizeNoSql(wisdom)
    }

    const user = await dbUpdateUserProfile(req.userId, updates)
    return res.status(200).json({ user })
  } catch (err) {
    console.error('Update profile error:', err)
    if (err.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(500).json({ error: 'Failed to update profile' })
  }
})

// PUT /avatar — Upload avatar (base64 string)
router.put('/avatar', async (req, res) => {
  try {
    let { avatar } = req.body
    if (avatar === undefined) {
      return res.status(400).json({ error: 'Avatar data is required' })
    }

    avatar = ensureString(avatar)

    // Strict Size Limit: Reject if base64 string exceeds 2.8 million characters (~2MB)
    if (avatar.length > 2800000) {
      return res.status(400).json({ error: 'Avatar file size must not exceed 2MB' })
    }

    if (avatar !== '') {
      const allowedPrefixes = [
        'data:image/jpeg;base64,',
        'data:image/png;base64,',
        'data:image/jpg;base64,'
      ]
      
      const isValidFormat = allowedPrefixes.some(prefix => avatar.toLowerCase().startsWith(prefix))
      if (!isValidFormat) {
        return res.status(400).json({ error: 'Only JPG, JPEG, and PNG images are allowed' })
      }

      // Strict Base64 validation: Ensure payload contains only valid base64 characters
      const commaIndex = avatar.indexOf(',')
      if (commaIndex === -1) {
        return res.status(400).json({ error: 'Invalid avatar data URL format' })
      }
      const base64Data = avatar.substring(commaIndex + 1)
      const base64Regex = /^[a-zA-Z0-9+/]*={0,2}$/
      if (!base64Regex.test(base64Data)) {
        return res.status(400).json({ error: 'Invalid base64 payload encoding' })
      }
    }

    const user = await dbUpdateUserAvatar(req.userId, avatar)
    return res.status(200).json({ user })
  } catch (err) {
    console.error('Update avatar error:', err)
    if (err.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(500).json({ error: 'Failed to update avatar' })
  }
})

// PUT /password — Change password
router.put('/password', async (req, res) => {
  try {
    let { currentPassword, newPassword } = req.body

    currentPassword = ensureString(currentPassword)
    newPassword = ensureString(newPassword)

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' })
    }

    const user = await dbFindUserById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPassword, salt)
    await dbChangePassword(req.userId, newPasswordHash)

    return res.status(200).json({ message: 'Password updated' })
  } catch (err) {
    console.error('Change password error:', err)
    return res.status(500).json({ error: 'Failed to change password' })
  }
})

// DELETE / — Delete account
router.delete('/', async (req, res) => {
  try {
    await dbDeleteUser(req.userId)
    return res.status(200).json({ message: 'Account deleted' })
  } catch (err) {
    console.error('Delete account error:', err)
    return res.status(500).json({ error: 'Failed to delete account' })
  }
})

// POST /adjust-points — Adjust user XP or pranaPoints
router.post('/adjust-points', async (req, res) => {
  try {
    const { xpDiff, pranaDiff } = req.body
    if (xpDiff === undefined && pranaDiff === undefined) {
      return res.status(400).json({ error: 'xpDiff or pranaDiff is required' })
    }
    const xpVal = Number(xpDiff || 0)
    const pranaVal = Number(pranaDiff || 0)
    console.log(`[Profile API AdjustPoints] User ${req.userId} adjusting points. Diffs -> XP: ${xpVal}, Prana: ${pranaVal}`)
    const user = await dbAdjustUserPoints(req.userId, xpVal, pranaVal)
    return res.status(200).json({ user })
  } catch (err) {
    console.error('Adjust points error:', err)
    return res.status(500).json({ error: 'Failed to adjust points' })
  }
})

export default router
