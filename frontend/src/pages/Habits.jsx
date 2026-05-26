import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, Sparkles, Flame, Check, X, BookOpen, Info, Award } from 'lucide-react'
import { useWellness } from '../context/WellnessContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import PageLayout from '../components/ui/PageLayout'
import HabitCheckbox from '../components/tracker/HabitCheckbox'
import StreakFlame from '../components/tracker/StreakFlame'
import ShimmerBar from '../components/tracker/ShimmerBar'
import habitsBg from '../assets/pages/habits_bg.webp'
import { getHinduDetails, getScientificInsights } from '../utils/hinduCalendar'
import { fmtDate } from '../utils'
import DiyaLamp from '../icons/DiyaLamp'

const ICONS = ['🏃','🧘','💧','📖','🌿','🍎','🏋️','✍️','🎨','🎵','🌅','🚴','🧠','💊','🥗','🛌','🧹','🌸','☀️','🦋','🎯','🏊','🍵','🛁','🌙','💪','📝','🌱','🦷','🕉️','🙏','🪷','🔥','⭐','📚','🎧']
const HABIT_COLORS = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE','#1A8A7A','#E86060']

const RITUAL_IDEAS = [
  { category: '🧘 Yoga & Movement', items: [
    { name: 'Surya Namaskar', icon: '🧘' },
    { name: 'Moon Salutations', icon: '🌙' },
    { name: 'Morning Stretch Flow', icon: '🤸' },
    { name: 'Sunset Yoga', icon: '🌅' },
    { name: 'Neck & Shoulder Rolls', icon: '🦢' },
    { name: 'Balance Poses', icon: '🦩' },
    { name: 'Hip Openers', icon: '🦋' },
  ]},
  { category: '🌿 Meditation & Breath', items: [
    { name: 'Anulom Vilom', icon: '🫁' },
    { name: 'Box Breathing', icon: '⬛' },
    { name: 'Body Scan Meditation', icon: '🔍' },
    { name: 'Loving Kindness', icon: '💛' },
    { name: 'Sitali Breath', icon: '❄️' },
    { name: 'Trataka (Candle Gaze)', icon: '🕯️' },
    { name: '5-Minute Silent Sit', icon: '🧘' },
    { name: 'OM Chanting', icon: '🕉️' },
  ]},
  { category: '📖 Learning & Mind', items: [
    { name: 'Read 10 Pages', icon: '📖' },
    { name: 'Journal Entry', icon: '✍️' },
    { name: 'Learn a Sanskrit Word', icon: '📜' },
    { name: 'Gratitude List', icon: '🙏' },
    { name: 'Affirmations', icon: '💫' },
    { name: 'Write a Poem', icon: '🎭' },
    { name: 'Study Bhagavad Gita', icon: '🪷' },
  ]},
  { category: '💪 Physical Wellness', items: [
    { name: '10k Steps', icon: '🚶' },
    { name: 'Drink 8 Glasses Water', icon: '💧' },
    { name: 'Oil Pulling', icon: '🪥' },
    { name: 'Tongue Scraping', icon: '👅' },
    { name: 'Cold Shower', icon: '🧊' },
    { name: 'Abhyanga (Self-Massage)', icon: '🛁' },
    { name: 'Eye Palming', icon: '👁️' },
  ]},
  { category: '🎨 Creative Expression', items: [
    { name: 'Draw or Doodle', icon: '🎨' },
    { name: 'Play an Instrument', icon: '🎵' },
    { name: 'Sing a Bhajan', icon: '🎤' },
    { name: 'Dance Freely', icon: '💃' },
    { name: 'Make a Vision Board', icon: '🌈' },
    { name: 'Cook Mindfully', icon: '🍳' },
  ]},
  { category: '🌱 Nature & Grounding', items: [
    { name: 'Walk Barefoot', icon: '🦶' },
    { name: 'Sun Gazing', icon: '☀️' },
    { name: 'Water Plants', icon: '🌻' },
    { name: 'Sit Under a Tree', icon: '🌳' },
    { name: 'Moon Bathing', icon: '🌕' },
    { name: 'Feed Birds', icon: '🐦' },
    { name: 'Deepika Lighting', icon: '🪔' },
  ]},
  { category: '🧹 Mindful Habits', items: [
    { name: 'Make Your Bed', icon: '🛌' },
    { name: 'Declutter 5 Mins', icon: '🧹' },
    { name: 'Digital Detox', icon: '📵' },
    { name: 'No Complaints Day', icon: '🤐' },
    { name: 'Organize Your Desk', icon: '📦' },
    { name: 'Plan Tomorrow', icon: '📋' },
  ]},
  { category: '📚 Study & Productivity', items: [
    { name: 'Pomodoro 25-5', icon: '⏱️' },
    { name: 'Active Recall Session', icon: '🧠' },
    { name: 'Make Revision Notes', icon: '📝' },
    { name: 'Study One Chapter', icon: '📘' },
    { name: 'Spaced Repetition', icon: '🔄' },
    { name: 'Teach Someone a Topic', icon: '👩‍🏫' },
    { name: 'Focus Music Session', icon: '🎧' },
    { name: 'Solve Practice Qs', icon: '✏️' },
    { name: 'Make a Mind Map', icon: '🗺️' },
    { name: 'Review Mistakes Log', icon: '📓' },
    { name: 'Watch a Learning Video', icon: '▶️' },
    { name: 'Set 3 Daily Goals', icon: '🎯' },
  ]},
  { category: '🙏 Spiritual Practice', items: [
    { name: 'Puja / Aarti', icon: '🪷' },
    { name: 'Mala Japa', icon: '📿' },
    { name: 'Read a Stotram', icon: '📜' },
    { name: 'Light a Diya', icon: '🪔' },
    { name: 'Offer Water to Sun', icon: '☀️' },
    { name: 'Tulsi Pradakshina', icon: '🌿' },
    { name: 'Bhajan Session', icon: '🎶' },
  ]},
]

