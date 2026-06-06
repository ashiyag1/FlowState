import mongoose from 'mongoose'
import User from '../models/User.js'
import WaterLog from '../models/WaterLog.js'
import Habit from '../models/Habit.js'
import HabitDone from '../models/HabitDone.js'
import JournalEntry from '../models/JournalEntry.js'
import UserBadge from '../models/UserBadge.js'
import { connectDB, getIsMongo } from './connection.js'
import { readJsonDB, writeJsonDB } from './jsonEngine.js'

export async function dbCreateUser(name, email, passwordHash) {
  await connectDB()
  if (getIsMongo()) {
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
      xp: 0,
      pranaPoints: 0,
      preferences: { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      activeSankalpa: 'calm',
      dailySankalpa: { text: '', isCompleted: false, dateSet: '' },
      wisdom: {},
      stats: { sankalpaDates: [], breathingDates: [], wisdomDates: [], booksOpened: [], sunriseDates: [], midnightJournalDates: [], pagesRead: [] }
    }
    db.users.push(newUser)
    await writeJsonDB(db)
    return newUser
  }
}

export async function dbFindUserByEmail(email) {
  await connectDB()
  if (getIsMongo()) {
    return await User.findOne({ email })
  } else {
    const db = await readJsonDB()
    return db.users.find(u => u.email === email) || null
  }
}

export async function dbFindUserById(id) {
  await connectDB()
  if (getIsMongo()) {
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
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0,
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      wisdom: user.wisdom || {},
      stats: {
        sankalpaDates: user.stats?.sankalpaDates || [],
        breathingDates: user.stats?.breathingDates || [],
        wisdomDates: user.stats?.wisdomDates || [],
        booksOpened: user.stats?.booksOpened || [],
        sunriseDates: user.stats?.sunriseDates || [],
        midnightJournalDates: user.stats?.midnightJournalDates || [],
        pagesRead: user.stats?.pagesRead || []
      }
    } : null
  }
}

export async function dbUpdateUserProfile(userId, updates) {
  await connectDB()
  const allowed = {}
  if (updates.name !== undefined) allowed.name = updates.name
  if (updates.bio !== undefined) allowed.bio = updates.bio
  if (updates.location !== undefined) allowed.location = updates.location
  if (updates.preferences !== undefined) allowed.preferences = updates.preferences
  if (updates.wisdom !== undefined) allowed.wisdom = updates.wisdom
  if (updates.activeSankalpa !== undefined) allowed.activeSankalpa = updates.activeSankalpa
  if (updates.dailySankalpa !== undefined) allowed.dailySankalpa = updates.dailySankalpa

  if (getIsMongo()) {
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
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      wisdom: user.wisdom || {},
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0
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
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      wisdom: user.wisdom || {},
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0
    }
  }
}

export async function dbUpdateUserAvatar(userId, avatar) {
  await connectDB()
  if (getIsMongo()) {
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
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0,
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      wisdom: user.wisdom || {}
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
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0,
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      wisdom: user.wisdom || {}
    }
  }
}

export async function dbChangePassword(userId, newPasswordHash) {
  await connectDB()
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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

export async function dbAdjustUserPoints(userId, xpDiff, pranaDiff = 0) {
  await connectDB()
  const xpVal = Number(xpDiff || 0)
  const pranaVal = Number(pranaDiff || 0)
  if (getIsMongo()) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { xp: xpVal, pranaPoints: pranaVal } },
      { new: true }
    ).lean()
    if (!user) throw new Error('User not found')
    return {
      _id: user._id.toString(),
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt,
      xp: user.xp || 0,
      pranaPoints: user.pranaPoints || 0,
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      wisdom: user.wisdom || {}
    }
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    user.xp = Math.max(0, (user.xp || 0) + xpVal)
    user.pranaPoints = Math.max(0, (user.pranaPoints || 0) + pranaVal)
    await writeJsonDB(db)
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      joinedAt: user.joinedAt || new Date().toISOString(),
      xp: user.xp,
      pranaPoints: user.pranaPoints,
      preferences: user.preferences || { theme: 'light', soundEnabled: true, notificationsEnabled: true },
      activeSankalpa: user.activeSankalpa || 'calm',
      dailySankalpa: user.dailySankalpa || { text: '', isCompleted: false, dateSet: '' },
      wisdom: user.wisdom || {},
      stats: user.stats || {}
    }
  }
}

export async function dbUpdateUserStats(userId, statsUpdates) {
  await connectDB()
  if (getIsMongo()) {
    const setQuery = {}
    for (const [k, v] of Object.entries(statsUpdates)) {
      setQuery[`stats.${k}`] = v
    }
    return await User.findByIdAndUpdate(userId, { $set: setQuery }, { new: true }).lean()
  } else {
    const db = await readJsonDB()
    const user = db.users.find(u => u.id === userId)
    if (!user) throw new Error('User not found')
    user.stats = user.stats || { sankalpaDates: [], breathingDates: [], wisdomDates: [], booksOpened: [], sunriseDates: [], midnightJournalDates: [], pagesRead: [] }
    Object.assign(user.stats, statsUpdates)
    await writeJsonDB(db)
    return user
  }
}
