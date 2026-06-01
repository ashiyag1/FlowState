import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
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
  const { token, isAuthenticated, adjustPoints, setUser } = useAuth()
  const td = getToday()

  // ── WATER ──────────────────────────────────────
  const [waterGoal, setWaterGoal] = useLocalState('water_goal', 2500)
  const [waterLog,  setWaterLog]  = useLocalState('water_log',  {})

  // ── HABITS ─────────────────────────────────────
  const [habits,    setHabits]    = useLocalState('habits_list', [])
  const [habitDone, setHabitDone] = useLocalState('habit_done',  {})

  // ── DAILY TASKS ────────────────────────────────
  const [dailyTasks, setDailyTasks] = useLocalState('daily_tasks', {})

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

          // ── MERGE STRATEGY (prevents data loss) ──────────────────────────────
          // Server is authoritative for all past dates.
          // For TODAY: merge server + local so optimistic ticks are never wiped.
          // This guards against server returning stale/partial data on re-fetch.
          const serverDone = habitsData.habitDone || {}
          const todayKey = new Date().toISOString().slice(0, 10)
          setHabitDone(prev => {
            const localToday = prev[todayKey] || {}
            const serverToday = serverDone[todayKey] || {}
            // Union: if it's ticked locally OR on server, keep it
            const mergedToday = { ...localToday, ...serverToday }
            return { ...serverDone, [todayKey]: mergedToday }
          })
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
      setDailyTasks(Store.get('daily_tasks', {}))
      setJournal(Store.get('journal_entries', []))
    }
  }, [isAuthenticated, setWaterGoal, setWaterLog, setHabits, setHabitDone, setDailyTasks, setJournal])

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
  const toggleVersion = useRef(0)

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
          body: JSON.stringify({ 
            name: habit.name, 
            icon: habit.icon, 
            color: habit.color,
            cycleLength: habit.cycleLength || 7,
            relaxDay: habit.relaxDay || 'None',
            streakFreezes: habit.streakFreezes ?? 3
          })
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
    const version = ++toggleVersion.current

    // Snapshot current state for rollback on API failure
    const snapshotBefore = Store.get('habit_done', {})

    // Optimistic UI update
    setHabitDone(prev => {
      const day = { ...(prev[dateKey] || {}) }
      if (day[id]) delete day[id]
      else day[id] = time
      return { ...prev, [dateKey]: day }
    })

    if (isAuthenticated && token) {
      try {
        const res = await fetch('/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ toggle: true, habitId: id, date: dateKey, time })
        })
        // Rollback if server rejected the toggle
        if (!res.ok) {
          console.error('Habit toggle rejected by server — rolling back UI')
          setHabitDone(snapshotBefore)
        } else {
          const data = await res.json()
          if (data.user && version === toggleVersion.current) {
            setUser(prev => ({ ...prev, ...data.user }))
          }
        }
      } catch (err) {
        // Rollback on network failure to prevent false ticks persisting
        console.error('Habit toggle network error — rolling back UI:', err)
        setHabitDone(snapshotBefore)
      }
    }
  }, [isAuthenticated, token, setHabitDone, setUser])

  const getStreak = useCallback((habitId) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return 0
    
    let streak = 0
    let freezesRemaining = habit.streakFreezes ?? 3
    const relaxDay = habit.relaxDay
    
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0,10)
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
      const day = habitDone[iso] || {}
      
      if (day[habitId]) { 
        streak++
        d.setDate(d.getDate() - 1)
      } else { 
        // If it's today and not done, it doesn't break the streak yet
        if (i === 0) { 
          d.setDate(d.getDate() - 1)
          continue 
        }
        
        // If it's a custom Relax Day, forgive it (no freeze consumed)
        if (relaxDay && dayName === relaxDay) {
          d.setDate(d.getDate() - 1)
          continue
        }

        // Use a streak freeze if available
        if (freezesRemaining > 0) {
          freezesRemaining--
          d.setDate(d.getDate() - 1)
          continue
        }

        break 
      }
    }
    return streak
  }, [habitDone, habits])

  const todayHabitDone = habitDone[td] || {}

  // ── DAILY TASKS MUTATIONS ──────────────────────
  const addDailyTask = useCallback((dateKey, task) => {
    setDailyTasks(prev => {
      const dayTasks = prev[dateKey] || []
      return { ...prev, [dateKey]: [...dayTasks, { ...task, id: uid(), done: false, subtasks: [] }] }
    })
  }, [setDailyTasks])

  const toggleDailyTask = useCallback((dateKey, taskId) => {
    const dayTasks = dailyTasks[dateKey] || []
    const task = dayTasks.find(t => t.id === taskId)
    if (!task) return

    const isDoneNow = !task.done
    setDailyTasks(prev => {
      const currentTasks = prev[dateKey] || []
      return {
        ...prev,
        [dateKey]: currentTasks.map(t => t.id === taskId ? { ...t, done: isDoneNow } : t)
      }
    })
    adjustPoints(isDoneNow ? 10 : -10, 0)
  }, [dailyTasks, setDailyTasks, adjustPoints])

  const deleteDailyTask = useCallback((dateKey, taskId) => {
    const dayTasks = dailyTasks[dateKey] || []
    const task = dayTasks.find(t => t.id === taskId)
    if (!task) return

    setDailyTasks(prev => {
      const currentTasks = prev[dateKey] || []
      return {
        ...prev,
        [dateKey]: currentTasks.filter(t => t.id !== taskId)
      }
    })
    if (task.done) {
      adjustPoints(-10, 0)
    }
  }, [dailyTasks, setDailyTasks, adjustPoints])

  const addSubtask = useCallback((dateKey, taskId, subtaskName) => {
    setDailyTasks(prev => {
      const dayTasks = prev[dateKey] || []
      const newTasks = dayTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: [...(t.subtasks || []), { id: uid(), name: subtaskName, done: false }] }
        }
        return t
      })
      return { ...prev, [dateKey]: newTasks }
    })
  }, [setDailyTasks])

  const toggleSubtask = useCallback((dateKey, taskId, subtaskId) => {
    const dayTasks = dailyTasks[dateKey] || []
    const task = dayTasks.find(t => t.id === taskId)
    if (!task) return

    const newSubs = (task.subtasks || []).map(st => st.id === subtaskId ? { ...st, done: !st.done } : st)
    const allSubsDone = newSubs.every(st => st.done)
    const wasDone = task.done
    const isDoneNow = allSubsDone

    setDailyTasks(prev => {
      const currentTasks = prev[dateKey] || []
      return {
        ...prev,
        [dateKey]: currentTasks.map(t => {
          if (t.id === taskId) {
            return { ...t, subtasks: newSubs, done: allSubsDone }
          }
          return t
        })
      }
    })

    if (wasDone !== isDoneNow) {
      adjustPoints(isDoneNow ? 10 : -10, 0)
    }
  }, [dailyTasks, setDailyTasks, adjustPoints])

  const deleteSubtask = useCallback((dateKey, taskId, subtaskId) => {
    setDailyTasks(prev => {
      const dayTasks = prev[dateKey] || []
      const newTasks = dayTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) }
        }
        return t
      })
      return { ...prev, [dateKey]: newTasks }
    })
  }, [setDailyTasks])

  // ── JOURNAL MUTATIONS ──────────────────────────
  const addEntry = useCallback(async (entry) => {
    const tempId = entry.id || uid()
    const createdAt = new Date().toISOString()
    const fullEntry = { ...entry, id: tempId, createdAt }
    
    setJournal(prev => [fullEntry, ...prev])
    adjustPoints(25, 0)

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
  }, [isAuthenticated, token, setJournal, adjustPoints])

  const deleteEntry = useCallback(async (id) => {
    const entry = journal.find(e => e.id === id)
    setJournal(prev => prev.filter(e => e.id !== id))
    if (entry) {
      adjustPoints(-25, 0)
    }

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
  }, [isAuthenticated, token, setJournal, adjustPoints, journal])

  return (
    <WellnessContext.Provider value={{
      // water
      waterGoal, setWaterGoal: updateWaterGoal,
      waterLog, todayEntries, todayTotal,
      addWater, removeWater, clearWaterToday,
      // habits
      habits, addHabit, deleteHabit,
      habitDone, todayHabitDone, toggleHabit, getStreak,
      // daily tasks
      dailyTasks, addDailyTask, toggleDailyTask, deleteDailyTask,
      addSubtask, toggleSubtask, deleteSubtask,
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