const MOOD_DETAILS = {
  Grounding: {
    icon: '🌿',
    suggestion: 'Let your bare feet touch the earth, or take 10 slow deep breaths in silence.',
    reflection: 'A slower rhythm suits today. Ground your energy before the noise begins.'
  },
  Focus: {
    icon: '🎯',
    suggestion: 'Light a candle or diya, sit upright, and steady your eyes on the flame for 3 minutes.',
    reflection: 'Gather your scattered thoughts. Let single-pointed awareness guide your flow.'
  },
  Silence: {
    icon: '🤫',
    suggestion: 'Unplug from all screens and voices for just 15 minutes of pure quiet.',
    reflection: 'The world is loud enough. Rest in the space between sounds.'
  },
  Reflection: {
    icon: '✍️',
    suggestion: 'Write down one memory or thought from today that you wish to hold gently.',
    reflection: 'Observe your day with kindness. Every feeling is a temporary wave.'
  },
  Release: {
    icon: '💨',
    suggestion: 'Inhale deep, tense your shoulders, then let them drop fully as you sigh out.',
    reflection: 'Some burdens are not yours to carry. Let them go softly tonight.'
  },
  Restoration: {
    icon: '🛌',
    suggestion: 'Rest flat on your back, letting the weight of the day sink into the floor.',
    reflection: 'Your body deserves comfort. No need to force productivity now.'
  },
  Stillness: {
    icon: '🧘',
    suggestion: 'Sit completely still, watching the thoughts pass like clouds in the sky.',
    reflection: 'You do not need to react to everything. Just sit, breathe, and exist.'
  }
}

function fadeUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
  }
}

