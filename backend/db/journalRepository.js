import JournalEntry from '../models/JournalEntry.js'
import { connectDB, getIsMongo } from './connection.js'
import { readJsonDB, writeJsonDB } from './jsonEngine.js'

export async function dbGetJournal(userId) {
  await connectDB()
  if (getIsMongo()) {
    const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 })
    return entries.map(e => ({
      id: e.id,
      date: e.date,
      time: e.time,
      text: e.text,
      mood: e.mood
    }))
  } else {
    const db = await readJsonDB()
    return db.journalEntries
      .filter(e => e.userId === userId)
      .map(e => ({ id: e.id, date: e.date, time: e.time, text: e.text, mood: e.mood }))
      .reverse()
  }
}

export async function dbAddJournalEntry(userId, entry) {
  await connectDB()
  const createdAt = new Date().toISOString()
  if (getIsMongo()) {
    const newEntry = new JournalEntry({
      userId,
      id: entry.id,
      date: entry.date,
      time: entry.time,
      text: entry.text,
      mood: entry.mood,
      createdAt
    })
    await newEntry.save()
  } else {
    const db = await readJsonDB()
    const newEntry = {
      userId,
      id: entry.id,
      date: entry.date,
      time: entry.time,
      text: entry.text,
      mood: entry.mood,
      createdAt
    }
    db.journalEntries.push(newEntry)
    await writeJsonDB(db)
  }
}

export async function dbDeleteJournalEntry(userId, entryId) {
  await connectDB()
  if (getIsMongo()) {
    await JournalEntry.deleteOne({ userId, id: entryId })
  } else {
    const db = await readJsonDB()
    db.journalEntries = db.journalEntries.filter(e => !(e.userId === userId && e.id === entryId))
    await writeJsonDB(db)
  }
}

export async function dbGetMoodTrends(userId) {
  await connectDB()
  let entries = []
  if (getIsMongo()) {
    const raw = await JournalEntry.find({ userId }).sort({ createdAt: -1 }).lean()
    entries = raw.map(e => ({ date: e.date, mood: e.mood || '' }))
  } else {
    const db = await readJsonDB()
    entries = db.journalEntries
      .filter(e => e.userId === userId)
      .map(e => ({ date: e.date, mood: e.mood || '' }))
  }

  // Build mood counts
  const moodCounts = {}
  // Build per-day moods: { '2025-05-24': 'Calm', ... } (last mood of the day wins)
  const dayMoods = {}
  // Build calendar heatmap: last 60 days with mood/count
  const heatmap = {}

  for (const e of entries) {
    if (!e.date) continue
    // Mood counts
    if (e.mood) {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
    }
    // Day moods (last entry per day wins)
    if (!dayMoods[e.date]) {
      dayMoods[e.date] = e.mood || 'none'
    }
    // Heatmap entry
    if (!heatmap[e.date]) {
      heatmap[e.date] = { count: 0, mood: e.mood || 'none' }
    }
    heatmap[e.date].count++
    if (e.mood) heatmap[e.date].mood = e.mood
  }

  // 7-day window: get moods for the last 7 days in order
  const sevenDayMoods = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    sevenDayMoods.push({ date: ds, mood: dayMoods[ds] || null })
  }

  // Compute top mood
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  // Journal streak
  const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const expected = d.toISOString().slice(0, 10)
    if (sortedDates[i] === expected) streak++
    else break
  }

  return { moodCounts, dayMoods, heatmap, sevenDayMoods, topMood, streak, totalEntries: entries.length }
}
