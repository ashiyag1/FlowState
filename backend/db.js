import mongoose from 'mongoose'
import fs from 'fs/promises'
import path from 'path'

const MONGODB_URI = process.env.MONGODB_URI
const IS_MONGO = !!MONGODB_URI
const JSON_DB_PATH = path.join(process.cwd(), 'db.json')

// ── HELPER: compute habit streak for a user ──────────────
function computeStreakFromDone(done) {
  if (!done || Object.keys(done).length === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 366; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayDone = done[dateStr]
    if (dayDone && Object.keys(dayDone).length > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently'
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'Yesterday'
  return `${Math.floor(diff / 86400)}d ago`
}

// ── MONGOOSE SCHEMAS & MODELS ───────────────────────────
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, default: 'light' },
    soundEnabled: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true }
  },
  stats: {
    sankalpaCount: { type: Number, default: 0 },
    breathingCount: { type: Number, default: 0 },
    wisdomCount: { type: Number, default: 0 },
    booksOpened: { type: [String], default: [] },
    sunriseActivities: { type: Number, default: 0 },
    midnightJournals: { type: Number, default: 0 }
  }
})

const WaterLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  waterGoal: { type: Number, default: 2500 },
  logs: { type: Map, of: [{ id: String, ml: Number, label: String, time: String }], default: {} }
})

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

const HabitDoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  done: { type: Map, of: { type: Map, of: String }, default: {} } // date -> { habitId: time }
})

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  text: { type: String, required: true },
  mood: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

const BadgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageFilename: { type: String, required: true },
  category: { type: String, required: true }, // streaks, wisdom, journaling, rituals, wellness, legendary
  rarity: { type: String, required: true }, // Common, Uncommon, Rare, Legendary
  targetProgress: { type: Number, required: true }
})

const UserBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  isUnlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date }
})
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

let User, WaterLog, Habit, HabitDone, JournalEntry, Badge, UserBadge

if (IS_MONGO) {
  User = mongoose.models.User || mongoose.model('User', UserSchema)
  WaterLog = mongoose.models.WaterLog || mongoose.model('WaterLog', WaterLogSchema)
  Habit = mongoose.models.Habit || mongoose.model('Habit', HabitSchema)
  HabitDone = mongoose.models.HabitDone || mongoose.model('HabitDone', HabitDoneSchema)
  JournalEntry = mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema)
  Badge = mongoose.models.Badge || mongoose.model('Badge', BadgeSchema)
  UserBadge = mongoose.models.UserBadge || mongoose.model('UserBadge', UserBadgeSchema)
}

export { User, WaterLog, Habit, HabitDone, JournalEntry, Badge, UserBadge }

