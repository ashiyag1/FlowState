import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getMoodTrends, getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from '../controllers/journalController.js'

const router = express.Router()

router.use(authMiddleware)

// GET mood trends (heatmap + 7-day chart + stats)
router.get('/mood-trends', getMoodTrends)

// GET journal entries
router.get('/', getJournalEntries)

// POST journal entry
router.post('/', createJournalEntry)

// PATCH journal entry (edit text/mood)
router.patch('/', updateJournalEntry)

// DELETE journal entry
router.delete('/', deleteJournalEntry)

export default router
