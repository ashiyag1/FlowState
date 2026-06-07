import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSoundEffects } from './useSoundEffects'
import { useAchievements } from '../context/AchievementsContext'
import { useNotif } from '../components/system/NotificationPopup'
import { toLocalISO } from '../utils'

export function useSadhanaTimer() {
  const { user, updateProfile, adjustPoints } = useAuth()
  const { playHabitSound, stopWisdomAmbience } = useSoundEffects()
  const { trackEvent } = useAchievements()
  const notif = useNotif()

  const [ritualDone, setRitualDone] = useState(false)
  const [activePractice, setActivePractice] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Sync state from user profile or guest storage on mount or user change
  useEffect(() => {
    const todayKey = toLocalISO()
    if (user) {
      setRitualDone(user.preferences?.lastRitualDate === todayKey)
    } else {
      setRitualDone(localStorage.getItem('fwa_mockup_ritual_done') === todayKey)
    }
  }, [user])

  // Active Practice timer effect
  useEffect(() => {
    let t = null
    if (timerActive) {
      t = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            clearInterval(t)
            setTimeout(() => {
              completePractice()
            }, 0)
            return 0
          }
          return s - 1
        })
      }, 1000)
    }
    return () => {
      if (t) clearInterval(t)
    }
  }, [timerActive])

  const completePractice = async () => {
    const todayKey = toLocalISO()
    setRitualDone(true)
    if (user) {
      try {
        await updateProfile({ preferences: { ...user.preferences, lastRitualDate: todayKey } })
        await adjustPoints(10, 2)
      } catch (err) {
        console.error('Failed to log sadhana rewards:', err)
      }
    } else {
      localStorage.setItem('fwa_mockup_ritual_done', todayKey)
    }
    playHabitSound()
    trackEvent('sankalpa_completed')
    notif('Sadhana complete · +10 XP · +2 Prana · streak protected 🔥', 'success')
    setActivePractice(null)
    setTimerActive(false)
    stopWisdomAmbience()
  }

  const startPractice = (ritualName, ritualTimeMinutes) => {
    const currentRitual = { rname: ritualName, rtime: ritualTimeMinutes }
    setActivePractice(currentRitual)
    setTimerSeconds(Number(ritualTimeMinutes) * 60)
    setTimerActive(true)
    notif(`Sadhana activated · starting ${currentRitual.rname} ✦`, 'info')
  }

  const cancelPractice = () => {
    setActivePractice(null)
    setTimerActive(false)
  }

  const togglePractice = async (checked) => {
    const todayKey = toLocalISO()
    setRitualDone(checked)
    if (checked) {
      if (user) {
        try {
          await updateProfile({ preferences: { ...user.preferences, lastRitualDate: todayKey } })
          await adjustPoints(10, 2)
        } catch (err) {
          console.error(err)
        }
      } else {
        localStorage.setItem('fwa_mockup_ritual_done', todayKey)
      }
      playHabitSound()
      trackEvent('sankalpa_completed')
      notif('Sadhana logged · streak active 🔥', 'success')
    } else {
      if (user) {
        try {
          await updateProfile({ preferences: { ...user.preferences, lastRitualDate: '' } })
        } catch (err) {
          console.error(err)
        }
      } else {
        localStorage.removeItem('fwa_mockup_ritual_done')
      }
      notif('Sadhana undone')
    }
  }

  return {
    ritualDone,
    setRitualDone,
    activePractice,
    timerSeconds,
    timerActive,
    startPractice,
    completePractice,
    cancelPractice,
    togglePractice
  }
}
