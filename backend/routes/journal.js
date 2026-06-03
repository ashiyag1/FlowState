import express from 'express'
import { dbGetJournal, dbAddJournalEntry, dbDeleteJournalEntry, dbGetMoodTrends } from '../db.js'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML } from '../utils/security.js'

const router = express.Router()

router.use(authMiddleware)

// GET mood trends (heatmap + 7-day chart + stats)
router.get('/mood-trends', async (req, res) => {
  try {
    const data = await dbGetMoodTrends(req.userId)
    return res.status(200).json(data)
  } catch (err) {
    console.error('GET mood-trends error:', err)
    return res.status(500).json({ error: 'Failed to retrieve mood trends' })
  }
})

// GET journal entries
router.get('/', async (req, res) => {
  try {
    const data = await dbGetJournal(req.userId)
    return res.status(200).json(data)
  } catch (err) {
    console.error('GET journal route error:', err)
    return res.status(500).json({ error: 'Failed to retrieve journal entries' })
  }
})

// POST journal entry
router.post('/', async (req, res) => {
  try {
    let { id, date, time, text, mood } = req.body

    id = ensureString(id).trim()
    date = ensureString(date).trim()
    time = ensureString(time).trim()
    text = escapeHTML(ensureString(text).trim())
    mood = escapeHTML(ensureString(mood).trim())

    if (!id || !date || !time || !text) {
      return res.status(400).json({ error: 'id, date, time, and text are required' })
    }

    // Prevent oversized entries from filling the database
    if (text.length > 50000) {
      return res.status(400).json({ error: 'Journal entry too long (max 50,000 characters)' })
    }

    await dbAddJournalEntry(req.userId, { id, date, time, text, mood })
    return res.status(201).json({ success: true, message: 'Journal entry created' })
  } catch (err) {
    console.error('POST journal route error:', err)
    return res.status(500).json({ error: 'Failed to save journal entry' })
  }
})

// DELETE journal entry
router.delete('/', async (req, res) => {
  try {
    let { id } = req.body
    id = ensureString(id).trim()
    if (!id) {
      return res.status(400).json({ error: 'id is required for deletion' })
    }
    await dbDeleteJournalEntry(req.userId, id)
    return res.status(200).json({ success: true, message: 'Journal entry deleted' })
  } catch (err) {
    console.error('DELETE journal route error:', err)
    return res.status(500).json({ error: 'Failed to delete journal entry' })
  }
})

export default router
