import express from 'express'
import { dbGetCommunityFeed, dbGetIntentions, dbAddIntention, dbFindUserById } from '../db.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.get('/feed', async (req, res) => {
  try {
    const activities = await dbGetCommunityFeed()
    res.json({ activities })
  } catch (err) {
    console.error('Community feed error:', err)
    res.status(500).json({ error: 'Failed to load community feed' })
  }
})

router.get('/intentions', async (req, res) => {
  try {
    const intentions = await dbGetIntentions()
    res.json({ intentions })
  } catch (err) {
    console.error('Intentions fetch error:', err)
    res.status(500).json({ error: 'Failed to load intentions' })
  }
})

router.post('/intentions', authMiddleware, async (req, res) => {
  try {
    const { text, author } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Intention text is required' })
    }
    let name = author || 'Seeker'
    if (!author && req.userId) {
      const u = await dbFindUserById(req.userId)
      if (u) name = u.name.split(' ')[0]
    }
    const intention = await dbAddIntention(name, text.trim())
    res.status(201).json(intention)
  } catch (err) {
    console.error('Add intention error:', err)
    res.status(500).json({ error: 'Failed to add intention' })
  }
})

export default router