// ── DEFAULT BADGES SEED ──────────────────────────────────
const DEFAULT_BADGES = [
  {
    badgeId: "3_day_streak",
    title: "3 Day Streak",
    description: "Maintain a habit streak of 3 days.",
    imageFilename: "3_day_streak.png",
    category: "streaks",
    rarity: "Common",
    targetProgress: 3
  },
  {
    badgeId: "journalled_10_times",
    title: "Journalled 10 Times",
    description: "Write 10 journal entries.",
    imageFilename: "journalled_10_times.png",
    category: "journaling",
    rarity: "Common",
    targetProgress: 10
  },
  {
    badgeId: "hydration_sage",
    title: "Hydration Sage",
    description: "Meet your water goals on 5 different days.",
    imageFilename: "hydration_sage.png",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "wisdom_seeker",
    title: "Wisdom Seeker",
    description: "Read daily wisdom quotes 5 times.",
    imageFilename: "wisdom_seeker.png",
    category: "wisdom",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "cosmic_rhythm",
    title: "Cosmic Rhythm",
    description: "Log wellness activity for 7 consecutive days.",
    imageFilename: "cosmic_rhythm.png",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 7
  },
  {
    badgeId: "sunrise_consistency",
    title: "Sunrise Consistency",
    description: "Complete habit or breathing before 8 AM on 3 days.",
    imageFilename: "sunrise_consistency.png",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 3
  },
  {
    badgeId: "third_eye_open",
    title: "Third Eye Open",
    description: "Open and read from 3 different books in Wisdom Library.",
    imageFilename: "third_eye_open.png",
    category: "wisdom",
    rarity: "Rare",
    targetProgress: 3
  },
  {
    badgeId: "the_unshaken",
    title: "The Unshaken",
    description: "Maintain a habit streak of 10 days.",
    imageFilename: "the_unshaken.png",
    category: "legendary",
    rarity: "Legendary",
    targetProgress: 10
  },
  {
    badgeId: "Sankalpa_keeper",
    title: "Sankalpa Keeper",
    description: "Commit to and fulfill Daily Sankalpa on 5 days.",
    imageFilename: "Sankalpa_keeper.png",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "calm_mind",
    title: "Calm Mind",
    description: "Practice breathing exercises or meditation 5 times.",
    imageFilename: "calm_mind.png",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "daily_journaling_30_times",
    title: "Daily Reflection Sage",
    description: "Write 30 daily journal entries.",
    imageFilename: "daily_journaling_30_times.png",
    category: "journaling",
    rarity: "Rare",
    targetProgress: 30
  },
  {
    badgeId: "discipline_builder",
    title: "Discipline Builder",
    description: "Complete at least 5 habits in a single day.",
    imageFilename: "discipline_builder.png",
    category: "streaks",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "focus_monk",
    title: "Focus Monk",
    description: "Complete breathing portal sessions 10 times.",
    imageFilename: "focus_monk.png",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 10
  },
  {
    badgeId: "midnight_reflector",
    title: "Midnight Reflector",
    description: "Log a night reflection journal entry (after 9 PM) on 3 days.",
    imageFilename: "midnight_reflector.png",
    category: "journaling",
    rarity: "Uncommon",
    targetProgress: 3
  }
]
export { DEFAULT_BADGES }

// ── CONNECT FUNCTION ────────────────────────────────────
export async function connectDB() {
  if (IS_MONGO) {
    if (mongoose.connection.readyState >= 1) return
    try {
      await mongoose.connect(MONGODB_URI)
      console.log('MongoDB connected successfully')
      
      // Seed default badges
      const count = await Badge.countDocuments()
      if (count === 0) {
        await Badge.insertMany(DEFAULT_BADGES)
        console.log('Default badges seeded in MongoDB')
      }
    } catch (err) {
      console.error('MongoDB connection error:', err)
      throw err
    }
  } else {
    try {
      await fs.access(JSON_DB_PATH)
      const data = await fs.readFile(JSON_DB_PATH, 'utf-8')
      const db = JSON.parse(data)
      let updated = false
      if (!db.badges || db.badges.length === 0) {
        db.badges = DEFAULT_BADGES
        updated = true
      }
      if (!db.userBadges) {
        db.userBadges = []
        updated = true
      }
      if (updated) {
        await fs.writeFile(JSON_DB_PATH, JSON.stringify(db, null, 2))
        console.log('Local JSON database badges initialized')
      }
    } catch {
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
    }
  }
}

// ── JSON FILE HELPERS ───────────────────────────────────
async function readJsonDB() {
  await connectDB()
  const data = await fs.readFile(JSON_DB_PATH, 'utf-8')
  return JSON.parse(data)
}

async function writeJsonDB(db) {
  await fs.writeFile(JSON_DB_PATH, JSON.stringify(db, null, 2))
}

// ── DATABASE INTERFACE METHODS ──────────────────────────
export async function dbCreateUser(name, email, passwordHash) {
  await connectDB()
  if (IS_MONGO) {
    const user = new User({ name, email, password: passwordHash })
    return await user.save()
  } else {
    const db = await readJsonDB()
    if (db.users.find(u => u.email === email)) {
      throw new Error('User already exists')
    }
    const newUser = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      email,
      password: passwordHash,
      avatar: '',
      bio: '',
      location: '',
      joinedAt: new Date().toISOString(),
      preferences: { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      stats: { sankalpaCount: 0, breathingCount: 0, wisdomCount: 0, booksOpened: [], sunriseActivities: 0, midnightJournals: 0 }
    }
    db.users.push(newUser)
    await writeJsonDB(db)
    return newUser
  }
}

