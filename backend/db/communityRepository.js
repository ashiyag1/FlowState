import mongoose from 'mongoose'
import User from '../models/User.js'
import { connectDB, getIsMongo } from './connection.js'
import { readJsonDB, writeJsonDB } from './jsonEngine.js'

export async function dbGetAllUsers() {
  await connectDB()
  if (getIsMongo()) {
    const users = await User.find({}, { password: 0 })
    return users.map(u => ({ id: u._id.toString(), name: u.name, email: u.email }))
  } else {
    const db = await readJsonDB()
    return db.users.map(u => ({ id: u.id, name: u.name, email: u.email }))
  }
}

export async function dbGetCommunityFeed() {
  return []
}

export async function dbGetIntentions() {
  await connectDB()
  if (getIsMongo()) {
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
  if (getIsMongo()) {
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
