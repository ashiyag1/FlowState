import express from 'express'
import { dbGetHabits, dbAddHabit, dbDeleteHabit, dbToggleHabit, dbAdjustUserPoints } from '../db.js'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML } from '../utils/security.js'

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
    const { toggle, habitId, date, time, name, icon, color, cycleLength, relaxDay, streakFreezes } = req.body

    if (toggle) {
      const sanitizedHabitId = ensureString(habitId).trim()
      const sanitizedDate = ensureString(date).trim()
      const sanitizedTime = ensureString(time).trim()

      if (!sanitizedHabitId || !sanitizedDate || !sanitizedTime) {
        return res.status(400).json({ error: 'habitId, date, and time are required for toggle' })
      }
      const isDone = await dbToggleHabit(req.userId, sanitizedDate, sanitizedHabitId, sanitizedTime)
      
      const { habits, habitDone } = await dbGetHabits(req.userId)
      const todayDone = habitDone[sanitizedDate] || {}
      const completedCount = habits.filter(h => todayDone[h.id]).length
      const totalCount = habits.length
      
      let xpDiff = isDone ? 25 : -25
      let pranaDiff = 0
      
      if (isDone) {
        if (totalCount > 0 && completedCount === totalCount) {
          pranaDiff = 10
        }
      } else {
        if (totalCount > 0 && completedCount === totalCount - 1) {
          pranaDiff = -10
        }
      }
      
      console.log(`[Habits API Toggle] User ${req.userId} toggled ${sanitizedHabitId} to ${isDone}. Diffs -> XP: ${xpDiff}, Prana: ${pranaDiff}. Completed: ${completedCount}/${totalCount}`)
      const user = await dbAdjustUserPoints(req.userId, xpDiff, pranaDiff)
      
      return res.status(200).json({ 
        success: true, 
        message: 'Habit execution toggled', 
        isDone, 
        user 
      })
    }

    const sanitizedName = escapeHTML(ensureString(name).trim())
    const sanitizedIcon = escapeHTML(ensureString(icon).trim())
    const sanitizedColor = escapeHTML(ensureString(color).trim())
    const sanitizedRelaxDay = escapeHTML(ensureString(relaxDay || 'None').trim())
    const parsedCycleLength = Number(cycleLength || 7)
    const parsedStreakFreezes = Number(streakFreezes ?? 3)

    if (!sanitizedName || !sanitizedIcon || !sanitizedColor) {
      return res.status(400).json({ error: 'name, icon, and color are required' })
    }

    const habit = await dbAddHabit(req.userId, { 
      name: sanitizedName, 
      icon: sanitizedIcon, 
      color: sanitizedColor, 
      cycleLength: isNaN(parsedCycleLength) ? 7 : parsedCycleLength, 
      relaxDay: sanitizedRelaxDay, 
      streakFreezes: isNaN(parsedStreakFreezes) ? 3 : parsedStreakFreezes 
    })
    return res.status(201).json(habit)
  } catch (err) {
    console.error('POST habits route error:', err)
    return res.status(500).json({ error: 'Failed to update habit' })
  }
})

// DELETE habit
router.delete('/', async (req, res) => {
  try {
    const habitId = ensureString(req.body.habitId).trim()
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
