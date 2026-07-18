import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getHabits, updateHabits, deleteHabits } from '../controllers/habitsController.js'

const router = express.Router()

router.use(authMiddleware)

// GET habits
router.get('/', getHabits)

// POST habit additions/toggles
router.post('/', updateHabits)

// DELETE habit
router.delete('/', deleteHabits)

export default router
