import express from 'express'
import { dbGetWater, dbSaveWaterGoal, dbAddWaterEntry, dbRemoveWaterEntry, dbClearWaterToday } from '../db.js'
import authMiddleware from '../middleware/auth.js'

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
      await dbSaveWaterGoal(req.userId, Number(waterGoal))
      return res.status(200).json({ success: true, message: 'Water goal updated' })
    }

    if (date && entry) {
      await dbAddWaterEntry(req.userId, date, entry)
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
      await dbRemoveWaterEntry(req.userId, date, entryId)
      return res.status(200).json({ success: true, message: 'Water entry deleted' })
    }

    if (date && clear) {
      await dbClearWaterToday(req.userId, date)
      return res.status(200).json({ success: true, message: 'Water logs cleared' })
    }

    return res.status(400).json({ error: 'Invalid parameters for water deletion' })
  } catch (err) {
    console.error('DELETE water route error:', err)
    return res.status(500).json({ error: 'Failed to delete water log' })
  }
})

export default router
