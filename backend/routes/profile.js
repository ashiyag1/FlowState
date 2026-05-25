import express from 'express'
import bcrypt from 'bcryptjs'
import authMiddleware from '../middleware/auth.js'
import {
  dbFindUserById,
  dbUpdateUserProfile,
  dbUpdateUserAvatar,
  dbChangePassword,
  dbDeleteUser
} from '../db.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// PUT / — Update profile info (name, bio, location, preferences)
router.put('/', async (req, res) => {
  try {
    const { name, bio, location, preferences } = req.body
    const updates = {}
    if (name !== undefined) updates.name = name
    if (bio !== undefined) updates.bio = bio
    if (location !== undefined) updates.location = location
    if (preferences !== undefined) updates.preferences = preferences

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
    const { avatar } = req.body
    if (avatar === undefined) {
      return res.status(400).json({ error: 'Avatar data is required' })
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
    const { currentPassword, newPassword } = req.body

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

export default router
