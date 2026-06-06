import mongoose from 'mongoose'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { DEFAULT_BADGES } from './badgesConfig.js'
import Badge from '../models/Badge.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const JSON_DB_PATH = path.resolve(__dirname, '../db.json')

let MONGODB_URI = process.env.MONGODB_URI || ''
let IS_MONGO = !!MONGODB_URI

export function getIsMongo() {
  return IS_MONGO
}

export function setIsMongo(val) {
  IS_MONGO = val
}

let jsonDbInitialized = false
let connectionPromise = null

export async function connectDB() {
  // Lazy env detection
  if (!MONGODB_URI && process.env.MONGODB_URI) {
    MONGODB_URI = process.env.MONGODB_URI
    IS_MONGO = true
  }
  if (IS_MONGO) {
    if (mongoose.connection.readyState >= 1) return
    if (connectionPromise) {
      await connectionPromise
      return
    }
    connectionPromise = (async () => {
      try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected successfully')
        
        // 🚀 Optimization: Only run badge sync if the badges are not yet seeded
        const badgeCount = await Badge.countDocuments()
        if (badgeCount !== DEFAULT_BADGES.length) {
          console.log('Seeding/updating default badges in MongoDB...')
          await Promise.all(
            DEFAULT_BADGES.map(badge =>
              Badge.findOneAndUpdate(
                { badgeId: badge.badgeId },
                { $set: badge },
                { upsert: true }
              )
            )
          )
          console.log('Default badges synchronized successfully')
        } else {
          console.log('Badges already synchronized, skipping sync query')
        }
      } catch (err) {
        console.error('MongoDB connection error — falling back to JSON file database:', err)
        IS_MONGO = false
      }
    })()
    
    await connectionPromise
    if (IS_MONGO) return
  }
  if (!IS_MONGO) {
    // JSON-based local DB — only initialize once per server process
    if (jsonDbInitialized) return
    jsonDbInitialized = true
    let fileExists = false
    try {
      await fs.access(JSON_DB_PATH)
      fileExists = true
    } catch {
      fileExists = false
    }

    if (!fileExists) {
      // File does not exist — create fresh empty database
      const initialDb = {
        users: [],
        waterLogs: {},
        habits: [],
        habitDone: {},
        journalEntries: [],
        intentions: [],
        badges: DEFAULT_BADGES,
        userBadges: []
      }
      await fs.writeFile(JSON_DB_PATH, JSON.stringify(initialDb, null, 2))
      console.log('Local JSON database initialized at:', JSON_DB_PATH)
    } else {
      // File exists — read, migrate schema, and sync badge definitions
      try {
        const data = await fs.readFile(JSON_DB_PATH, 'utf-8')
        const db = JSON.parse(data)
        let updated = false

        // Always sync latest badge definitions (targets, descriptions)
        db.badges = DEFAULT_BADGES
        updated = true

        if (!db.userBadges) { db.userBadges = []; updated = true }

        // Migrate users with old number-based stats to new date-array schema
        for (const user of (db.users || [])) {
          if (user.xp === undefined) { user.xp = 0; updated = true }
          if (user.pranaPoints === undefined) { user.pranaPoints = 0; updated = true }
          if (!user.stats) {
            user.stats = { sankalpaDates: [], breathingDates: [], wisdomDates: [], booksOpened: [], sunriseDates: [], midnightJournalDates: [], pagesRead: [] }
            updated = true
          } else {
            let m = false
            if (typeof user.stats.wisdomCount === 'number') { delete user.stats.wisdomCount; m = true }
            if (typeof user.stats.breathingCount === 'number') { delete user.stats.breathingCount; m = true }
            if (typeof user.stats.sankalpaCount === 'number') { delete user.stats.sankalpaCount; m = true }
            if (typeof user.stats.sunriseActivities === 'number') { delete user.stats.sunriseActivities; m = true }
            if (typeof user.stats.midnightJournals === 'number') { delete user.stats.midnightJournals; m = true }
            if (!Array.isArray(user.stats.sankalpaDates)) { user.stats.sankalpaDates = []; m = true }
            if (!Array.isArray(user.stats.breathingDates)) { user.stats.breathingDates = []; m = true }
            if (!Array.isArray(user.stats.wisdomDates)) { user.stats.wisdomDates = []; m = true }
            if (!Array.isArray(user.stats.booksOpened)) { user.stats.booksOpened = []; m = true }
            if (!Array.isArray(user.stats.sunriseDates)) { user.stats.sunriseDates = []; m = true }
            if (!Array.isArray(user.stats.midnightJournalDates)) { user.stats.midnightJournalDates = []; m = true }
            if (!Array.isArray(user.stats.pagesRead)) { user.stats.pagesRead = []; m = true }
            if (m) updated = true
          }
        }

        // Reset any userBadges that were unlocked with wrong targets
        for (const ub of (db.userBadges || [])) {
          if (ub.badgeId === 'third_eye_open' && ub.targetProgress !== 21) {
            ub.targetProgress = 21; ub.progress = 0; ub.isUnlocked = false; delete ub.unlockedAt; updated = true
          }
          if (ub.badgeId === 'wisdom_seeker' && ub.targetProgress !== 3) {
            ub.targetProgress = 3; ub.progress = 0; ub.isUnlocked = false; delete ub.unlockedAt; updated = true
          }
        }

        if (updated) {
          await fs.writeFile(JSON_DB_PATH, JSON.stringify(db, null, 2))
          console.log('Local JSON database synced and migrated successfully')
        }
      } catch (parseErr) {
        console.error('WARNING: db.json could not be parsed — file preserved as-is:', parseErr.message)
      }
    }
  }
}
