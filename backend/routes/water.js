import express from 'express'
import { dbGetWater, dbSaveWaterGoal, dbAddWaterEntry, dbRemoveWaterEntry, dbClearWaterToday } from '../db.js'
import authMiddleware from '../middleware/auth.js'
import { ensureString, sanitizeNoSql } from '../utils/security.js'

const router = express.Router()

router.use(authMiddleware)

// GET water details
router.get('/', async (req, res) => {
  try {
    const data = await dbGetWater(req.userId)
    return res.status(200).json(data)
  } catch (err) {
    console.error('GET water route error:', err)
    return res.status(500).json({ error: 'Failed to retrieve water logs' })
  }
})

// POST water updates
router.post('/', async (req, res) => {
  try {
    const { waterGoal, date, entry } = req.body

    if (waterGoal !== undefined) {
      const parsedGoal = Number(waterGoal)
      if (isNaN(parsedGoal) || parsedGoal <= 0) {
        return res.status(400).json({ error: 'Invalid water goal amount' })
      }
      await dbSaveWaterGoal(req.userId, parsedGoal)
      return res.status(200).json({ success: true, message: 'Water goal updated' })
    }

    if (date && entry) {
      const sanitizedDate = ensureString(date).trim()
      const sanitizedEntry = sanitizeNoSql(entry)
      if (sanitizedEntry && typeof sanitizedEntry === 'object') {
        if (sanitizedEntry.id) sanitizedEntry.id = ensureString(sanitizedEntry.id)
        if (sanitizedEntry.time) sanitizedEntry.time = ensureString(sanitizedEntry.time)
        if (sanitizedEntry.amount) sanitizedEntry.amount = Number(sanitizedEntry.amount || 0)
      }
      await dbAddWaterEntry(req.userId, sanitizedDate, sanitizedEntry)
      return res.status(201).json({ success: true, message: 'Water log entry added' })
    }

    return res.status(400).json({ error: 'Invalid parameters for water update' })
  } catch (err) {
    console.error('POST water route error:', err)
    return res.status(500).json({ error: 'Failed to save water updates' })
  }
})

// DELETE water logs
router.delete('/', async (req, res) => {
  try {
    const { date, entryId, clear } = req.body

    if (date && entryId) {
      await dbRemoveWaterEntry(req.userId, ensureString(date).trim(), ensureString(entryId).trim())
      return res.status(200).json({ success: true, message: 'Water entry deleted' })
    }

    if (date && clear) {
      await dbClearWaterToday(req.userId, ensureString(date).trim())
      return res.status(200).json({ success: true, message: 'Water logs cleared' })
    }

    return res.status(400).json({ error: 'Invalid parameters for water deletion' })
  } catch (err) {
    console.error('DELETE water route error:', err)
    return res.status(500).json({ error: 'Failed to delete water log' })
  }
})

export default router