export async function dbFindUserByEmail(email) {
  await connectDB()
  if (IS_MONGO) {
    return await User.findOne({ email })
  } else {
    const db = await readJsonDB()
    return db.users.find(u => u.email === email) || null
  }
}

export async function dbFindUserById(id) {
  await connectDB()
  if (IS_MONGO) {
    return await User.findById(id)
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === id)
    return user ? {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt || new Date().toISOString(),
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      stats: user.stats || { sankalpaCount: 0, breathingCount: 0, wisdomCount: 0, booksOpened: [], sunriseActivities: 0, midnightJournals: 0 }
    } : null
  }
}

// ── WATER LOG METHODS ──────────────────────────────────
export async function dbGetWater(userId) {
  await connectDB()
  if (IS_MONGO) {
    let doc = await WaterLog.findOne({ userId })
    if (!doc) {
      doc = await WaterLog.create({ userId, waterGoal: 2500, logs: {} })
    }
    return { waterGoal: doc.waterGoal, logs: Object.fromEntries(doc.logs) }
  } else {
    const db = await readJsonDB()
    if (!db.waterLogs[userId]) {
      db.waterLogs[userId] = { waterGoal: 2500, logs: {} }
      await writeJsonDB(db)
    }
    return db.waterLogs[userId]
  }
}

export async function dbSaveWaterGoal(userId, waterGoal) {
  await connectDB()
  if (IS_MONGO) {
    await WaterLog.findOneAndUpdate({ userId }, { waterGoal }, { upsert: true })
  } else {
    const db = await readJsonDB()
    if (!db.waterLogs[userId]) db.waterLogs[userId] = { waterGoal: 2500, logs: {} }
    db.waterLogs[userId].waterGoal = waterGoal
    await writeJsonDB(db)
  }
}

export async function dbAddWaterEntry(userId, date, entry) {
  await connectDB()
  if (IS_MONGO) {
    let doc = await WaterLog.findOne({ userId })
    if (!doc) doc = new WaterLog({ userId, waterGoal: 2500, logs: {} })
    const dayLogs = doc.logs.get(date) || []
    dayLogs.push(entry)
    doc.logs.set(date, dayLogs)
    await doc.save()
  } else {
    const db = await readJsonDB()
    if (!db.waterLogs[userId]) db.waterLogs[userId] = { waterGoal: 2500, logs: {} }
    if (!db.waterLogs[userId].logs[date]) db.waterLogs[userId].logs[date] = []
    db.waterLogs[userId].logs[date].push(entry)
    await writeJsonDB(db)
  }
}

export async function dbRemoveWaterEntry(userId, date, entryId) {
  await connectDB()
  if (IS_MONGO) {
    const doc = await WaterLog.findOne({ userId })
    if (doc && doc.logs.has(date)) {
      const dayLogs = doc.logs.get(date).filter(e => e.id !== entryId)
      doc.logs.set(date, dayLogs)
      await doc.save()
    }
  } else {
    const db = await readJsonDB()
    if (db.waterLogs[userId] && db.waterLogs[userId].logs[date]) {
      db.waterLogs[userId].logs[date] = db.waterLogs[userId].logs[date].filter(e => e.id !== entryId)
      await writeJsonDB(db)
    }
  }
}

export async function dbClearWaterToday(userId, date) {
  await connectDB()
  if (IS_MONGO) {
    const doc = await WaterLog.findOne({ userId })
    if (doc) {
      doc.logs.set(date, [])
      await doc.save()
    }
  } else {
    const db = await readJsonDB()
    if (db.waterLogs[userId] && db.waterLogs[userId].logs[date]) {
      db.waterLogs[userId].logs[date] = []
      await writeJsonDB(db)
    }
  }
}

// ── HABITS METHODS ─────────────────────────────────────
export async function dbGetHabits(userId) {
  await connectDB()
  if (IS_MONGO) {
    const list = await Habit.find({ userId }).sort({ createdAt: 1 })
    const doneDoc = await HabitDone.findOne({ userId })
    const habitsList = list.map(h => ({
      id: h._id.toString(),
      name: h.name,
      icon: h.icon,
      color: h.color,
      createdAt: h.createdAt.toISOString()
    }))
    return {
      habits: habitsList,
      habitDone: doneDoc ? Object.fromEntries(doneDoc.done) : {}
    }
  } else {
    const db = await readJsonDB()
    const habits = db.habits
      .filter(h => h.userId === userId)
      .map(h => ({ id: h.id, name: h.name, icon: h.icon, color: h.color, createdAt: h.createdAt }))
    const habitDone = db.habitDone[userId] || {}
    return { habits, habitDone }
  }
}

