import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Music, CheckCircle2, Bookmark, Play, Flame, Droplet, Sparkles, Feather } from 'lucide-react'
import PageLayout from '../components/ui/PageLayout'
import TopBorder from '../components/ui/TopBorder'
import HeroSection from '../sections/HeroSection'
import WisdomCarousel, { QuoteScroll, WisdomStyles } from '../sections/WisdomCarousel'
import DailyFlow from '../sections/DailyFlow'
import ExploreSection from '../sections/ExploreSection'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import FounderLetterModal from '../components/ui/FounderLetterModal'
import OnboardingWizardModal from '../components/ui/OnboardingWizardModal'
import homeBg from '../assets/home_bg.webp'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { getEmotionalReflection } from '../utils/emotionalMemory'
import { computeArchetype } from '../utils/soulArchetype'
import { useNavigate, Link } from 'react-router-dom'
import { useNotif } from '../components/system/NotificationPopup'
import { useAuth } from '../context/AuthContext'

// Extracted Subcomponents
import SacredWatermark from '../components/dashboard/SacredWatermark'
import DailyPillars from '../components/dashboard/DailyPillars'
import ActiveSadhanaPlayer from '../components/dashboard/ActiveSadhanaPlayer'
import SankalpaSelector from '../components/dashboard/SankalpaSelector'
import SoundSanctuaryPanel from '../components/dashboard/SoundSanctuaryPanel'

import { SANKALPAS, getTodayRitual } from '../data/sankalpaConfig'

