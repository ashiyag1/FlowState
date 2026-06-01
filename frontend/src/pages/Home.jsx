import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Music, PenLine, CheckCircle2, Bookmark, Share2, Play, Flame, Droplet, Sparkles, Feather } from 'lucide-react'
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
import LotusFlower from '../icons/LotusFlower'
import { useNavigate, Link } from 'react-router-dom'
import WisdomStreak from '../components/wisdom/WisdomStreak'
import { useNotif } from '../components/system/NotificationPopup'
import { useAuth } from '../context/AuthContext'
import lotusImg from '../assets/dashboard/lotus.png'

export const SANKALPAS = {
  calm: {
    msg: 'Calm chosen · breathing space and rest shape your day',
    emoji: '🧘',
    label: 'Calm',
    suggestedRituals: [
      {
        name: 'Bhramari Buzz (Humming Bee Breath)',
        time: '2',
        desc: 'Reset your vibe and quiet the mind. Cover your ears with your hands and make a steady humming sound as you exhale.'
      },
      {
        name: 'Vibe Check Breathwork (Nadi Shodhana)',
        time: '3',
        desc: 'Take 5 rounds of alternate nostril breathing to balance your energy, quiet chaos, and soothe your nervous system.'
      }
    ],
    wisdomOptions: [
      { wis: '"As a lamp in a windless place does not flicker, so is the mind of a yogi absorbed in the Self."', src: 'Bhagavad Gita', ref: '— on inner stillness' },
      { wis: '"When the five senses and the mind are still, and the intellect does not waver, that is the highest state."', src: 'Katha Upanishad', ref: '— on finding peace within' }
    ]
  },
  focus: {
    msg: 'Focus chosen · sharp intent and single tasks',
    emoji: '🎯',
    label: 'Focus',
    suggestedRituals: [
      {
        name: 'Deep Om Resonance (Mantra Japa)',
        time: '2',
        desc: 'Clear the clutter. Take a deep breath and chant a slow "A-U-M" to lock in focus and calm your thoughts.'
      },
      {
        name: 'Mandala Breath Trace (Prana Trace)',
        time: '2',
        desc: 'Trace a circle in the air with your finger. Inhale as you trace up, and exhale as you trace down to lock in focus.'
      }
    ],
    wisdomOptions: [
      { wis: '"Yoga is the calming of the fluctuations of the mind."', src: 'Patanjali Yoga Sutras', ref: '— on mental clarity' },
      { wis: '"By restraining the senses and focusing the mind, one gains supreme strength."', src: 'Bhagavad Gita', ref: '— on single-pointed awareness' }
    ]
  },
  heal: {
    msg: 'Heal chosen · gentle recovery and listening to the body',
    emoji: '🌿',
    label: 'Heal',
    suggestedRituals: [
      {
        name: 'Temple Rub (Karna Mardana)',
        time: '2',
        desc: 'Ground your energy. Gently massage your earlobes and temples for a minute to release sensory tension.'
      },
      {
        name: 'Warm Water Sip (Tambaa Sip)',
        time: '1',
        desc: 'Slowly sip warm water. Ayurveda calls warm water the first medicine to cleanse digestion and hydrate your cells.'
      }
    ],
    wisdomOptions: [
      { wis: '"Health is the state where the three doshas, tissues, and wastes are in balance, and the soul and mind are full of bliss."', src: 'Sushruta Samhita', ref: '— on holistic wellness' },
      { wis: '"When diet is correct, medicine is of no need. When diet is wrong, medicine is of no use."', src: 'Ayurvedic Proverb', ref: '— on natural recovery' }
    ]
  },
  grow: {
    msg: 'Grow chosen · seeking discomfort and rising stronger',
    emoji: '🌱',
    label: 'Grow',
    suggestedRituals: [
      {
        name: 'Sun Salutes (Tadasana Stretch)',
        time: '2',
        desc: 'Level up your posture. Interlock your fingers, flip your palms up, and stretch tall on your tiptoes to release physical tension.'
      },
      {
        name: 'Warrior Pose (Veerabhadrasana)',
        time: '2',
        desc: 'Hold a wide warrior stance for 5 deep breaths on each side to build daily full-body strength and posture.'
      }
    ],
    wisdomOptions: [
      { wis: '"You are what your deep, driving desire is. As your desire is, so is your deed; so is your destiny."', src: 'Brihadaranyaka Upanishad', ref: '— on purposeful growth' },
      { wis: '"Arise! Awake! Approach the great ones and learn from them."', src: 'Katha Upanishad', ref: '— on rising stronger' }
    ]
  },
  discipline: {
    msg: 'Discipline chosen · simple rules, repeated daily',
    emoji: '⚔️',
    label: 'Discipline',
    suggestedRituals: [
      {
        name: 'Face Splash (Sheetala Snana)',
        time: '1',
        desc: 'Snap out of brain fog. Splash cold water on your face and eyes 5 times to reboot your nervous system and build instant discipline.'
      },
      {
        name: 'Spine Align (Dandasana)',
        time: '2',
        desc: 'Sit straight on the floor with legs extended forward for 2 minutes to settle scattered thoughts and build core willpower.'
      }
    ],
    wisdomOptions: [
      { wis: '"Tapas (discipline) burns away impurities and unlocks the powers of body and mind."', src: 'Patanjali Yoga Sutras', ref: '— on willpower' },
      { wis: '"A person is disciplined when they have control over their senses and act with wisdom, not impulse."', src: 'Bhagavad Gita', ref: '— on consistency' }
    ]
  },
  gratitude: {
    msg: 'Gratitude chosen · acknowledging the abundance around you',
    emoji: '🌸',
    label: 'Gratitude',
    suggestedRituals: [
      {
        name: 'Contentment Smile (Santosha Smile)',
        time: '1',
        desc: 'Shift from FOMO to JOMO. Close your eyes, smile gently, and take 3 deep breaths while appreciating the present moment.'
      },
      {
        name: 'Earth Touch (Bhoomi Vandana)',
        time: '1',
        desc: 'Touch the ground with your palm to say thank you to the earth for carrying you and offering a safe foundation.'
      }
    ],
    wisdomOptions: [
      { wis: '"Contentment (Santosha) brings supreme joy and is the source of ultimate happiness."', src: 'Patanjali Yoga Sutras', ref: '— on contentment' },
      { wis: '"Let us be grateful to the earth that carries us, the water that sustains us, and the air that lets us breathe."', src: 'Rig Veda', ref: '— on appreciating abundance' }
    ]
  }
}