export async function dbAddHabit(userId, habit) {
  await connectDB()
  const habitId = IS_MONGO ? new mongoose.Types.ObjectId() : Math.random().toString(36).slice(2, 9)
  const createdAt = new Date().toISOString()
  
  if (IS_MONGO) {
    const newHabit = new Habit({
      _id: habitId,
      userId,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      createdAt
    })
    await newHabit.save()
    return { id: habitId.toString(), ...habit, createdAt }
  } else {
    const db = await readJsonDB()
    const newHabit = {
      id: habitId,
      userId,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      createdAt
    }
    db.habits.push(newHabit)
    await writeJsonDB(db)
    return { id: habitId, ...habit, createdAt }
  }
}

export async function dbDeleteHabit(userId, habitId) {
  await connectDB()
  if (IS_MONGO) {
    await Habit.deleteOne({ _id: habitId, userId })
    const doneDoc = await HabitDone.findOne({ userId })
    if (doneDoc) {
      for (const [date, dayCompletions] of doneDoc.done.entries()) {
        if (dayCompletions[habitId]) {
          delete dayCompletions[habitId]
          doneDoc.done.set(date, dayCompletions)
        }
      }
      await doneDoc.save()
    }
  } else {
    const db = await readJsonDB()
    db.habits = db.habits.filter(h => !(h.id === habitId && h.userId === userId))
    if (db.habitDone[userId]) {
      for (const date in db.habitDone[userId]) {
        if (db.habitDone[userId][date][habitId]) {
          delete db.habitDone[userId][date][habitId]
        }
      }
    }
    await writeJsonDB(db)
  }
}

export async function dbToggleHabit(userId, date, habitId, time) {
  await connectDB()
  if (IS_MONGO) {
    let doc = await HabitDone.findOne({ userId })
    if (!doc) doc = new HabitDone({ userId, done: {} })
    
    const day = doc.done.get(date) || {}
    if (day[habitId]) {
      delete day[habitId]
    } else {
      day[habitId] = time
    }
    doc.done.set(date, day)
    await doc.save()
  } else {
    const db = await readJsonDB()
    if (!db.habitDone[userId]) db.habitDone[userId] = {}
    if (!db.habitDone[userId][date]) db.habitDone[userId][date] = {}
    
    const day = db.habitDone[userId][date]
    if (day[habitId]) {
      delete day[habitId]
    } else {
      day[habitId] = time
    }
    await writeJsonDB(db)
  }
}

// ── JOURNAL METHODS ────────────────────────────────────
export async function dbGetJournal(userId) {
  await connectDB()
  if (IS_MONGO) {
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
  if (IS_MONGO) {
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
  if (IS_MONGO) {
    await JournalEntry.deleteOne({ userId, id: entryId })
  } else {
    const db = await readJsonDB()
    db.journalEntries = db.journalEntries.filter(e => !(e.userId === userId && e.id === entryId))
    await writeJsonDB(db)
  }
}

// ── COMMUNITY METHODS ────────────────────────────────────
export async function dbGetAllUsers() {
  await connectDB()
  if (IS_MONGO) {
    const users = await User.find({}, { password: 0 })
    return users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email }))
  } else {
    const db = await readJsonDB()
    return db.users.map(u => ({ id: u.id, name: u.name, email: u.email }))
  }
}

