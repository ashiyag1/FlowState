import express from 'express'
import { dbGetCommunityFeed, dbGetIntentions, dbAddIntention, dbFindUserById } from '../db.js'
import authMiddleware from '../middleware/auth.js'
import { ensureString, escapeHTML } from '../utils/security.js'

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
    let { text } = req.body
    
    text = escapeHTML(ensureString(text).trim())

    if (!text) {
      return res.status(400).json({ error: 'Intention text is required' })
    }

    // Use the verified server-side user name — never trust client-supplied author
    const user = await dbFindUserById(req.userId)
    const name = (user && user.name) ? user.name : 'Seeker'
    
    const intention = await dbAddIntention(name, text)
    res.status(201).json(intention)
  } catch (err) {
    console.error('Add intention error:', err)
    res.status(500).json({ error: 'Failed to add intention' })
  }
})

export default router