export default function Home() {
  const { startWisdomAmbience, stopWisdomAmbience, isMuted, toggleMute, playHabitSound, playHydrationSound } = useSoundEffects()
  const { dark } = useTheme()
  const { journal, habitDone, habits, todayTotal, waterGoal, getStreak, addWater, addEntry, deleteEntry, waterLog, todayEntries } = useWellness()
  const { user, updateProfile } = useAuth()
  
  const [userName, setUserName] = useState(() => {
    return user?.name?.split(' ')[0] || localStorage.getItem('fwa_guest_name') || 'Seeker'
  })
  const navigate = useNavigate()
  const notif = useNotif()

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name.split(' ')[0])
    } else {
      setUserName(localStorage.getItem('fwa_guest_name') || 'Seeker')
    }
  }, [user])

  const [activeSound, setActiveSound] = useState(null)
  const [soundPanelOpen, setSoundPanelOpen] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)
  const [hasReadLetter, setHasReadLetter] = useState(() => {
    return localStorage.getItem('fwa_mockup_letter_read') === 'true'
  })
  const [sankalpaPanelOpen, setSankalpaPanelOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return !localStorage.getItem('fwa_onboarding_completed')
  })
  const [wisdomRead, setWisdomRead] = useState(() => {
    const todayKey = new Date().toISOString().slice(0, 10)
    return localStorage.getItem('fwa_wisdom_read') === todayKey
  })

  // Selected Sankalpa
  const [selectedSankalpa, setSelectedSankalpa] = useState(() => {
    return localStorage.getItem('fwa_mockup_sankalpa') || 'calm'
  })

  const handleOnboardingComplete = async ({ name, sankalpa }) => {
    localStorage.setItem('fwa_guest_name', name)
    localStorage.setItem('fwa_mockup_sankalpa', sankalpa)
    localStorage.setItem('fwa_onboarding_completed', 'true')
    setUserName(name)
    setSelectedSankalpa(sankalpa)
    setOnboardingOpen(false)

    if (user) {
      try {
        await updateProfile({ name, activeSankalpa: sankalpa })
      } catch (err) {
        console.error('Failed to sync onboarding to profile:', err)
      }
    }
    notif(`Welcome Seeker! Intention set to ${SANKALPAS[sankalpa]?.label || 'Calm'} 🪷`, 'success')
  }

  const currentSankalpa = SANKALPAS[selectedSankalpa] || SANKALPAS.calm
  const todayRitual = getTodayRitual(currentSankalpa) || { name: 'Sadhana Practice', time: '5', desc: 'Align with your Sankalpa for today through breath.' }

  // Active Ritual completion state
  const [ritualDone, setRitualDone] = useState(() => {
    return localStorage.getItem('fwa_mockup_ritual_done') === 'true'
  })

  // Dynamic ViewMode (Morning / Evening) togglable for preview, synced with actual hour
  const [viewMode, setViewMode] = useState(() => {
    const h = new Date().getHours()
    return (h >= 5 && h < 17) ? 'morning' : 'evening'
  })

  // Active Session State
  const [activePractice, setActivePractice] = useState(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Complete a ritual
  const handleCompleteRitual = () => {
    setRitualDone(true)
    localStorage.setItem('fwa_mockup_ritual_done', 'true')
    playHabitSound()
    notif('Sadhana complete · streak protected 🔥', 'success')
  }

  // Active Practice timer effect
  useEffect(() => {
    let t = null
    if (timerActive && timerSeconds > 0) {
      t = setInterval(() => {
        setTimerSeconds(s => s - 1)
      }, 1000)
    } else if (timerActive && timerSeconds === 0) {
      handleCompleteActivePractice()
    }
    return () => clearInterval(t)
  }, [timerActive, timerSeconds])

  // Track user session active days in local storage for re-entry checks
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
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
  const todayStr = new Date().toISOString().slice(0, 10)
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

  const handleSetSankalpa = (key) => {
    setSelectedSankalpa(key)
    localStorage.setItem('fwa_mockup_sankalpa', key)
    setRitualDone(false)
    localStorage.removeItem('fwa_mockup_ritual_done')
    setSankalpaPanelOpen(false)
  }

  const handleWisdomRead = () => {
    const todayKey = new Date().toISOString().slice(0, 10)
    localStorage.setItem('fwa_wisdom_read', todayKey)
    setWisdomRead(true)
    playHabitSound()
    notif('Wisdom read · progress tracked ✦', 'success')
  }

  const handleBeginActivePractice = () => {
    const currentRitual = { rname: todayRitual.name, rtime: todayRitual.time }
    setActivePractice(currentRitual)
    setTimerSeconds(Number(todayRitual.time) * 60)
    setTimerActive(true)
    notif(`Sadhana activated · starting ${currentRitual.rname} ✦`, 'info')
  }

  const handleCompleteActivePractice = () => {
    handleCompleteRitual()
    setActivePractice(null)
    setTimerActive(false)
    stopWisdomAmbience()
  }

  // Floating particles
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: 5 + (i * 8.3) % 90,
      y: 10 + (i * 12.3 + 7) % 80,
      delay: i * 0.45,
      duration: 8 + (i % 5) * 2.2,
      char: i % 4 === 0 ? '*' : i % 4 === 1 ? '.' : i % 4 === 2 ? 'o' : '+',
      color: isNight
        ? (i % 3 === 0 ? '#99a8c8' : i % 3 === 1 ? '#c9b080' : '#887cb8')
        : (i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#e87722' : '#d4607a'),
      fontSize: 8 + (i % 3) * 3,
    })), [isNight]
  )

  const handleToggleSound = (preset) => {
    if (activeSound === preset) {
      stopWisdomAmbience()
      setActiveSound(null)
    } else {
      startWisdomAmbience(preset)
      setActiveSound(preset)
    }
  }

  useEffect(() => {
    return () => { stopWisdomAmbience() }
  }, [stopWisdomAmbience])

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

  // Custom styling tokens
  const containerStyle = {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '2.5rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    position: 'relative',
    zIndex: 1,
  }

  const glassCardStyle = {
    background: dark ? 'rgba(20, 13, 6, 0.8)' : 'rgba(255, 252, 243, 0.9)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.22)' : '1px solid rgba(200, 169, 110, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(139,105,20,0.07)',
    transition: 'all 0.3s ease',
  }

  const secLabelStyle = {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    color: '#c8a96e',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    opacity: 0.95
  }

  return (
    <>
      <HeroSection viewMode={viewMode} reflection={reflection} />
      <TopBorder />
      <PageLayout>
        <main style={{ position: 'relative', background: dynamicBackgroundStyle, minHeight: '100vh' }}>

          {/* Drifting Sacred Sparkles and Watermark */}
          <SacredWatermark dark={dark} isNight={isNight} particles={particles} />

          {/* Page Body Container */}
          <div style={containerStyle}>

            {/* DAILY FLAME — Streak + Progress Tracker */}
            <DailyPillars
              dark={dark}
              habitStreak={habitStreak}
              ritualDone={ritualDone}
              waterGoalMet={waterGoalMet}
              journalToday={journalToday}
              wisdomRead={wisdomRead}
              todayTotal={todayTotal}
              waterGoal={waterGoal}
              onTogglePractice={() => {
                if (!ritualDone) {
                  setRitualDone(true)
                  localStorage.setItem('fwa_mockup_ritual_done', 'true')
                  playHabitSound()
                  notif(`Sadhana complete: "${todayRitual.name}" logged 🧘`, 'success')
                } else {
                  setRitualDone(false)
                  localStorage.removeItem('fwa_mockup_ritual_done')
                  notif(`Sadhana reset: "${todayRitual.name}" marked incomplete`, 'info')
                }
              }}
              onLogWater={() => {
                addWater(lastDrinkMl)
                playHydrationSound()
                notif(`Logged ${lastDrinkMl}ml water 💧`, 'success')
              }}
              onToggleJournal={() => {
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
              }}
              onToggleWisdom={() => {
                if (!wisdomRead) {
                  handleWisdomRead()
                  const el = document.getElementById('wisdom-scroll-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                } else {
                  setWisdomRead(false)
                  localStorage.removeItem('fwa_wisdom_read')
                  notif('Wisdom read state reset', 'info')
                }
              }}
            />

            {/* Collapsible Sankalpa badge & Expandable selection tray */}
            <SankalpaSelector
              dark={dark}
              selectedSankalpa={selectedSankalpa}
              currentSankalpa={currentSankalpa}
              sankalpaPanelOpen={sankalpaPanelOpen}
              onTogglePanel={() => setSankalpaPanelOpen(!sankalpaPanelOpen)}
              onSelectSankalpa={handleSetSankalpa}
            />

            {/* Primary Action — Suggested Sadhana/Evening reflection */}
            <ActiveSadhanaPlayer
              dark={dark}
              activePractice={activePractice}
              timerSeconds={timerSeconds}
              viewMode={viewMode}
              todayRitual={todayRitual}
              userName={userName}
              onStartPractice={handleBeginActivePractice}
              onCompletePractice={handleCompleteActivePractice}
              onCancelPractice={() => { setActivePractice(null); setTimerActive(false); }}
              onNavigateJournal={() => navigate('/journal')}
            />

            {/* Wisdom card scroll */}
            <section id="wisdom-scroll-section" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={secLabelStyle}>
                <span>Daily Wisdom Scroll</span>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,169,110,0.2)' }} />
              </div>
              <WisdomStyles />
              <div style={{ position: 'relative' }}>
                <QuoteScroll sankalpa={currentSankalpa} />
              </div>
              {!wisdomRead && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <button
                    onClick={handleWisdomRead}
                    style={{
                      padding: '6px 16px', borderRadius: '99px',
                      background: 'rgba(200,169,110,0.12)', border: '0.5px solid rgba(200,169,110,0.4)',
                      color: '#c8a96e', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif'
                    }}
                  >
                    Mark wisdom as read
                  </button>
                </div>
              )}
            </section>

            {/* 2-column grid for Heritage + Community */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Heritage column */}
              <div style={{ ...glassCardStyle, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '10px', color: '#c8a96e', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
                  ANCIENT HERITAGE
                </span>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                  Reconnect with Your Roots
                </h4>
                <p style={{ fontSize: '12.5px', color: dark ? 'rgba(245,230,200,0.75)' : '#5c4322', margin: 0, fontFamily: 'sans-serif', lineHeight: 1.5 }}>
                  How well do you know the wisdom that shaped our world? Journey beyond modern paths to explore the pioneering science, mathematics, and profound philosophy of ancient India.
                </p>
                <Link
                  to="/heritage"
                  style={{ fontSize: '11px', color: '#e8622a', fontWeight: 600, textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start', fontFamily: 'sans-serif' }}
                >
                  Explore archives →
                </Link>
              </div>

              {/* Community column */}
              <div style={{ ...glassCardStyle, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                  <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, fontFamily: 'sans-serif' }}>LIVE SANGHA</span>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 700, color: dark ? '#ffeab8' : '#1c1208', margin: 0 }}>
                  {Math.floor(40 + Math.sin(Date.now() / 15000) * 8)} souls
                </div>
                <p style={{ fontSize: '12px', color: dark ? 'rgba(245,230,200,0.7)' : '#5c4322', margin: 0, fontFamily: 'sans-serif' }}>
                  Practitioners currently in focus or deep reflection.
                </p>
                <Link
                  to="/community"
                  style={{ fontSize: '11px', color: '#e8622a', fontWeight: 600, textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start', fontFamily: 'sans-serif' }}
                >
                  Enter the Sangha →
                </Link>
              </div>
            </div>

            {/* Founder vision letter card */}
            {hasReadLetter ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <button
                  onClick={() => setLetterOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#c8a96e',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                    textDecoration: 'underline',
                    opacity: 0.75,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>💌</span> Read Ashiya's Vision Letter
                </button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setLetterOpen(true)
                  setHasReadLetter(true)
                  localStorage.setItem('fwa_mockup_letter_read', 'true')
                }}
                style={{
                  ...glassCardStyle,
                  borderRadius: '24px',
                  padding: '24px',
                  border: dark ? '1px dashed rgba(200, 169, 110, 0.3)' : '1px dashed rgba(200, 169, 110, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  background: dark ? 'rgba(30, 20, 25, 0.45)' : 'rgba(255, 240, 245, 0.55)',
                }}
              >
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '14px', opacity: 0.6 }}>✨</div>
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '14px', opacity: 0.6 }}>💖</div>

                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
                }}>
                  <span style={{ fontSize: '20px' }}>💌</span>
                </div>

                <div>
                  <h4 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '20px',
                    fontWeight: 700,
                    color: dark ? '#ffeab8' : '#3d2600',
                    margin: '0 0 4px 0'
                  }}>
                    A Note from the Founder
                  </h4>
                  <p style={{
                    fontSize: '12.5px',
                    color: dark ? 'rgba(245,230,200,0.65)' : '#5c4322',
                    margin: 0,
                    fontFamily: 'sans-serif',
                    lineHeight: 1.4,
                    maxWidth: '420px',
                    fontStyle: 'italic'
                  }}>
                    "FlowState is basically a piece of my own healing journey... where we don't have to be perfect, just present."
                  </p>
                </div>

                <span style={{
                  fontSize: '11px',
                  color: '#e8622a',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'sans-serif',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Read Ashiya's Vision Letter →
                </span>
              </motion.div>
            )}

          </div>

          <ImmersiveFooter />
        </main>
      </PageLayout>

      {/* Floating Sound Panel */}
      <SoundSanctuaryPanel
        soundPanelOpen={soundPanelOpen}
        onToggleSoundPanel={() => setSoundPanelOpen(!soundPanelOpen)}
        activeSound={activeSound}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onToggleMute={toggleMute}
      />

      <FounderLetterModal open={letterOpen} onClose={() => setLetterOpen(false)} dark={dark} />
      <OnboardingWizardModal
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        dark={dark}
        onComplete={handleOnboardingComplete}
      />
    </>
  )
}