export async function dbGetCommunityFeed() {
  await connectDB()
  const activities = []
  const users = await dbGetAllUsers()

  for (const user of users) {
    const userId = user.id

    if (IS_MONGO) {
      const latestEntry = await JournalEntry.findOne({ userId }).sort({ createdAt: -1 }).lean()
      const habits = await Habit.find({ userId }).lean()
      const doneDoc = await HabitDone.findOne({ userId }).lean()

      if (!latestEntry && habits.length === 0) continue

      const done = doneDoc ? Object.fromEntries(
        Object.entries(doneDoc.done || {}).map(([k, v]) => [k, Object.fromEntries(v)])
      ) : {}

      let bestHabit = null, bestStreak = 0
      for (const h of habits) {
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 366; i++) {
          const d = new Date(today); d.setDate(d.getDate() - i)
          const ds = d.toISOString().slice(0, 10)
          const dayDone = done[ds]
          if (dayDone && dayDone[h._id.toString()]) {
            streak++
          } else if (i > 0) { break }
        }
        if (streak > bestStreak) { bestStreak = streak; bestHabit = h }
      }

      activities.push({
        id: `act-${userId}`,
        name: user.name,
        avatar: bestHabit ? bestHabit.icon : '🪷',
        habit: bestHabit ? `${bestHabit.icon} ${bestHabit.name}` : '🌿 Wellness Journey',
        streak: bestStreak,
        time: timeAgo(latestEntry?.createdAt),
        text: latestEntry ? latestEntry.text : 'Joined the sangha!',
        prana: 0, comments: 0,
        color: bestHabit ? bestHabit.color : '#c9933a'
      })
    } else {
      const db = await readJsonDB()
      const userEntries = db.journalEntries
        .filter(e => e.userId === userId)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      const userHabits = db.habits.filter(h => h.userId === userId)
      const userDone = db.habitDone[userId] || {}

      if (userEntries.length === 0 && userHabits.length === 0) continue

      let bestHabit = null, bestStreak = 0
      for (const h of userHabits) {
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 366; i++) {
          const d = new Date(today); d.setDate(d.getDate() - i)
          const ds = d.toISOString().slice(0, 10)
          const dayDone = userDone[ds]
          if (dayDone && dayDone[h.id]) {
            streak++
          } else if (i > 0) { break }
        }
        if (streak > bestStreak) { bestStreak = streak; bestHabit = h }
      }

      const latest = userEntries[0]
      activities.push({
        id: `act-${userId}`,
        name: user.name,
        avatar: bestHabit ? bestHabit.icon : '🪷',
        habit: bestHabit ? `${bestHabit.icon} ${bestHabit.name}` : '🌿 Wellness Journey',
        streak: bestStreak,
        time: timeAgo(latest?.createdAt),
        text: latest ? latest.text : 'Joined the sangha!',
        prana: 0, comments: 0,
        color: bestHabit ? bestHabit.color : '#c9933a'
      })
    }
  }

  activities.sort((a, b) => b.streak - a.streak)
  return activities
}

export async function dbGetIntentions() {
  await connectDB()
  if (IS_MONGO) {
    const Intentions = mongoose.models.Intentions || mongoose.model('Intentions', new mongoose.Schema({
      author: String, text: String, time: String, createdAt: { type: Date, default: Date.now }
    }))
    const docs = await Intentions.find().sort({ createdAt: -1 }).limit(50).lean()
    return docs.map(d => ({ id: d._id.toString(), author: d.author, text: d.text, time: d.time }))
  } else {
    const db = await readJsonDB()
    const intentions = db.intentions || []
    return intentions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 50)
  }
}

export async function dbAddIntention(author, text) {
  await connectDB()
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  if (IS_MONGO) {
    const Intentions = mongoose.models.Intentions || mongoose.model('Intentions', new mongoose.Schema({
      author: String, text: String, time: String, createdAt: { type: Date, default: Date.now }
    }))
    const doc = await Intentions.create({ author, text, time: timeStr })
    return { id: doc._id.toString(), author, text, time: timeStr }
  } else {
    const db = await readJsonDB()
    if (!db.intentions) db.intentions = []
    const int = { id: Math.random().toString(36).slice(2, 9), author, text, time: timeStr, createdAt: new Date().toISOString() }
    db.intentions.push(int)
    await writeJsonDB(db)
    return { id: int.id, author, text, time: timeStr }
  }
}

