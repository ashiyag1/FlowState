import mongoose from 'mongoose'
import Habit from '../models/Habit.js'
import HabitDone from '../models/HabitDone.js'
import { connectDB, getIsMongo } from './connection.js'
import {
  readJsonDB,
  writeJsonDB,
  hasVal,
  setVal,
  deleteVal,
  getSize,
  toObject
} from './jsonEngine.js'

export async function dbGetHabits(userId) {
  await connectDB()
  if (getIsMongo()) {
    const list = await Habit.find({ userId }).sort({ createdAt: 1 })
    const doneDoc = await HabitDone.findOne({ userId })
    const habitsList = list.map(h => ({
      id: h._id.toString(),
      name: h.name,
      icon: h.icon,
      color: h.color,
      cycleLength: h.cycleLength || 7,
      relaxDay: h.relaxDay || 'None',
      streakFreezes: h.streakFreezes ?? 3,
      createdAt: h.createdAt.toISOString()
    }))

    const habitDoneObj = {}
    if (doneDoc && doneDoc.done) {
      for (const [date, completions] of doneDoc.done.entries()) {
        habitDoneObj[date] = toObject(completions)
      }
    }

    return {
      habits: habitsList,
      habitDone: habitDoneObj
    }
  } else {
    const db = await readJsonDB()
    const habits = db.habits
      .filter(h => h.userId === userId)
      .map(h => ({ 
        id: h.id, 
        name: h.name, 
        icon: h.icon, 
        color: h.color, 
        cycleLength: h.cycleLength || 7,
        relaxDay: h.relaxDay || 'None',
        streakFreezes: h.streakFreezes ?? 3,
        createdAt: h.createdAt 
      }))
    const habitDone = db.habitDone[userId] || {}
    return { habits, habitDone }
  }
}

export async function dbAddHabit(userId, habit) {
  await connectDB()
  const habitId = getIsMongo() ? new mongoose.Types.ObjectId() : Math.random().toString(36).slice(2, 9)
  const createdAt = new Date().toISOString()
  
  if (getIsMongo()) {
    const newHabit = new Habit({
      _id: habitId,
      userId,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      cycleLength: habit.cycleLength || 7,
      relaxDay: habit.relaxDay || 'None',
      streakFreezes: habit.streakFreezes ?? 3,
      createdAt
    })
    await newHabit.save()
    return { 
      id: habitId.toString(), 
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      cycleLength: habit.cycleLength || 7,
      relaxDay: habit.relaxDay || 'None',
      streakFreezes: habit.streakFreezes ?? 3,
      createdAt 
    }
  } else {
    const db = await readJsonDB()
    const newHabit = {
      id: habitId,
      userId,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      cycleLength: habit.cycleLength || 7,
      relaxDay: habit.relaxDay || 'None',
      streakFreezes: habit.streakFreezes ?? 3,
      createdAt
    }
    db.habits.push(newHabit)
    await writeJsonDB(db)
    return { 
      id: habitId, 
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      cycleLength: habit.cycleLength || 7,
      relaxDay: habit.relaxDay || 'None',
      streakFreezes: habit.streakFreezes ?? 3,
      createdAt 
    }
  }
}

export async function dbDeleteHabit(userId, habitId) {
  await connectDB()
  if (getIsMongo()) {
    await Habit.deleteOne({ _id: habitId, userId })
    const doneDoc = await HabitDone.findOne({ userId })
    if (doneDoc) {
      for (const [date, dayCompletions] of doneDoc.done.entries()) {
        if (dayCompletions && hasVal(dayCompletions, habitId)) {
          deleteVal(dayCompletions, habitId)
          if (getSize(dayCompletions) === 0) {
            doneDoc.done.delete(date)
          } else {
            doneDoc.done.set(date, dayCompletions)
          }
        }
      }
      doneDoc.markModified('done')
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
  let isDoneNow = false
  if (getIsMongo()) {
    let doc = await HabitDone.findOne({ userId })
    if (!doc) doc = new HabitDone({ userId, done: {} })
    
    if (!doc.done.has(date)) {
      doc.done.set(date, new Map())
    }
    const dayMap = doc.done.get(date)
    if (hasVal(dayMap, habitId)) {
      deleteVal(dayMap, habitId)
      isDoneNow = false
    } else {
      setVal(dayMap, habitId, time)
      isDoneNow = true
    }
    if (getSize(dayMap) === 0) {
      doc.done.delete(date)
    } else {
      doc.done.set(date, dayMap)
    }
    doc.markModified('done')
    await doc.save()
  } else {
    const db = await readJsonDB()
    if (!db.habitDone[userId]) db.habitDone[userId] = {}
    if (!db.habitDone[userId][date]) db.habitDone[userId][date] = {}
    
    const day = db.habitDone[userId][date]
    if (day[habitId]) {
      delete day[habitId]
      isDoneNow = false
    } else {
      day[habitId] = time
      isDoneNow = true
    }
    await writeJsonDB(db)
  }
  return isDoneNow
}
