import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Store, today as getToday, toLocalISO, uid } from '../utils'
import { useAuth } from './AuthContext'

const WellnessContext = createContext(null)

// Removed useLocalState since data now lives entirely in React state and syncs to backend

export function WellnessProvider({ children }) {
  const { token, isAuthenticated, adjustPoints, setUser } = useAuth()
  const td = getToday()

  // ── WATER ──────────────────────────────────────
  const [waterGoal, setWaterGoal] = useState(2500)
  const [waterLog,  setWaterLog]  = useState({})

  // ── HABITS ─────────────────────────────────────
  const [habits,    setHabits]    = useState([])
  const [habitDone, setHabitDone] = useState({})

  // ── DAILY TASKS ────────────────────────────────
  const [dailyTasks, setDailyTasks] = useState({})

  // ── JOURNAL ────────────────────────────────────
  const [journal, setJournal] = useState([])

  // ── DATA SYNC EFFECT ───────────────────────────
  useEffect(() => {
    async function fetchBackendData() {
      if (!isAuthenticated || !token) return

      try {
        // Fetch all three data sources in parallel — saves ~300-400ms vs sequential awaits
        const [waterRes, habitsRes, journalRes] = await Promise.all([
          fetch('/api/v1/water',   { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/habits',  { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/journal', { headers: { 'Authorization': `Bearer ${token}` } }),
        ])

        // Handle water
        if (waterRes.ok) {
          const waterData = await waterRes.json()
          setWaterGoal(waterData.waterGoal)
          setWaterLog(waterData.logs || {})
        }

        // Handle habits
        if (habitsRes.ok) {
          const habitsData = await habitsRes.json()
          setHabits(habitsData.habits || [])
          setHabitDone(habitsData.habitDone || {})
        }

        // Handle journal
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

  // Reset state on logout
  const prevAuthRef = useRef(isAuthenticated)
  useEffect(() => {
    const wasAuthenticated = prevAuthRef.current
    prevAuthRef.current = isAuthenticated
    if (wasAuthenticated && !isAuthenticated) {
      setWaterGoal(2500)
      setWaterLog({})
      setHabits([])
      setHabitDone({})
      setDailyTasks({})
      setJournal([])
    }
  }, [isAuthenticated, setWaterGoal, setWaterLog, setHabits, setHabitDone, setDailyTasks, setJournal])

  // ── WATER MUTATIONS ────────────────────────────
  const updateWaterGoal = useCallback(async (goal) => {
    setWaterGoal(goal)
    if (isAuthenticated && token) {
      try {
        await fetch('/api/v1/water', {
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
        await fetch('/api/v1/water', {
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
        await fetch('/api/v1/water', {
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
        await fetch('/api/v1/water', {
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
        const res = await fetch('/api/v1/habits', {
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
        await fetch('/api/v1/habits', {
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

    // BUG A FIX: Snapshot from React state (not stale localStorage) before the optimistic update
    let snapshotBefore = null
    setHabitDone(prev => {
      snapshotBefore = prev  // capture current React state
      const day = { ...(prev[dateKey] || {}) }
      if (day[id]) delete day[id]
      else day[id] = time
      return { ...prev, [dateKey]: day }
    })

    if (isAuthenticated && token) {
      try {
        const res = await fetch('/api/v1/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ toggle: true, habitId: id, date: dateKey, time })
        })
        // Rollback if server rejected the toggle
        if (!res.ok) {
          console.error('Habit toggle rejected by server — rolling back UI')
          if (snapshotBefore !== null) setHabitDone(snapshotBefore)
        } else {
          const data = await res.json()
          if (data.user && version === toggleVersion.current) {
            setUser(prev => ({ ...prev, ...data.user }))
          }
        }
      } catch (err) {
        // Rollback on network failure to prevent false ticks persisting
        console.error('Habit toggle network error — rolling back UI:', err)
        if (snapshotBefore !== null) setHabitDone(snapshotBefore)
      }
    }
  }, [isAuthenticated, token, setHabitDone, setUser])

  // Memoized streak cache — computes all streaks once when habits/habitDone changes
  // instead of running a 365-iteration loop on every single render call.
  const streakCache = useMemo(() => {
    const cache = {}
    habits.forEach(habit => {
      let streak = 0
      let freezesRemaining = habit.streakFreezes ?? 3
      const relaxDay = habit.relaxDay
      const todayStr = toLocalISO()
      const parts = todayStr.split('-')
      const d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])))

      for (let i = 0; i < 365; i++) {
        const iso = d.toISOString().slice(0, 10)
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
        const day = habitDone[iso] || {}

        if (day[habit.id]) {
          streak++
          d.setUTCDate(d.getUTCDate() - 1)
        } else {
          if (i === 0) { d.setUTCDate(d.getUTCDate() - 1); continue }
          if (relaxDay && dayName === relaxDay) { d.setUTCDate(d.getUTCDate() - 1); continue }
          if (freezesRemaining > 0) { freezesRemaining--; d.setUTCDate(d.getUTCDate() - 1); continue }
          break
        }
      }
      cache[habit.id] = streak
    })
    return cache
  }, [habits, habitDone])

  const getStreak = useCallback((id) => streakCache[id] ?? 0, [streakCache])

  const waterStreak = useMemo(() => {
    let streak = 0
    const todayStr = toLocalISO()
    const parts = todayStr.split('-')
    const d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])))

    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0, 10)
      const dayEntries = waterLog[iso] || []
      const dayTotal = dayEntries.reduce((sum, e) => sum + e.ml, 0)
      
      if (dayTotal >= waterGoal) {
        streak++
        d.setUTCDate(d.getUTCDate() - 1)
      } else {
        if (i === 0) {
          d.setUTCDate(d.getUTCDate() - 1)
          continue
        }
        break
      }
    }
  }, [waterLog, waterGoal])

  const journalStreak = useMemo(() => {
    let streak = 0
    const todayStr = toLocalISO()
    const parts = todayStr.split('-')
    const d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])))

    const entryDates = new Set(journal.map(e => e.date))

    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0, 10)
      if (entryDates.has(iso)) {
        streak++
        d.setUTCDate(d.getUTCDate() - 1)
      } else {
        if (i === 0) {
          d.setUTCDate(d.getUTCDate() - 1)
          continue
        }
        break
      }
    }
    return streak
  }, [journal])

  const wisdomStreak = useMemo(() => {
    const match = habits.find(h => {
      const nameLower = h.name.toLowerCase()
      return nameLower.includes('read') || 
             nameLower.includes('wisdom') || 
             nameLower.includes('book') || 
             nameLower.includes('chanakya') || 
             nameLower.includes('gita') || 
             nameLower.includes('neeti') || 
             nameLower.includes('studies')
    })
    if (match) {
      return streakCache[match.id] ?? 0
    }
    // Fallback: check localStorage for today's wisdomRead
    const todayKey = toLocalISO()
    const localWisdomRead = localStorage.getItem('fwa_wisdom_read') === todayKey
    return localWisdomRead ? 1 : 0
  }, [habits, streakCache, habitDone])


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
        await fetch('/api/v1/journal', {
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
        await fetch('/api/v1/journal', {
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

  // ── AUTO-CHECK RITUAL FOR WISDOM CHALLENGE ──────────────────────────
  const habitsRef = useRef(habits)
  const habitDoneRef = useRef(habitDone)
  useEffect(() => {
    habitsRef.current = habits
  }, [habits])
  useEffect(() => {
    habitDoneRef.current = habitDone
  }, [habitDone])

  useEffect(() => {
    const WEEKLY_CHALLENGES = [
      { id: 'bhagavad_gita_3' },
      { id: 'lotus_jar_5' },
      { id: 'anxiety_guide' },
      { id: 'discipline_week' }
    ]
    // BUG 3 FIX: Use Monday-aligned week number (same as WeeklyChallenge.jsx)
    function getMondayAlignedWeekNum() {
      const epochDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
      return Math.floor((epochDay + 3) / 7)
    }
    function getWeekChallengeId() {
      const weekNum = getMondayAlignedWeekNum()
      return WEEKLY_CHALLENGES[weekNum % WEEKLY_CHALLENGES.length].id
    }

    const handleUpdate = async () => {
      if (!isAuthenticated || !token) return
      
      const challengeId = getWeekChallengeId()
      // BUG G FIX: Use ISO date string everywhere, not toDateString()
      const todayIso = toLocalISO()
      
      let currentProgress = 0
      let targetProgress = 1
      
      if (challengeId === 'lotus_jar_5') {
        const storedDate = localStorage.getItem('wisdom_jar_date')
        currentProgress = storedDate === todayIso ? parseInt(localStorage.getItem('wisdom_jar_count') || '0', 10) : 0
        targetProgress = 5
      } else {
        const raw = localStorage.getItem('wisdom_pages_read_today')
        let reads = {}
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed && parsed.date === todayIso && parsed.reads) {
              reads = parsed.reads
            }
          } catch (e) {}
        }
        if (challengeId === 'bhagavad_gita_3') {
          currentProgress = new Set([...(reads['1'] || []), ...(reads['3'] || [])]).size
          targetProgress = 3
        } else if (challengeId === 'anxiety_guide') {
          currentProgress = new Set([...(reads['3'] || []), ...(reads['6'] || [])]).size
          targetProgress = 1
        } else if (challengeId === 'discipline_week') {
          currentProgress = new Set([...(reads['2'] || []), ...(reads['4'] || [])]).size
          targetProgress = 2
        }
      }

      if (currentProgress >= targetProgress) {
        const todayKey = todayIso
        const match = habitsRef.current.find(h => {
          const nameLower = h.name.toLowerCase()
          return nameLower.includes('read') || 
                 nameLower.includes('wisdom') || 
                 nameLower.includes('book') || 
                 nameLower.includes('chanakya') || 
                 nameLower.includes('gita') || 
                 nameLower.includes('neeti') || 
                 nameLower.includes('studies')
        })

        if (match) {
          const isTicked = !!(habitDoneRef.current[todayKey] || {})[match.id]
          if (!isTicked) {
            console.log(`[Auto-Ritual] Daily reading goal met! Checking off habit: "${match.name}" (ID: ${match.id})`)
            toggleHabit(match.id, todayKey)
          }
        }
      }
    }

    // Only listen to progress updates. Do NOT run handleUpdate() immediately on mount/render
    window.addEventListener('wisdom_progress_updated', handleUpdate)
    return () => window.removeEventListener('wisdom_progress_updated', handleUpdate)
  }, [isAuthenticated, token, toggleHabit])

  return (
    <WellnessContext.Provider value={{
      // water
      waterGoal, setWaterGoal: updateWaterGoal,
      waterLog, todayEntries, todayTotal,
      addWater, removeWater, clearWaterToday, 
      getWaterStreak: () => waterStreak,
      getJournalStreak: () => journalStreak,
      getWisdomStreak: () => wisdomStreak,
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