// ── PROFILE METHODS ────────────────────────────────────
export async function dbUpdateUserProfile(userId, updates) {
  await connectDB()
  const allowed = {}
  if (updates.name !== undefined) allowed.name = updates.name
  if (updates.bio !== undefined) allowed.bio = updates.bio
  if (updates.location !== undefined) allowed.location = updates.location
  if (updates.preferences !== undefined) allowed.preferences = updates.preferences

  if (IS_MONGO) {
    const user = await User.findByIdAndUpdate(userId, { $set: allowed }, { new: true })
    if (!user) throw new Error('User not found')
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt,
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true }
    }
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    Object.assign(user, allowed)
    await writeJsonDB(db)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt || new Date().toISOString(),
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true }
    }
  }
}

export async function dbUpdateUserAvatar(userId, avatar) {
  await connectDB()
  if (IS_MONGO) {
    const user = await User.findByIdAndUpdate(userId, { $set: { avatar } }, { new: true })
    if (!user) throw new Error('User not found')
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt,
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true }
    }
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    user.avatar = avatar
    await writeJsonDB(db)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt || new Date().toISOString(),
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true }
    }
  }
}

export async function dbChangePassword(userId, newPasswordHash) {
  await connectDB()
  if (IS_MONGO) {
    const user = await User.findByIdAndUpdate(userId, { $set: { password: newPasswordHash } }, { new: true })
    if (!user) throw new Error('User not found')
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    user.password = newPasswordHash
    await writeJsonDB(db)
  }
}

export async function dbDeleteUser(userId) {
  await connectDB()
  if (IS_MONGO) {
    await User.findByIdAndDelete(userId)
    await WaterLog.deleteMany({ userId })
    await Habit.deleteMany({ userId })
    await HabitDone.deleteMany({ userId })
    await JournalEntry.deleteMany({ userId })
    await UserBadge.deleteMany({ userId })
  } else {
    const db = await readJsonDB()
    db.users = db.users.filter(u => u.id !== userId)
    delete db.waterLogs[userId]
    db.habits = db.habits.filter(h => h.userId !== userId)
    delete db.habitDone[userId]
    db.journalEntries = db.journalEntries.filter(e => e.userId !== userId)
    if (db.userBadges) {
      db.userBadges = db.userBadges.filter(ub => ub.userId !== userId)
    }
    await writeJsonDB(db)
  }
}

// ── BADGES & STATS DB HELPERS ──────────────────────────
export async function dbGetBadges() {
  await connectDB()
  if (IS_MONGO) {
    return await Badge.find().lean()
  } else {
    const db = await readJsonDB()
    return db.badges || DEFAULT_BADGES
  }
}

export async function dbGetUserBadges(userId) {
  await connectDB()
  if (IS_MONGO) {
    return await UserBadge.find({ userId }).lean()
  } else {
    const db = await readJsonDB()
    return (db.userBadges || []).filter(ub => ub.userId === userId)
  }
}

export async function dbSaveUserBadge(userId, badgeId, updates) {
  await connectDB()
  if (IS_MONGO) {
    return await UserBadge.findOneAndUpdate(
      { userId, badgeId },
      { $set: updates },
      { upsert: true, new: true }
    ).lean()
  } else {
    const db = await readJsonDB()
    if (!db.userBadges) db.userBadges = []
    let ub = db.userBadges.find(x => x.userId === userId && x.badgeId === badgeId)
    if (!ub) {
      ub = { id: Math.random().toString(36).slice(2, 9), userId, badgeId, progress: 0, isUnlocked: false }
      db.userBadges.push(ub)
    }
    Object.assign(ub, updates)
    await writeJsonDB(db)
    return ub
  }
}

export async function dbUpdateUserStats(userId, statsUpdates) {
  await connectDB()
  if (IS_MONGO) {
    const setQuery = {}
    for (const [k, v] of Object.entries(statsUpdates)) {
      setQuery[`stats.${k}`] = v
    }
    return await User.findByIdAndUpdate(userId, { $set: setQuery }, { new: true }).lean()
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    user.stats = user.stats || { sankalpaCount: 0, breathingCount: 0, wisdomCount: 0, booksOpened: [], sunriseActivities: 0, midnightJournals: 0 }
    Object.assign(user.stats, statsUpdates)
    await writeJsonDB(db)
    return user
  }
}
