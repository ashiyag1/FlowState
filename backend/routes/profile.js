import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { updateProfile, updateAvatar, changePassword, deleteAccount, adjustPoints } from '../controllers/profileController.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// PUT / — Update profile info (name, bio, location, preferences, activeSankalpa, dailySankalpa, wisdom)
router.put('/', updateProfile)

// PUT /avatar — Upload avatar (base64 string)
router.put('/avatar', updateAvatar)

// PUT /password — Change password
router.put('/password', changePassword)

// DELETE / — Delete account
router.delete('/', deleteAccount)

// POST /adjust-points — Adjust user XP or pranaPoints
router.post('/adjust-points', adjustPoints)

export default router
