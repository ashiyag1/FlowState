import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Store, today as getToday, uid } from '../utils'
import { useAuth } from './AuthContext'

const WellnessContext = createContext(null)

function useLocalState(key, initial) {
  const [state, setRaw] = useState(() => Store.get(key, initial))
  const setState = useCallback((val) => {
    setRaw(prev => {
      const next = typeof val === 'function' ? val(prev) : val
      Store.set(key, next)
      return next
    })
  }, [key])
  return [state, setState]
}

export function WellnessProvider({ children }) {
  const { token, isAuthenticated } = useAuth()
  const td = getToday()

  // ── WATER ──────────────────────────────────────
  const [waterGoal, setWaterGoal] = useLocalState('water_goal', 2500)
  const [waterLog,  setWaterLog]  = useLocalState('water_log',  {})

  // ── HABITS ─────────────────────────────────────
  const [habits,    setHabits]    = useLocalState('habits_list', [])
  const [habitDone, setHabitDone] = useLocalState('habit_done',  {})

  // ── JOURNAL ────────────────────────────────────
  const [journal, setJournal] = useLocalState('journal_entries', [])

  // ── DATA SYNC EFFECT ───────────────────────────
  useEffect(() => {
    async function fetchBackendData() {
      if (!isAuthenticated || !token) return

      try {
        // Fetch water logs
        const waterRes = await fetch('/api/water', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (waterRes.ok) {
          const waterData = await waterRes.json()
          setWaterGoal(waterData.waterGoal)
          setWaterLog(waterData.logs || {})
        }

        // Fetch habits
        const habitsRes = await fetch('/api/habits', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (habitsRes.ok) {
          const habitsData = await habitsRes.json()
          setHabits(habitsData.habits || [])
          setHabitDone(habitsData.habitDone || {})
        }

        // Fetch journal entries
        const journalRes = await fetch('/api/journal', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (journalRes.ok) {
          const journalData = await journalRes.json()
          setJournal(journalData || [])
        }
      } catch (err) {
        console.error('Error fetching backend wellness data:', err)
      }
    }

    fetchBackendData()
  }, [isAuthenticated, token, setWaterGoal, setWaterLog, setHabits, setHabitDone, setJournal])

  // Clear data on logout / Restore from local storage on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setWaterGoal(Store.get('water_goal', 2500))
      setWaterLog(Store.get('water_log', {}))
      setHabits(Store.get('habits_list', []))
      setHabitDone(Store.get('habit_done', {}))
      setJournal(Store.get('journal_entries', []))
    }
  }, [isAuthenticated, setWaterGoal, setWaterLog, setHabits, setHabitDone, setJournal])

  // ── WATER MUTATIONS ────────────────────────────
  const updateWaterGoal = useCallback(async (goal) => {
    setWaterGoal(goal)
    if (isAuthenticated && token) {
      try {
        await fetch('/api/water', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ waterGoal: goal })
        })
      } catch (err) {
        console.error('Failed to sync water goal:', err)
      }
    }
  }, [isAuthenticated, token, setWaterGoal])

  const addWater = useCallback(async (ml, label = 'Custom') => {
    const now = new Date()
    const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0')
    const entry = { id: uid(), ml, label, time }
    const todayStr = getToday()
    
    setWaterLog(prev => ({ ...prev, [todayStr]: [...(prev[todayStr] || []), entry] }))

    if (isAuthenticated && token) {
      try {
        await fetch('/api/water', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ date: todayStr, entry })
        })
      } catch (err) {
        console.error('Failed to sync added water:', err)
      }
    }
  }, [isAuthenticated, token, setWaterLog])

  const removeWater = useCallback(async (id) => {
    const todayStr = getToday()
    setWaterLog(prev => {
      const day = (prev[todayStr] || []).filter(e => e.id !== id)
      return { ...prev, [todayStr]: day }
    })

    if (isAuthenticated && token) {
      try {
        await fetch('/api/water', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ date: todayStr, entryId: id })
        })
      } catch (err) {
        console.error('Failed to sync deleted water:', err)
      }
    }
  }, [isAuthenticated, token, setWaterLog])

  const clearWaterToday = useCallback(async () => {
    const todayStr = getToday()
    setWaterLog(prev => ({ ...prev, [todayStr]: [] }))

    if (isAuthenticated && token) {
      try {
        await fetch('/api/water', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ date: todayStr, clear: true })
        })
      } catch (err) {
        console.error('Failed to sync clear water:', err)
      }
    }
  }, [isAuthenticated, token, setWaterLog])

  const todayEntries = waterLog[td] || []
  const todayTotal   = todayEntries.reduce((s, e) => s + e.ml, 0)

  // ── HABITS MUTATIONS ───────────────────────────
  const addHabit = useCallback(async (habit) => {
    const tempId = uid()
    const createdAt = new Date().toISOString()
    const tempHabit = { ...habit, id: tempId, createdAt }
    
    setHabits(prev => [...prev, tempHabit])

    if (isAuthenticated && token) {
      try {
        const res = await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: habit.name, icon: habit.icon, color: habit.color })
        })
        if (res.ok) {
          const savedHabit = await res.json()
          setHabits(prev => prev.map(h => h.id === tempId ? savedHabit : h))
        }
      } catch (err) {
        console.error('Failed to sync habit addition:', err)
      }
    }
  }, [isAuthenticated, token, setHabits])

  const deleteHabit = useCallback(async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))

    if (isAuthenticated && token) {
      try {
        await fetch('/api/habits', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ habitId: id })
        })
      } catch (err) {
        console.error('Failed to sync habit deletion:', err)
      }
    }
  }, [isAuthenticated, token, setHabits])

  const toggleHabit = useCallback(async (id, dateKey = getToday()) => {
    const now = new Date()
    const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0')
    
    setHabitDone(prev => {
      const day = { ...(prev[dateKey] || {}) }
      if (day[id]) delete day[id]
      else day[id] = time
      return { ...prev, [dateKey]: day }
    })

    if (isAuthenticated && token) {
      try {
        await fetch('/api/habits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ toggle: true, habitId: id, date: dateKey, time })
        })
      } catch (err) {
        console.error('Failed to sync habit toggle:', err)
      }
    }
  }, [isAuthenticated, token, setHabitDone])

  const getStreak = useCallback((habitId) => {
    let streak = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0,10)
      const day = habitDone[iso] || {}
      if (day[habitId]) { streak++; d.setDate(d.getDate() - 1) }
      else { if (i === 0) { d.setDate(d.getDate() - 1); continue } break }
    }
    return streak
  }, [habitDone])

  const todayHabitDone = habitDone[td] || {}

  // ── JOURNAL MUTATIONS ──────────────────────────
  const addEntry = useCallback(async (entry) => {
    const tempId = entry.id || uid()
    const createdAt = new Date().toISOString()
    const fullEntry = { ...entry, id: tempId, createdAt }
    
    setJournal(prev => [fullEntry, ...prev])

    if (isAuthenticated && token) {
      try {
        await fetch('/api/journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id: tempId, date: entry.date, time: entry.time, text: entry.text, mood: entry.mood })
        })
      } catch (err) {
        console.error('Failed to sync journal entry addition:', err)
      }
    }
  }, [isAuthenticated, token, setJournal])

  const deleteEntry = useCallback(async (id) => {
    setJournal(prev => prev.filter(e => e.id !== id))

    if (isAuthenticated && token) {
      try {
        await fetch('/api/journal', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        })
      } catch (err) {
        console.error('Failed to sync journal entry deletion:', err)
      }
    }
  }, [isAuthenticated, token, setJournal])

  return (
    <WellnessContext.Provider value={{
      // water
      waterGoal, setWaterGoal: updateWaterGoal,
      waterLog, todayEntries, todayTotal,
      addWater, removeWater, clearWaterToday,
      // habits
      habits, addHabit, deleteHabit,
      habitDone, todayHabitDone, toggleHabit, getStreak,
      // journal
      journal, addEntry, deleteEntry,
    }}>
      {children}
    </WellnessContext.Provider>
  )
}

export const useWellness = () => {
  const ctx = useContext(WellnessContext)
  if (!ctx) throw new Error('useWellness must be inside WellnessProvider')
  return ctx
}