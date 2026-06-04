import Badge from '../models/Badge.js'
import UserBadge from '../models/UserBadge.js'
import { DEFAULT_BADGES } from './badgesConfig.js'
import { connectDB, getIsMongo } from './connection.js'
import { readJsonDB, writeJsonDB } from './jsonEngine.js'

export async function dbGetBadges() {
  await connectDB()
  if (getIsMongo()) {
    return await Badge.find().lean()
  } else {
    const db = await readJsonDB()
    return db.badges || DEFAULT_BADGES
  }
}

export async function dbGetUserBadges(userId) {
  await connectDB()
  if (getIsMongo()) {
    return await UserBadge.find({ userId }).lean()
  } else {
    const db = await readJsonDB()
    return (db.userBadges || []).filter(ub => ub.userId === userId)
  }
}

export async function dbSaveUserBadge(userId, badgeId, updates) {
  await connectDB()
  if (getIsMongo()) {
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

export async function dbSaveUserBadges(userId, updatesArray) {
  await connectDB()
  if (getIsMongo()) {
    await Promise.all(
      updatesArray.map(({ badgeId, updates }) =>
        UserBadge.findOneAndUpdate(
          { userId, badgeId },
          { $set: updates },
          { upsert: true }
        )
      )
    )
  } else {
    const db = await readJsonDB()
    if (!db.userBadges) db.userBadges = []
    for (const { badgeId, updates } of updatesArray) {
      let ub = db.userBadges.find(x => x.userId === userId && x.badgeId === badgeId)
      if (!ub) {
        ub = { id: Math.random().toString(36).slice(2, 9), userId, badgeId, progress: 0, isUnlocked: false }
        db.userBadges.push(ub)
      }
      Object.assign(ub, updates)
    }
    await writeJsonDB(db)
  }
}

