import WaterLog from '../models/WaterLog.js'
import { connectDB, getIsMongo } from './connection.js'
import { readJsonDB, writeJsonDB } from './jsonEngine.js'

export async function dbGetWater(userId) {
  await connectDB()
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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