export default function Habits() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { habits, addHabit, deleteHabit, habitDone, toggleHabit, getStreak } = useWellness()
  const { trackEvent } = useAchievements()
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [selColor, setSelColor] = useState(HABIT_COLORS[0])
  const [calDate, setCalDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Selected Day on monthly calendar (defaults to today's date)
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())

  const todayStr = new Date().toISOString().slice(0, 10)
  const td = todayStr
  const todayDone = habitDone[td] || {}
  const doneCount = habits.filter(h => todayDone[h.id]).length

  // Mood State
  const [activeMood, setActiveMood] = useState(() => {
    return localStorage.getItem('fwa_ritual_mood') || 'Grounding'
  })
  
  // Lunar Facts Carousel State
  const [currentInsightIdx, setCurrentInsightIdx] = useState(0)

  // Suggested Practice State - Completed Moods for Today
  const [completedMoods, setCompletedMoods] = useState(() => {
    try {
      const saved = localStorage.getItem('fwa_completed_moods_' + todayStr)
      return saved ? JSON.parse(saved) : {}
    } catch (e) {
      return {}
    }
  })

  const isSuggestedDone = !!completedMoods[activeMood]

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color: selColor })
    setName('')
    setIcon(ICONS[0])
    setSelColor(HABIT_COLORS[0])
    setShowAddForm(false)
  }

  const handleToggleHabit = (id, dateKey = td) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const alreadyDone = !!(habitDone[dateKey] || {})[id]
    toggleHabit(id, dateKey)
    if (!alreadyDone) {
      playHabitSound()
      trackEvent('habit_toggled')
    }
  }

  const handleDeleteHabit = (e, id) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    deleteHabit(id)
  }

  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isoForDay = (d) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const weekday = (d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(isoForDay(d)).getDay()]

  const bestStreak = Math.max(0, ...habits.map(h => getStreak(h.id)))
  const allDoneToday = habits.length > 0 && doneCount === habits.length
  const pctToday = habits.length ? Math.round(doneCount / habits.length * 100) : 0
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()

  // Selected Day Calculations
  const selectedIso = isoForDay(selectedDay)
  const selectedHindu = getHinduDetails(selectedIso)
  const scientificInsights = getScientificInsights()
  const selectedDayDone = habitDone[selectedIso] || {}
  const selectedDoneCount = habits.filter(h => selectedDayDone[h.id]).length
  const doneRatio = habits.length ? selectedDoneCount / habits.length : 0
  const selectedCompletionPct = Math.round(doneRatio * 100)
  const currentInsight = scientificInsights[currentInsightIdx]
  const monthStats = dayNums.reduce((acc, day) => {
    const iso = isoForDay(day)
    if (iso > todayStr) return acc
    const dayDone = habitDone[iso] || {}
    const count = habits.filter(h => dayDone[h.id]).length
    if (count > 0) acc.activeDays += 1
    if (habits.length > 0 && count === habits.length) acc.perfectDays += 1
    acc.totalDone += count
    return acc
  }, { activeDays: 0, perfectDays: 0, totalDone: 0 })

  const getDayRun = (day) => {
    const iso = isoForDay(day)
    const dayDone = habitDone[iso] || {}
    const count = habits.filter(h => dayDone[h.id]).length
    if (count === 0 || iso > todayStr) return 0
    let run = 0
    for (let cursor = day; cursor >= 1; cursor -= 1) {
      const cursorIso = isoForDay(cursor)
      const cursorDone = habitDone[cursorIso] || {}
      const cursorCount = habits.filter(h => cursorDone[h.id]).length
      if (cursorCount === 0 || cursorIso > todayStr) break
      run += 1
    }
    return run
  }

  const getSubtleObservation = () => {
    const hour = new Date().getHours()
    const isLateNight = hour >= 21 || hour < 5
    const isEvening = hour >= 17 && hour < 21
    
    if (bestStreak > 5) {
      return "Your daily rituals have built a steady foundation. Feel the quiet stability you've created."
    }
    if (bestStreak === 0 && doneCount === 0) {
      return "You don't need a perfect streak to begin again. A single conscious breath is enough."
    }
    if (isLateNight) {
      return "You tend to arrive after sunset. Rest your thoughts and let the night settle."
    }
    if (isEvening) {
      return "As evening sets in, remember you don't need to carry the whole day's weight."
    }
    return "Start gently. A small, simple ritual can change the tone of your day."
  }

  return (
    <PageLayout>
      {/* Background Cover */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${habitsBg}) center/cover no-repeat fixed`,
        filter: dark ? 'brightness(0.35) saturate(0.9)' : 'brightness(0.92) saturate(1.05)',
        opacity: dark ? 0.95 : 0.8,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '4.5rem 1.2rem 4rem'
      }}>
        
        {/* HERO TITLE */}
        <motion.div initial="hidden" animate="show" variants={fadeUp(0)} className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1 inline-block text-gold text-lg"
          >
            🪷
          </motion.div>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.3em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.2rem'
          }}>
            ✦ RHYTHMS OF STILLNESS ✦
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2.5rem',
            fontWeight: 400, color: dark ? '#f0e6d0' : '#2D1F0E', lineHeight: 1.1, margin: '0'
          }}>
            Daily Rhythm &amp; Rituals
          </h1>
        </motion.div>

        {/* 1. TODAY'S RHYTHM & MOOD SELECTOR (Full Width) */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeUp(0.04)} 
          style={{
            background: dark ? 'rgba(20, 15, 10, 0.45)' : 'rgba(255, 252, 246, 0.65)',
            border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid rgba(201, 168, 76, 0.22)',
            borderRadius: '24px',
            padding: '1.5rem',
            marginBottom: '1.8rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : '0 12px 36px rgba(139,111,76,0.06)',
          }}
        >
          {/* Gregorian + Indian Lunar Calendar Title */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/10 pb-3 mb-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-saffron font-bold">
                Gregorian + Indian Lunar Calendar
              </span>
              <h2 className="font-display text-base text-ivory font-semibold mt-0.5" style={{ color: dark ? '#f3edd7' : '#3d250d' }}>
                {new Date(selectedIso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                <span className="text-gold/60 ml-2 font-normal text-xs">
                  — {selectedHindu.moonSymbol} {selectedHindu.tithiEmoji} {selectedHindu.tithiName} ({selectedHindu.paksha})
                </span>
              </h2>
            </div>
            {/* Soft observations */}
            <p style={{
              fontFamily: "'Lora', serif",
              fontStyle: 'italic',
              fontSize: '0.82rem',
              color: dark ? '#ffeab8' : '#6b4c12',
              margin: 0,
              opacity: 0.85,
            }}>
              {getSubtleObservation()}
            </p>
          </div>

          {/* Moods row */}
          <div className="mb-4">
            <span className="text-[9px] uppercase tracking-wider text-gold font-bold block mb-2">
              What is your spirit seeking today?
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(MOOD_DETAILS).map((m) => {
                const active = activeMood === m
                return (
                  <motion.button
                    key={m}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setActiveMood(m)
                      localStorage.setItem('fwa_ritual_mood', m)
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: active 
                        ? '1px solid #c9a84c' 
                        : (dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'),
                      background: active 
                        ? 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)' 
                        : (dark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)'),
                      color: active 
                        ? (dark ? '#ffe090' : '#8a5a12') 
                        : (dark ? '#e8d5a8' : '#5c3d1e'),
                      boxShadow: active ? '0 0 12px rgba(201,168,76,0.18)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span className="mr-1">{MOOD_DETAILS[m].icon}</span> {m}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Suggested daily practice */}
          <div style={{
            background: dark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.35)',
            border: '1px dashed rgba(201, 168, 76, 0.25)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div className="flex-1">
              <span className="text-[8px] uppercase tracking-wider text-saffron font-bold block">
                Suggested {activeMood} Practice
              </span>
              <p className="text-xs text-ivory/80 leading-relaxed font-light mt-1" style={{ color: dark ? '#e8ebd8' : '#3a2007' }}>
                <strong>{MOOD_DETAILS[activeMood].icon} {MOOD_DETAILS[activeMood].suggestion}</strong>
              </p>
              <p className="text-[10px] text-ink-soft/50 dark:text-ivory/50 font-light mt-0.5 italic">
                {MOOD_DETAILS[activeMood].reflection}
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newStatus = !isSuggestedDone
                const updated = { ...completedMoods, [activeMood]: newStatus }
                setCompletedMoods(updated)
                localStorage.setItem('fwa_completed_moods_' + todayStr, JSON.stringify(updated))
                if (newStatus) {
                  playHabitSound()
                  trackEvent('suggested_ritual_done')
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '10px',
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                background: isSuggestedDone 
                  ? 'linear-gradient(135deg, #1A7A4E 0%, #2D6A4F 100%)' 
                  : 'linear-gradient(135deg, #E8622A 0%, #C9933A 100%)',
                color: 'white',
                boxShadow: isSuggestedDone ? '0 4px 12px rgba(26,122,78,0.3)' : '0 4px 12px rgba(232,98,42,0.3)',
              }}
            >
              {isSuggestedDone ? '✦ Completed' : 'Ignite Ritual'}
            </motion.button>
          </div>
        </motion.div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Active Rituals Checklist (Main Flow Focus) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* MY SADHANA RITUALS CARD */}
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.08)} 
              style={{
                background: dark ? 'rgba(20, 15, 10, 0.55)' : 'rgba(255, 252, 246, 0.70)',
                border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid rgba(201, 168, 76, 0.22)',
                borderRadius: '24px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : '0 12px 36px rgba(139,111,76,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-2">
                <span className="font-display text-xs text-gold flex items-center gap-1.5 uppercase font-bold tracking-wide">
                  🕯️ My Active Sadhanas
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-[10px] text-gold-lt border border-gold/30 hover:bg-gold/15 py-1 px-3 rounded-full transition-all font-semibold"
                >
                  {showAddForm ? 'Close Builder' : '+ Add Ritual'}
                </button>
              </div>

              {/* Collapsible form container */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4 p-3 border border-gold/10 rounded-2xl bg-black/10 flex flex-col gap-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Name</label>
                        <input
                          type="text"
                          value={name}
                          placeholder="Type or pick an idea below →"
                          maxLength={35}
                          onChange={e => setName(e.target.value)}
                          className="w-full rounded-xl border border-gold/20 bg-white/5 px-3 py-2 text-xs text-ink dark:text-ivory outline-none focus:border-gold"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Color Accent</label>
                        <div className="flex gap-1.5 flex-wrap py-1">
                          {HABIT_COLORS.map(c => (
                            <button
                              key={c}
                              onClick={() => setSelColor(c)}
                              className="w-5 h-5 rounded-md border transition-all"
                              style={{
                                backgroundColor: c,
                                borderColor: selColor === c ? 'white' : 'transparent',
                                transform: selColor === c ? 'scale(1.1)' : 'none'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1.5">✨ Pick a Ritual Idea</label>
                      <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                        {RITUAL_IDEAS.map(group => (
                          <div key={group.category}>
                            <span className="text-[8px] uppercase tracking-widest text-ink-soft/40 dark:text-ivory/40 font-bold block mb-1">{group.category}</span>
                            <div className="flex flex-wrap gap-1">
                              {group.items.map(item => (
                                <button
                                  key={item.name}
                                  onClick={() => { setName(item.name); setIcon(item.icon) }}
                                  className="text-[10px] px-2 py-1 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 bg-white/[0.02] text-ink dark:text-ivory/80 transition-all whitespace-nowrap"
                                >
                                  {item.icon} {item.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Choose Icon</label>
                      <div className="flex flex-wrap gap-1 bg-black/20 p-2 rounded-xl max-h-[50px] overflow-y-auto">
                        {ICONS.map(ic => (
                          <button
                            key={ic}
                            onClick={() => setIcon(ic)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-all ${
                              ic === icon ? 'bg-gold/20' : 'bg-transparent hover:bg-white/5'
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={!name.trim()}
                      className="w-full py-2 bg-gradient-to-r from-saffron to-gold text-white font-semibold text-xs tracking-wider rounded-xl disabled:opacity-30 transition-all hover:shadow-lg active:scale-98"
                    >
                      + Add New Sadhana
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. Dynamic Sadhana Diya */}
              <div className="flex items-center gap-4 bg-black/10 p-3 rounded-2xl border border-white/5 mb-3">
                <div style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    position: 'absolute',
                    inset: -8,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(255,160,32,${0.15 + doneRatio * 0.35}) 0%, transparent 70%)`,
                    filter: 'blur(4px)',
                    opacity: doneCount > 0 ? 1 : 0.3,
                    transition: 'all 0.5s ease',
                  }} />
                  <DiyaLamp size={38} className={doneCount > 0 ? "fs-active-diya" : ""} progress={doneRatio} />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-xs font-bold text-ink dark:text-ivory" style={{ color: dark ? '#f3edd7' : '#3d250d' }}>Your Daily Sadhana Flame</h4>
                  <p className="text-[10px] text-ink-soft/60 dark:text-ivory/60 leading-normal font-light">
                    {selectedDoneCount === 0 
                      ? "Begin a small ritual to light your sanctuary fire." 
                      : selectedDoneCount === habits.length 
                        ? "Your flame burns bright. Your day is in rhythm." 
                        : "Your daily ritual fire is glowing. Keep going."}
                  </p>
                </div>
              </div>

              {/* Rituals list items */}
              <div className="flex flex-col gap-2">
                {habits.length === 0 ? (
                  <p className="text-xs text-ink-soft/50 dark:text-ivory/50 italic text-center py-4">No rituals added yet.</p>
                ) : (
                  habits.map((h) => {
                    const done = !!selectedDayDone[h.id]
                    const streak = getStreak(h.id)
                    const isPastOrToday = selectedIso <= todayStr

                    return (
                      <motion.div
                        key={h.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => { if (isPastOrToday) handleToggleHabit(h.id, selectedIso) }}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer select-none transition-all ${
                          done
                            ? 'bg-gold/5 border-gold/25 text-ink dark:text-ivory'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                        }`}
                        style={{ opacity: isPastOrToday ? 1 : 0.4 }}
                      >
                        <HabitCheckbox done={done} color={h.color} size={22} />
                        <span className="text-base shrink-0">{h.icon}</span>
                        <span className="flex-1 truncate font-display font-medium text-ink dark:text-ivory/95" style={{ color: dark ? '#fcf6e8' : '#3d2e1a' }}>
                          {h.name}
                        </span>
                        <StreakFlame streak={streak} />
                        <button
                          onClick={(e) => handleDeleteHabit(e, h.id)}
                          className="p-1 rounded-md text-ink-soft/20 dark:text-ivory/20 hover:text-rose-400 hover:bg-white/5 shrink-0"
                        >
                          <X size={11} />
                        </button>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT PANEL: Gregorian + Indian Lunar Calendar (Environmental layer) & Facts Carousel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* MONTHLY CALENDAR GRID CARD */}
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.1)} 
              style={{
                background: dark ? 'rgba(20, 15, 10, 0.35)' : 'rgba(255, 252, 246, 0.5)',
                border: dark ? '1px solid rgba(201, 168, 76, 0.12)' : '1px solid rgba(201, 168, 76, 0.18)',
                borderRadius: '24px',
                padding: '1.25rem',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: 'none', // removes administrative dominance
              }}
            >
              {/* Calendar Header with Navigators */}
              <div className="flex items-center justify-between mb-3 border-b border-gold/10 pb-2">
                <div>
                  <h2 className="font-display text-sm text-ivory font-semibold" style={{ color: dark ? '#e8d9b5' : '#5C3D1E' }}>
                    {calDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h2>
                  <p className="text-[9px] text-ink-soft/40 dark:text-ivory/40 font-light mt-0.5">
                    Gregorian &amp; Indian Lunar Cycles
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'Active days', value: monthStats.activeDays },
                  { label: 'Perfect days', value: monthStats.perfectDays },
                  { label: 'Ritual sparks', value: monthStats.totalDone },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      borderRadius: 14,
                      padding: '8px 6px',
                      textAlign: 'center',
                      background: dark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.48)',
                      border: dark ? '1px solid rgba(201,168,76,0.12)' : '1px solid rgba(201,168,76,0.18)',
                    }}
                  >
                    <div className="font-display text-sm font-bold" style={{ color: dark ? '#ffeab8' : '#6b3f10' }}>
                      {stat.value}
                    </div>
                    <div className="text-[8px] uppercase tracking-wider text-gold/60">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 7-Column Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Weekday labels */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center font-display text-[9px] font-bold text-gold/40 uppercase tracking-wider py-1">
                    {day}
                  </div>
                ))}

                {/* Pre-offset blank days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-transparent rounded-xl aspect-[1.1]" />
                ))}

                {/* Days of the month */}
                {dayNums.map(d => {
                  const iso = isoForDay(d)
                  const isToday = iso === todayStr
                  const isSelected = selectedDay === d
                  const hindu = getHinduDetails(iso)
                  
                  const dayDone = habitDone[iso] || {}
                  const doneOnDayCount = habits.filter(h => dayDone[h.id]).length
                  
                  const isFuture = iso > todayStr
                  const hasHabits = habits.length > 0
                  const isPerfect = hasHabits && doneOnDayCount === habits.length
                  const isPartial = hasHabits && doneOnDayCount > 0 && doneOnDayCount < habits.length
                  const hasProgress = isPerfect || isPartial
                  const completionPct = hasHabits ? Math.round((doneOnDayCount / habits.length) * 100) : 0
                  const runLength = getDayRun(d)
                  const isOnRun = runLength >= 2
                  const ringColor = isPerfect ? '#f5c84c' : isPartial ? '#E8622A' : 'rgba(201,168,76,0.18)'

                  // Dynamic styles for the gamified "wow i completed these tasks everyday?? damn" vibe
                  let cellBg = 'transparent'
                  let cellBorder = 'transparent'
                  let cellShadow = 'none'

                  if (isSelected) {
                    cellBg = dark ? 'rgba(201, 168, 76, 0.18)' : 'rgba(201, 168, 76, 0.22)'
                    cellBorder = 'rgba(201, 168, 76, 0.5)'
                  } else if (isToday) {
                    cellBg = dark ? 'rgba(232, 98, 42, 0.08)' : 'rgba(232, 98, 42, 0.12)'
                    cellBorder = 'rgba(232, 98, 42, 0.35)'
                  } else if (!isFuture && isPerfect) {
                    // Perfect Day! Glowing Gold to Saffron blend
                    cellBg = dark 
                      ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.30) 0%, rgba(232, 98, 42, 0.22) 100%)' 
                      : 'linear-gradient(135deg, rgba(251, 244, 228, 0.95) 0%, rgba(253, 240, 232, 0.95) 100%)'
                    cellBorder = dark ? 'rgba(201, 168, 76, 0.5)' : 'rgba(201, 168, 76, 0.6)'
                    cellShadow = dark ? '0 0 18px rgba(201, 168, 76, 0.34)' : '0 0 16px rgba(201, 168, 76, 0.22)'
                  } else if (!isFuture && isPartial) {
                    // Partial Day! Soft Silver/Bronze layer
                    cellBg = dark 
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(201, 168, 76, 0.06) 100%)' 
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(201, 168, 76, 0.08) 100%)'
                    cellBorder = dark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(201, 168, 76, 0.25)'
                  }

                  return (
                    <motion.div
                      key={d}
                      whileHover={{ scale: 1.06, y: -2 }}
                      onClick={() => setSelectedDay(d)}
                      className={`rounded-lg p-1.5 cursor-pointer transition-all border flex flex-col justify-between aspect-[1.08] relative overflow-hidden ${
                        !isSelected && !isToday && !hasProgress
                          ? 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-gold/15'
                          : ''
                      }`}
                      style={{
                        background: cellBg,
                        borderColor: cellBorder,
                        boxShadow: cellShadow,
                        opacity: isFuture ? 0.45 : 1,
                      }}
                    >
                      {isOnRun && !isFuture && (
                        <div
                          style={{
                            position: 'absolute',
                            left: -8,
                            right: -8,
                            bottom: 6,
                            height: 2,
                            background: 'linear-gradient(90deg, transparent, rgba(245,200,76,0.72), transparent)',
                            boxShadow: '0 0 10px rgba(245,200,76,0.38)',
                          }}
                        />
                      )}

                      {/* Cell Header: Gregorian Day & Tithi abbreviation */}
                      <div className="flex justify-between items-center">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold relative"
                          style={{
                            color: isToday || isPerfect ? '#fff' : (dark ? 'rgba(255,246,232,0.78)' : '#594022'),
                            background: hasProgress
                              ? `conic-gradient(${ringColor} ${completionPct * 3.6}deg, rgba(255,255,255,0.09) 0deg)`
                              : (isToday ? '#E8622A' : 'rgba(255,255,255,0.04)'),
                            boxShadow: isPerfect ? '0 0 10px rgba(245,200,76,0.45)' : 'none',
                          }}
                        >
                          <span
                            className="absolute inset-[2px] rounded-full"
                            style={{
                              background: isPerfect
                                ? 'linear-gradient(135deg, #E8622A, #C9933A)'
                                : isPartial
                                  ? (dark ? 'rgba(20,15,10,0.9)' : '#fff8ee')
                                  : isToday
                                    ? '#E8622A'
                                    : (dark ? 'rgba(20,15,10,0.75)' : 'rgba(255,255,255,0.8)'),
                            }}
                          />
                          <span className="relative z-10">{d}</span>
                        </span>
                        
                        <span className="text-[7px] text-gold/70 dark:text-gold/45" title={hindu.tithiFull}>
                          {hindu.moonSymbol}{hindu.tithiNum}
                        </span>
                      </div>

                      {/* Cell Bottom: Habits dots & status icon */}
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex flex-wrap gap-[2px] justify-start max-w-[70%]">
                          {habits.slice(0, 5).map(h => {
                            const done = !!dayDone[h.id]
                            return (
                              <span
                                key={h.id}
                                className="w-[4px] h-[4px] rounded-full"
                                style={{
                                  backgroundColor: done ? h.color : (dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                                  boxShadow: done ? `0 0 5px ${h.color}` : 'none',
                                }}
                              />
                            )
                          })}
                        </div>
                        {hasProgress && !isFuture && (
                          <span 
                            className="text-[9px] leading-none select-none filter drop-shadow-[0_0_2px_rgba(201,168,76,0.3)] animate-pulse"
                            title={isPerfect ? `Perfect day. ${runLength} day run.` : `${completionPct}% complete`}
                          >
                            {isPerfect ? '🔥' : '✦'}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* INTEGRATED LUNAR SCIENCE CAROUSEL */}
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.12)} 
              style={{
                background: dark ? 'rgba(20, 15, 10, 0.45)' : 'rgba(255, 252, 246, 0.65)',
                border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid rgba(201, 168, 76, 0.22)',
                borderRadius: '24px',
                padding: '1.25rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                minHeight: '310px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: dark
                    ? 'radial-gradient(circle at 85% 12%, rgba(129,140,248,0.12), transparent 34%), radial-gradient(circle at 10% 88%, rgba(232,98,42,0.10), transparent 38%)'
                    : 'radial-gradient(circle at 85% 12%, rgba(201,168,76,0.18), transparent 34%), radial-gradient(circle at 10% 88%, rgba(232,98,42,0.10), transparent 38%)',
                }}
              />
              <div className="flex items-center justify-between border-b border-gold/10 pb-2 mb-3">
                <h3 className="font-display text-xs text-gold flex items-center gap-1.5 uppercase font-bold tracking-wider">
                  <Sparkles size={12} /> Mind-Blowing Moon Facts
                </h3>
                <span className="text-[9px] text-ink-soft/40 dark:text-ivory/40">
                  {currentInsightIdx + 1} / {scientificInsights.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInsightIdx}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col gap-3 py-1 relative z-10"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 16,
                        background: dark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(201,168,76,0.22)',
                        boxShadow: '0 0 22px rgba(201,168,76,0.12)',
                      }}
                    >
                      <span className="text-2xl">{currentInsight.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-flex text-[8px] uppercase tracking-[0.18em] text-saffron font-bold mb-1">
                        {currentInsight.stat}
                      </span>
                      <h4 style={{
                        fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.3,
                        color: dark ? '#fcf6e8' : '#3d2e1a', margin: 0,
                      }}>
                        {currentInsight.title}
                      </h4>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '11px', lineHeight: 1.6, fontWeight: 300, fontFamily: "'Playfair Display', serif",
                    color: dark ? 'rgba(252,246,232,0.68)' : 'rgba(61,45,26,0.7)',
                  }}>
                    {currentInsight.desc}
                  </p>

                  <div
                    style={{
                      borderRadius: 16,
                      padding: '10px 12px',
                      background: dark ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.48)',
                      border: '1px solid rgba(201,168,76,0.14)',
                    }}
                  >
                    <p className="text-[10px] leading-relaxed m-0" style={{ color: dark ? '#ffeab8' : '#704615' }}>
                      <strong>Why it slaps:</strong> {currentInsight.vibe}
                    </p>
                    <p className="text-[10px] leading-relaxed m-0 mt-1" style={{ color: dark ? 'rgba(252,246,232,0.62)' : 'rgba(61,37,13,0.72)' }}>
                      <strong>Try this:</strong> {currentInsight.tryThis}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                <div className="flex gap-1.5">
                  {scientificInsights.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentInsightIdx(i)}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: i === currentInsightIdx ? 18 : 6,
                        background: i === currentInsightIdx ? '#C9933A' : (dark ? 'rgba(255,255,255,0.16)' : 'rgba(92,61,30,0.18)'),
                      }}
                      aria-label={`Open lunar insight ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentInsightIdx(prev => (prev - 1 + scientificInsights.length) % scientificInsights.length)}
                    className="p-1 rounded-md border border-gold/15 bg-white/[0.02] hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronLeft size={11} />
                  </button>
                  <button
                    onClick={() => setCurrentInsightIdx(prev => (prev + 1) % scientificInsights.length)}
                    className="p-1 rounded-md border border-gold/15 bg-white/[0.02] hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </PageLayout>
  )
}
