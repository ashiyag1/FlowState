import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { signup, login, getMe, googleLogin } from '../controllers/authController.js'

const router = express.Router()

// Signup Route
router.post('/signup', signup)

// Login Route
router.post('/login', login)

// Get Profile Route
router.get('/me', authMiddleware, getMe)

// Google OAuth
router.post('/google', googleLogin)

export default router