export const getTodayRitual = (sankalpaObj) => {
  if (!sankalpaObj || !sankalpaObj.suggestedRituals) return null
  const day = new Date().getDate() // 1 to 31
  const idx = day % sankalpaObj.suggestedRituals.length
  return sankalpaObj.suggestedRituals[idx]
}




// Micro-challenges
const DAILY_CHALLENGES = [
  { emoji: '✍️', text: 'Write 3 words that describe your mind right now', action: 'Open Journal' },
  { emoji: '💧', text: 'Drink a glass of water before your next thought spiral', action: 'Track Water' },
  { emoji: '🫁', text: 'Take 4 slow breaths — inhale for 4, exhale for 6', action: null },
  { emoji: '🌅', text: 'Name one thing that went right today, no matter how small', action: 'Open Journal' },
  { emoji: '📵', text: 'Put your phone face-down for the next 10 minutes', action: null },
  { emoji: '🪞', text: "Write one sentence you'd say to a friend who felt how you feel", action: 'Open Journal' },
  { emoji: '🌿', text: 'Step outside or open a window — just one minute of fresh air', action: null },
]



function StepWrapper({ number, title, description, children, dark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'relative',
        padding: '2.5rem 1.8rem',
        marginBottom: '2.5rem',
        borderRadius: '24px',
        background: dark ? 'rgba(15,10,4,0.6)' : 'rgba(255,252,240,0.6)',
        border: '1px solid ' + (dark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)'),
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{
        position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #c9933a, #e8b96a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff',
        boxShadow: '0 8px 20px rgba(201,147,58,0.4)',
        border: '4px solid ' + (dark ? '#110b05' : '#fdf6e3')
      }}>
        {number}
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '0.8rem' }}>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: dark ? '#f5e6c8' : '#2d1f0e', marginBottom: '0.4rem' }}>{title}</h3>
        <p style={{ fontFamily: 'Lora, serif', fontStyle: 'italic', color: dark ? 'rgba(245,230,200,0.6)' : 'rgba(45,31,14,0.6)', fontSize: '0.9rem' }}>{description}</p>
      </div>
      {children}
    </motion.div>
  )
}

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

  // Soul archetype
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])

  // Correctly calculate journal streak (forgiving of current day not logged yet)
  const journalStreak = useMemo(() => {
    const dates = [...new Set(journal.map(e => e.date))].sort().reverse()
    if (dates.length === 0) return 0

    const todayStr = new Date().toISOString().slice(0, 10)
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      return 0
    }

    let count = 0
    let checkDate = new Date(dates[0])

    for (let i = 0; i < dates.length; i++) {
      const expected = checkDate.toISOString().slice(0, 10)
      if (dates[i] === expected) {
        count++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [journal])

  // Today's habits completion
  const todayStr = new Date().toISOString().slice(0, 10)
  const habitsCompletedToday = Object.keys(habitDone[todayStr] || {}).length
  const totalHabits = habits.length
  const habitPct = totalHabits > 0 ? habitsCompletedToday / totalHabits : 0
  const waterPct = waterGoal > 0 ? Math.min(todayTotal / waterGoal, 1) : 0

  // Actual habit streak (from actual habits logic)
  const habitStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0
    return Math.max(0, ...habits.map(h => getStreak(h.id)))
  }, [habits, getStreak])

  // Combined daily progress
  const journalToday = journal.some(e => e.date === todayStr)
  const waterGoalMet = todayTotal >= waterGoal
  const dailyProgress = [ritualDone, waterGoalMet, journalToday, wisdomRead].filter(Boolean).length
  const allDoneToday = dailyProgress === 4

  // Falling lotus petals state for 100% completion celebration (active for 5 seconds)
  const [showCelebration, setShowCelebration] = useState(false)
  const [petals, setPetals] = useState([])
  useEffect(() => {
    if (allDoneToday) {
      setShowCelebration(true)
      const newPetals = Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 12 + Math.random() * 14,
        delay: Math.random() * 1.8,
        duration: 2.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        drift: -15 + Math.random() * 30
      }))
      setPetals(newPetals)

      // Stop the celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setShowCelebration(false)
      setPetals([])
    }
  }, [allDoneToday])

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

          {/* Drifting Sacred Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${s.y}%`, left: `${s.x}%`,
                  fontSize: `${s.fontSize}px`, color: s.color,
                  opacity: isNight ? 0.24 : 0.25,
                  filter: 'drop-shadow(0 0 4px rgba(253,246,227,0.4))'
                }}
                animate={{
                  opacity: isNight ? [0, 0.42, 0] : [0, 0.7, 0],
                  y: isNight ? [0, -24, 0] : [0, -45, 0],
                  x: [0, (i % 2 === 0 ? 8 : -8), 0],
                  rotate: isNight ? [0, 80, 160] : [0, 180, 360]
                }}
                transition={{ duration: isNight ? s.duration * 1.6 : s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
              >
                {s.char}
              </motion.div>
            ))}
          </div>

          {/* Sacred Om watermark */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: 'clamp(320px, 55vw, 600px)', height: 'clamp(320px, 55vw, 600px)',
              borderRadius: '50%',
              background: dark
                ? 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            <span style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: 'clamp(14rem, 38vw, 32rem)',
              color: dark ? 'rgba(201, 168, 76, 0.035)' : 'rgba(201, 168, 76, 0.025)',
              lineHeight: 1, userSelect: 'none',
              transform: 'translateY(-6%)',
              letterSpacing: '-0.04em', fontWeight: 400,
            }}>ॐ</span>
          </div>

          {/* Page Body Container */}
          <div style={containerStyle}>

            {/* ══════════════════════════════════════
                DAILY FLAME — Streak + Progress Tracker
            ══════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                ...glassCardStyle,
                borderRadius: '24px',
                padding: '24px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background glow */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: allDoneToday
                  ? 'radial-gradient(ellipse at 50% 0%, rgba(200,169,110,0.18) 0%, transparent 60%)'
                  : 'radial-gradient(ellipse at 80% 0%, rgba(232,119,34,0.1) 0%, transparent 55%)',
                transition: 'background 1s ease',
              }} />

              {/* Falling Lotus Petals Celebration */}
              <AnimatePresence>
                {showCelebration && petals.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ top: '-10%', left: `${p.x}%`, rotate: p.rotation, opacity: 0 }}
                    animate={{
                      top: '110%',
                      left: `${p.x + p.drift}%`,
                      rotate: p.rotation + 360,
                      opacity: [0, 1, 1, 0]
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      ease: 'linear',
                      repeat: Infinity
                    }}
                    style={{
                      position: 'absolute',
                      pointerEvents: 'none',
                      zIndex: 10,
                      fontSize: `${p.size}px`,
                      userSelect: 'none'
                    }}
                  >
                    🌸
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Always display the progress tracker state */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  {/* Streak displays on left */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.img
                        src={lotusImg}
                        alt="Streak Lotus"
                        initial={{ scale: 0.2, rotate: -30, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{
                          type: 'spring',
                          stiffness: 160,
                          damping: 10
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 6px rgba(232, 98, 42, 0.15))'
                        }}
                      />
                      <span className="font-display text-2xl font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>
                        {habitStreak || 0}
                      </span>
                    </div>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? '#c8a96e' : '#8b7355', fontWeight: 700, marginTop: '4px', fontFamily: 'sans-serif' }}>
                      DAY STREAK
                    </span>
                  </div>

                  <div style={{ width: '1px', height: '48px', background: 'rgba(200,169,110,0.2)', flexShrink: 0 }} />

                  {/* 4 checklist tracker columns */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', minWidth: '240px' }}>
                    {[
                      { label: 'PRACTICE', done: ritualDone, emoji: '🧘', desc: 'Sadhana' },
                      { label: 'WATER', done: waterGoalMet, emoji: '💧', desc: 'Hydration' },
                      { label: 'JOURNAL', done: journalToday, emoji: '✍️', desc: 'Reflection' },
                      { label: 'WISDOM', done: wisdomRead, emoji: '📖', desc: 'Awakening' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <motion.div
                          whileHover={{ scale: 1.1, cursor: 'pointer' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (item.label === 'PRACTICE') {
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
                            } else if (item.label === 'WATER') {
                              addWater(lastDrinkMl)
                              playHydrationSound()
                              notif(`Logged ${lastDrinkMl}ml water 💧`, 'success')
                            } else if (item.label === 'JOURNAL') {
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
                            } else if (item.label === 'WISDOM') {
                              if (!wisdomRead) {
                                handleWisdomRead()
                                const el = document.getElementById('wisdom-scroll-section')
                                if (el) el.scrollIntoView({ behavior: 'smooth' })
                              } else {
                                setWisdomRead(false)
                                localStorage.removeItem('fwa_wisdom_read')
                                notif('Wisdom read state reset', 'info')
                              }
                            }
                          }}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            border: item.done
                              ? '1.5px solid #c9933a'
                              : '1px solid rgba(200,169,110,0.22)',
                            background: item.done
                              ? 'rgba(201,147,58,0.14)'
                              : 'transparent',
                            color: item.done ? '#c8a96e' : 'rgba(200,169,110,0.4)',
                            transition: 'all 0.3s'
                          }}
                        >
                          {item.done ? '✓' : item.emoji}
                        </motion.div>
                        <span style={{ fontSize: '9px', fontWeight: 600, color: item.done ? '#c8a96e' : (dark ? 'rgba(245,230,200,0.4)' : '#8b7355'), fontFamily: 'sans-serif' }}>
                          {item.label}
                        </span>
                        {item.label === 'WATER' && (
                          <span style={{ fontSize: '9px', color: item.done ? '#c8a96e' : (dark ? 'rgba(245,230,200,0.5)' : '#8b7355'), fontFamily: 'sans-serif', marginTop: '2px' }}>
                            {todayTotal}/{waterGoal}ml
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom dynamic status bar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px',
                  fontSize: '11px',
                  color: allDoneToday
                    ? (dark ? '#ffeab8' : '#3d2600')
                    : (dark ? 'rgba(245,230,200,0.5)' : '#8b7355'),
                  fontFamily: 'sans-serif',
                  borderTop: '1px solid rgba(200,169,110,0.1)',
                  paddingTop: '12px',
                  fontWeight: allDoneToday ? 600 : 400,
                  textAlign: 'center',
                }}>
                  {allDoneToday ? (
                    <span>✨ Beautifully done! All 4 daily pillars completed · streak updated to {habitStreak || 1} days! 🪷</span>
                  ) : (
                    <span>💡 Complete these 4 daily pillars to maintain your streak. Click any circle to log progress.</span>
                  )}
                </div>
              </div>

              {/* Bottom Progress Line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: dark ? 'rgba(200, 169, 110, 0.12)' : 'rgba(200, 169, 110, 0.2)',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${(dailyProgress / 4) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 70, damping: 15 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #c9933a 0%, #e8622a 100%)',
                    boxShadow: '0 0 6px rgba(232, 98, 42, 0.4)'
                  }}
                />
              </div>
            </motion.div>

            {/* Collapsible Sankalpa badge panel */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-12px', gap: '8px' }}>
              <div style={{
                ...glassCardStyle,
                borderRadius: '99px',
                padding: '8px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                fontSize: '12px'
              }}>
                <span style={{ color: '#c8a96e', fontFamily: 'sans-serif', fontWeight: 600 }}>
                  SANKALPA · <span style={{ color: dark ? '#ffeab8' : '#3d2600' }}>{currentSankalpa.emoji} {currentSankalpa.label}</span>
                </span>
                <button
                  onClick={() => setSankalpaPanelOpen(!sankalpaPanelOpen)}
                  style={{
                    background: 'transparent', border: 'none', color: '#e8622a', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'
                  }}
                >
                  {sankalpaPanelOpen ? 'close' : 'change'}
                </button>
              </div>
              <p style={{
                fontSize: '11px',
                color: dark ? 'rgba(245,230,200,0.55)' : 'rgba(45,31,14,0.55)',
                fontStyle: 'italic',
                margin: 0,
                textAlign: 'center',
                fontFamily: 'sans-serif',
                maxWidth: '440px',
                lineHeight: 1.4
              }}>
                We've set your daily Sankalpa (intention) to <strong>{currentSankalpa.label}</strong>. You can change this anytime to suit your state of mind.
              </p>
            </div>

            {/* Expandable selection tray */}
            <AnimatePresence>
              {sankalpaPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    ...glassCardStyle,
                    borderRadius: '20px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '8px'
                  }}>
                    <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, fontFamily: 'sans-serif' }}>
                      SELECT YOUR INTENTION TODAY:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {Object.entries(SANKALPAS).map(([key, item]) => {
                        const isActive = selectedSankalpa === key
                        return (
                          <button
                            key={key}
                            onClick={() => handleSetSankalpa(key)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '99px',
                              border: isActive ? '1px solid #c8a96e' : '0.5px solid rgba(200,169,110,0.3)',
                              fontSize: '12px',
                              background: isActive ? '#c8a96e' : 'rgba(200,169,110,0.06)',
                              color: isActive ? '#1c1208' : (dark ? '#ffeab8' : '#3d2600'),
                              cursor: 'pointer',
                              fontWeight: isActive ? 600 : 400,
                              fontFamily: 'sans-serif',
                              transition: 'all 0.15s'
                            }}
                          >
                            {item.emoji} {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Action — Ritual suggester */}
            <div style={{ borderRadius: '24px', padding: '24px', ...glassCardStyle }}>
              <div style={secLabelStyle}>
                <span>{viewMode === 'morning' ? "Suggested Sadhana" : "Evening Reflection"}</span>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,169,110,0.2)' }} />
              </div>

              {activePractice ? (
                /* Active breathing player */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#c8a96e', fontFamily: 'sans-serif', fontWeight: 600 }}>
                    ACTIVE PRACTICE: {activePractice.rname}
                  </span>
                  <div style={{
                    fontSize: '48px', fontFamily: 'monospace', fontWeight: 700, color: dark ? '#ffeab8' : '#1c1208'
                  }}>
                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleCompleteActivePractice}
                      style={{ padding: '8px 20px', borderRadius: '99px', background: '#c8a96e', border: 'none', color: '#1c1208', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}
                    >
                      Complete Sadhana
                    </button>
                    <button
                      onClick={() => { setActivePractice(null); setTimerActive(false); }}
                      style={{ padding: '8px 20px', borderRadius: '99px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Static view */
                <div>
                  {viewMode === 'morning' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                          {todayRitual.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: dark ? 'rgba(245,230,200,0.7)' : '#5c4322', margin: '4px 0 0', fontFamily: 'sans-serif' }}>
                          {todayRitual.desc}
                        </p>
                      </div>
                      <button
                        onClick={handleBeginActivePractice}
                        style={{
                          padding: '10px 20px', borderRadius: '99px', background: 'linear-gradient(135deg, #c8a96e, #ffe9a6)',
                          border: 'none', color: '#1c1208', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
                          boxShadow: '0 4px 15px rgba(200,169,110,0.3)'
                        }}
                      >
                        Start {todayRitual.time}m Practice
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                          How was your day, {userName}?
                        </h3>
                        <p style={{ fontSize: '13px', color: dark ? 'rgba(245,230,200,0.7)' : '#5c4322', margin: '4px 0 0', fontFamily: 'sans-serif' }}>
                          Let go of productivity guilt. Capture your evening reflection.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/journal')}
                        style={{
                          padding: '10px 20px', borderRadius: '99px', background: 'linear-gradient(135deg, #c8a96e, #ffe9a6)',
                          border: 'none', color: '#1c1208', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
                          boxShadow: '0 4px 15px rgba(200,169,110,0.3)'
                        }}
                      >
                        Write reflection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {soundPanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="mb-3 p-4 rounded-2xl journal-glass border border-gold/30 flex flex-col gap-2 shadow-2xl text-xs w-48 text-ink dark:text-ivory"
            >
              <div className="flex items-center gap-1.5 border-b border-gold/15 pb-2 mb-1 font-display font-semibold">
                <Music size={12} className="text-gold" /> Sound Sanctuary
              </div>
              {[
                { preset: 'sitarBgm', label: '🪕 Sitar & Drone' },
                { preset: 'flute', label: '🎵 Bansuri Flute' },
                { preset: 'meditation', label: '🔔 Temple Bells' },
              ].map((sound) => {
                const isPlaying = activeSound === sound.preset && !isMuted
                return (
                  <button
                    key={sound.preset}
                    onClick={() => handleToggleSound(sound.preset)}
                    className={`px-3 py-2 rounded-xl text-left transition-all border text-[11px] ${
                      isPlaying
                        ? 'bg-gold/20 border-gold text-gold-lt font-semibold'
                        : 'bg-white/[0.03] border-transparent hover:bg-white/5'
                    }`}
                  >
                    {sound.label} {isPlaying && '✦'}
                  </button>
                )
              })}
              <button
                onClick={toggleMute}
                className="w-full text-center py-1.5 mt-1 border-t border-white/5 text-[10px] text-saffron font-bold uppercase tracking-wider hover:underline"
              >
                {isMuted ? '🔊 Unmute All' : '🔇 Mute All'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundPanelOpen(!soundPanelOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-saffron to-gold text-white flex items-center justify-center shadow-lg shadow-gold/20 border border-white/30 cursor-pointer active:scale-95"
          title="Sound Sanctuary · ambient music"
          aria-label="Toggle ambient sound panel"
        >
          {activeSound && !isMuted ? (
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] bg-white rounded-full animate-[soundBar_0.8s_infinite]" style={{ height: '60%' }} />
              <span className="w-[2px] bg-white rounded-full animate-[soundBar_1.2s_infinite]" style={{ height: '100%', animationDelay: '0.2s' }} />
              <span className="w-[2px] bg-white rounded-full animate-[soundBar_1.0s_infinite]" style={{ height: '40%', animationDelay: '0.4s' }} />
            </div>
          ) : (
            <Volume2 size={18} />
          )}
        </motion.button>
      </div>

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
