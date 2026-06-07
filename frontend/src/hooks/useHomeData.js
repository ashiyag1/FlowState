import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSoundEffects } from './useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { useAchievements } from '../context/AchievementsContext'
import { useAuth } from '../context/AuthContext'
import { useSoundSanctuary } from './useSoundSanctuary'
import { useSadhanaTimer } from './useSadhanaTimer'
import { useNotif } from '../components/system/NotificationPopup'
import { getEmotionalReflection } from '../utils/emotionalMemory'
import { toLocalISO } from '../utils'
import { SANKALPAS, getTodayRitual } from '../data/sankalpaConfig'
import { DASHBOARD_CONTAINER_STYLE, SEC_LABEL_STYLE, getGlassCardStyle } from '../config/constants'
import homeBg from '../assets/home_bg.webp'

export function useHomeData() {
  const { playHabitSound, playHydrationSound } = useSoundEffects()
  const { dark } = useTheme()
  const { journal, habitDone, habits, todayTotal, waterGoal, getStreak, addWater, addEntry, deleteEntry, waterLog, todayEntries } = useWellness()
  const { user, updateProfile, adjustPoints } = useAuth()
  const { trackEvent } = useAchievements()

  const {
    activeSound,
    soundPanelOpen,
    setSoundPanelOpen,
    toggleSound: handleToggleSound,
    isMuted,
    toggleMute
  } = useSoundSanctuary()

  const {
    ritualDone,
    setRitualDone,
    activePractice,
    timerSeconds,
    startPractice: handleBeginActivePractice,
    completePractice: handleCompleteActivePractice,
    cancelPractice,
    togglePractice: handleTogglePractice
  } = useSadhanaTimer()

  const [userName, setUserName] = useState(() => {
    return user?.name || 'Seeker'
  })
  const navigate = useNavigate()
  const notif = useNotif()

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name)
    } else {
      setUserName('Seeker')
    }
  }, [user])

  const [letterOpen, setLetterOpen] = useState(false)
  const [hasReadLetter, setHasReadLetter] = useState(false)
  const [sankalpaPanelOpen, setSankalpaPanelOpen] = useState(false)
  const [wisdomRead, setWisdomRead] = useState(false)
  const [selectedSankalpa, setSelectedSankalpa] = useState('calm')
  const [jarFading, setJarFading] = useState(false)
  const [levelUpLevel, setLevelUpLevel] = useState(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const prevLevelRef = useRef(null)

  // Sync state from user profile or guest storage
  useEffect(() => {
    if (user) {
      setHasReadLetter(user.preferences?.hasReadLetter || false)
      
      const todayKey = toLocalISO()
      setWisdomRead(user.preferences?.wisdomJarDate === todayKey)
      
      const storedDate = user.preferences?.sankalpaDate
      if (storedDate !== todayKey) {
        setSelectedSankalpa('unset')
        updateProfile({
          activeSankalpa: 'unset',
          preferences: { ...user.preferences, sankalpaDate: todayKey }
        }).catch(err => console.error('Failed to reset daily sankalpa:', err))
      } else {
        setSelectedSankalpa(user.activeSankalpa || 'calm')
      }
    } else if (!user) {
      // Guest mode
      setHasReadLetter(localStorage.getItem('fwa_mockup_letter_read') === 'true')
      
      const todayKey = toLocalISO()
      setWisdomRead(localStorage.getItem('fwa_wisdom_read') === todayKey)
      
      const storedDate = localStorage.getItem('fwa_sankalpa_date')
      if (storedDate !== todayKey) {
        localStorage.setItem('fwa_active_sankalpa', 'unset')
        localStorage.setItem('fwa_sankalpa_date', todayKey)
        setSelectedSankalpa('unset')
      } else {
        const localVal = localStorage.getItem('fwa_active_sankalpa') || 'calm'
        if (localVal.startsWith('{')) {
          try {
            setSelectedSankalpa(JSON.parse(localVal))
          } catch(e) {
            setSelectedSankalpa(localVal)
          }
        } else {
          setSelectedSankalpa(localVal)
        }
      }
    }
  }, [user])

  // Seeker Level Up (XP threshold) check & rewards
  useEffect(() => {
    if (user?.xp !== undefined) {
      const currentLevel = Math.floor(user.xp / 100) + 1
      if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
        setLevelUpLevel(currentLevel)
        setShowLevelUp(true)
        playHydrationSound()
        adjustPoints(0, 5)
      }
      prevLevelRef.current = currentLevel
    }
  }, [user, adjustPoints, playHydrationSound])

  const clearTestStates = () => {
    if (user) {
      updateProfile({ preferences: { ...user.preferences, lastRitualDate: '' } })
    } else {
      localStorage.removeItem('fwa_mockup_ritual_done')
    }
    setRitualDone(false)
    notif('Test states cleared')
  }

  const currentSankalpa = useMemo(() => {
    if (selectedSankalpa === 'unset') {
      return {
        key: 'unset',
        label: 'Set Intention',
        emoji: '🪷',
        msg: 'Please set your daily intention below to begin your alignment.'
      }
    }
    if (selectedSankalpa && typeof selectedSankalpa === 'object') {
      return selectedSankalpa
    }
    return SANKALPAS[selectedSankalpa] || SANKALPAS.calm
  }, [selectedSankalpa])

  const todayRitual = useMemo(() => {
    if (selectedSankalpa === 'unset') {
      return { name: 'Select Intention', time: '0', desc: 'Sadhana will be unlocked once you choose today\'s focus.' }
    }
    return getTodayRitual(currentSankalpa) || { name: 'Sadhana Practice', time: '5', desc: 'Align with your Sankalpa for today through breath.' }
  }, [currentSankalpa, selectedSankalpa])

  // Dynamic ViewMode (Morning / Evening) togglable for preview, synced with actual hour
  const [viewMode, setViewMode] = useState(() => {
    const h = new Date().getHours()
    return (h >= 5 && h < 17) ? 'morning' : 'evening'
  })

  // Reflection time & Sankalpa locking (8 PM to 5 AM)
  const isReflectionTime = useMemo(() => {
    const h = new Date().getHours()
    return h >= 20 || h < 5
  }, [])

  // Track user session active days in local storage for re-entry checks
  useEffect(() => {
    const todayStr = toLocalISO()
    const lastVisited = localStorage.getItem('fwa_last_visited')
    if (lastVisited && lastVisited !== todayStr) {
      localStorage.setItem('fwa_prev_visited', lastVisited)
    }
    localStorage.setItem('fwa_last_visited', todayStr)
  }, [])

  // Calculate dynamic reflection & time of day
  const reflection = useMemo(() => getEmotionalReflection(journal, habitDone), [journal, habitDone])
  const isNight = reflection.tod === 'night'

  // Today's habits completion
  const todayStr = toLocalISO()
  const waterGoalMet = todayTotal >= waterGoal

  // Actual habit streak (from actual habits logic)
  const habitStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0
    return Math.max(0, ...habits.map(h => getStreak(h.id)))
  }, [habits, getStreak])

  // Falling lotus petals state for 100% completion celebration (active for 5 seconds)
  const journalToday = journal.some(e => e.date === todayStr)

  // Calculate dynamic default drink size from user's last logged water entry
  const lastDrinkMl = useMemo(() => {
    if (todayEntries && todayEntries.length > 0) {
      return todayEntries[todayEntries.length - 1].ml
    }
    const dates = Object.keys(waterLog || {}).sort().reverse()
    for (const date of dates) {
      const dayLogs = waterLog[date] || []
      if (dayLogs.length > 0) {
        return dayLogs[dayLogs.length - 1].ml
      }
    }
    return 250 // fallback default
  }, [waterLog, todayEntries])

  const handleSetSankalpa = async (key) => {
    const todayKey = toLocalISO()
    setSelectedSankalpa(key)
    setRitualDone(false)
    if (user) {
      try {
        await updateProfile({
          activeSankalpa: key,
          preferences: { ...user.preferences, lastRitualDate: '', sankalpaDate: todayKey }
        })
      } catch (err) {
        console.error('Failed to sync sankalpa to profile:', err)
      }
    } else {
      localStorage.setItem('fwa_active_sankalpa', key)
      localStorage.setItem('fwa_sankalpa_date', todayKey)
      localStorage.removeItem('fwa_mockup_ritual_done')
    }
    setSankalpaPanelOpen(false)
  }

  const handleGenerateSankalpa = async (moodInput) => {
    if (!moodInput?.trim()) return
    const todayKey = toLocalISO()
    try {
      const res = await fetch('/api/v1/sankalpa/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fwa_auth_token')}`
        },
        body: JSON.stringify({ moodInput })
      })
      if (!res.ok) {
        throw new Error('Failed to generate Sankalpa')
      }
      const data = await res.json()
      if (data.sankalpa) {
        setSelectedSankalpa(data.sankalpa)
        setRitualDone(false)
        if (user) {
          await updateProfile({
            activeSankalpa: data.sankalpa,
            preferences: { ...user.preferences, lastRitualDate: '', sankalpaDate: todayKey }
          })
        } else {
          localStorage.setItem('fwa_active_sankalpa', JSON.stringify(data.sankalpa))
          localStorage.setItem('fwa_sankalpa_date', todayKey)
          localStorage.removeItem('fwa_mockup_ritual_done')
        }
        setSankalpaPanelOpen(false)
        notif(`Sankalpa generated: ${data.sankalpa.label} 🪷`, 'success')
      }
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('token')) {
        notif('Session expired. Please log in again.', 'error')
      } else {
        setRitualDone(false)
        if (user) {
          updateProfile({ preferences: { ...user.preferences, lastRitualDate: '' } })
        } else {
          localStorage.removeItem('fwa_mockup_ritual_done')
        }
        notif('Failed to generate Sankalpa.', 'error')
      }
    }
  }

  const handleReadWisdom = () => {
    const todayKey = toLocalISO()
    setJarFading(true)
    setTimeout(() => {
      setWisdomRead(true)
      if (user) {
        updateProfile({ preferences: { ...user.preferences, wisdomJarDate: todayKey } })
      } else {
        localStorage.setItem('fwa_wisdom_read', todayKey)
      }
      setJarFading(false)
      playHydrationSound()
      notif('Wisdom read · progress tracked ✦', 'success')
    }, 600)
  }

  const handleLogWater = () => {
    addWater(lastDrinkMl)
    playHydrationSound()
    notif(`Logged ${lastDrinkMl}ml water 💧`, 'success')
  }

  const handleToggleJournal = () => {
    if (!journalToday) {
      addEntry({
        date: todayStr,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        text: 'Quick reflection logged from home dashboard.',
        mood: 'Stillness'
      })
      playHabitSound()
      notif('Daily reflection completed ✍️', 'success')
    } else {
      const todayEntry = journal.find(e => e.date === todayStr)
      if (todayEntry) {
        deleteEntry(todayEntry.id)
        notif('Journal reflection reset', 'info')
      }
    }
  }

  const handleToggleWisdom = () => {
    if (!wisdomRead) {
      handleReadWisdom()
      const el = document.getElementById('wisdom-scroll-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      setWisdomRead(false)
      if (user) {
        updateProfile({ preferences: { ...user.preferences, wisdomJarDate: '' } })
      } else {
        localStorage.removeItem('fwa_wisdom_read')
      }
      notif('Wisdom read state reset', 'info')
    }
  }

  const dynamicBackgroundStyle = useMemo(() => {
    if (dark) {
      return `
        linear-gradient(180deg, rgba(23,14,6,0.85) 0%, rgba(23,14,6,0.3) 18%, transparent 28%),
        radial-gradient(ellipse at 50% 45%, rgba(22,14,6,0.92) 0%, rgba(22,14,6,0.4) 55%, transparent 75%),
        radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.07) 0%, transparent 60%),
        radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 35%),
        url(${homeBg}) center top / cover no-repeat
      `
    } else {
      return `
        linear-gradient(180deg, rgba(253,246,227,0.5) 0%, rgba(253,246,227,0.08) 18%, transparent 28%),
        radial-gradient(ellipse at 50% 45%, rgba(255,248,240,0.5) 0%, rgba(255,248,240,0.08) 55%, transparent 75%),
        radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.06) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.05) 0%, transparent 55%),
        radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 35%),
        url(${homeBg}) center top / cover no-repeat
      `
    }
  }, [dark])

  const containerStyle = DASHBOARD_CONTAINER_STYLE
  const glassCardStyle = getGlassCardStyle(dark)
  const secLabelStyle = SEC_LABEL_STYLE

  return {
    playHabitSound,
    playHydrationSound,
    dark,
    journal,
    habitDone,
    habits,
    todayTotal,
    waterGoal,
    getStreak,
    addWater,
    addEntry,
    deleteEntry,
    waterLog,
    todayEntries,
    user,
    updateProfile,
    adjustPoints,
    trackEvent,
    activeSound,
    soundPanelOpen,
    setSoundPanelOpen,
    handleToggleSound,
    isMuted,
    toggleMute,
    ritualDone,
    setRitualDone,
    activePractice,
    timerSeconds,
    handleBeginActivePractice,
    handleCompleteActivePractice,
    cancelPractice,
    handleTogglePractice,
    userName,
    setUserName,
    navigate,
    notif,
    letterOpen,
    setLetterOpen,
    hasReadLetter,
    setHasReadLetter,
    sankalpaPanelOpen,
    setSankalpaPanelOpen,
    wisdomRead,
    setWisdomRead,
    selectedSankalpa,
    setSelectedSankalpa,
    jarFading,
    setJarFading,
    levelUpLevel,
    setLevelUpLevel,
    showLevelUp,
    setShowLevelUp,
    viewMode,
    setViewMode,
    isReflectionTime,
    reflection,
    isNight,
    todayStr,
    waterGoalMet,
    habitStreak,
    journalToday,
    lastDrinkMl,
    currentSankalpa,
    todayRitual,
    clearTestStates,
    handleSetSankalpa,
    handleGenerateSankalpa,
    handleReadWisdom,
    handleLogWater,
    handleToggleJournal,
    handleToggleWisdom,
    dynamicBackgroundStyle,
    containerStyle,
    glassCardStyle,
    secLabelStyle
  }
}
