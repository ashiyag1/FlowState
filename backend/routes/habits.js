import express from 'express'
import { dbGetHabits, dbAddHabit, dbDeleteHabit, dbToggleHabit } from '../db.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.use(authMiddleware)

// GET habits
router.get('/', async (req, res) => {
  try {
    const data = await dbGetHabits(req.userId)
    return res.status(200).json(data)
  } catch (err) {
    console.error('GET habits route error:', err)
    return res.status(500).json({ error: 'Failed to retrieve habits list' })
  }
})

// POST habit additions/toggles
router.post('/', async (req, res) => {
  try {
    const { toggle, habitId, date, time, name, icon, color } = req.body

    if (toggle) {
      if (!habitId || !date || !time) {
        return res.status(400).json({ error: 'habitId, date, and time are required for toggle' })
      }
      await dbToggleHabit(req.userId, date, habitId, time)
      return res.status(200).json({ success: true, message: 'Habit execution toggled' })
    }

    if (!name || !icon || !color) {
      return res.status(400).json({ error: 'name, icon, and color are required' })
    }

    const habit = await dbAddHabit(req.userId, { name, icon, color })
    return res.status(201).json(habit)
  } catch (err) {
    console.error('POST habits route error:', err)
    return res.status(500).json({ error: 'Failed to update habit' })
  }
})

// DELETE habit
router.delete('/', async (req, res) => {
  try {
    const { habitId } = req.body
    if (!habitId) {
      return res.status(400).json({ error: 'habitId is required for deletion' })
    }
    await dbDeleteHabit(req.userId, habitId)
    return res.status(200).json({ success: true, message: 'Habit deleted successfully' })
  } catch (err) {
    console.error('DELETE habits route error:', err)
    return res.status(500).json({ error: 'Failed to delete habit' })
  }
})

export default router
