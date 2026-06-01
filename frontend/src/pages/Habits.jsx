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
import WaterWidget from '../components/tracker/WaterWidget'
import DailyTasksWidget from '../components/tracker/DailyTasksWidget'
import habitsBg from '../assets/pages/habits_bg.webp'
import lotusImg from '../assets/dashboard/lotus.png'
import { getHinduDetails, getScientificInsights } from '../utils/hinduCalendar'
import { fmtDate } from '../utils'
import DiyaLamp from '../icons/DiyaLamp'

const ICONS = ['🏃','🧘','💧','📖','🌿','🍎','🏋️','✍️','🎨','🎵','🌅','🚴','🧠','💊','🥗','🛌','🧹','🌸','☀️','🦋','🎯','🏊','🍵','🛁','🌙','💪','📝','🌱','🦷','🕉️','🙏','🪷','🔥','⭐','📚','🎧']
const HABIT_COLORS = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE','#1A8A7A','#E86060']

const RITUAL_IDEAS = [
  { category: '🧘 Popular Rituals', items: [
    { name: 'Surya Namaskar', icon: '🧘' },
    { name: 'Meditation', icon: '🌿' },
    { name: 'Studies / Focus', icon: '📚' },
    { name: 'Hydration', icon: '💧' },
    { name: 'Journaling', icon: '✍️' },
    { name: 'Reading', icon: '📖' },
  ]}
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

function getLunarSubtitle(hindu) {
  if (!hindu) return '';
  const isShukla = hindu.paksha && hindu.paksha.includes('Shukla');
  const pakshaStr = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
  
  let tithiStr = '';
  if (hindu.tithiNum === 15) {
    tithiStr = isShukla ? 'Purnima' : 'Amavasya';
  } else {
    tithiStr = `Tithi ${hindu.tithiNum}`;
  }
  
  let phaseStr = '';
  if (isShukla) {
    if (hindu.tithiNum === 15) {
      phaseStr = 'Full Moon';
    } else if (hindu.tithiNum >= 11) {
      phaseStr = 'Purnima approaching';
    } else {
      phaseStr = 'Waxing';
    }
  } else {
    if (hindu.tithiNum === 15) {
      phaseStr = 'New Moon';
    } else if (hindu.tithiNum >= 11) {
      phaseStr = 'Amavasya approaching';
    } else {
      phaseStr = 'Waning';
    }
  }
  
  return `${pakshaStr} · ${tithiStr} · ${phaseStr}`;
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
  const [cycleLength, setCycleLength] = useState(7)
  const [relaxDay, setRelaxDay] = useState('Sunday')
  const [calDate, setCalDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Selected Day on monthly calendar (defaults to today's date)
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())

  const todayStr = new Date().toISOString().slice(0, 10)
  const td = todayStr
  const todayDone = habitDone[td] || {}
  const doneCount = habits.filter(h => todayDone[h.id]).length

  // Lunar Facts Carousel State
  const [currentInsightIdx, setCurrentInsightIdx] = useState(0)

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color: selColor, cycleLength, relaxDay, streakFreezes: 3 })
    setName('')
    setIcon(ICONS[0])
    setSelColor(HABIT_COLORS[0])
    setCycleLength(7)
    setRelaxDay('Sunday')
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
        position: 'relative', zIndex: 1, maxWidth: '1650px', width: '96%', margin: '0 auto', padding: '4.5rem 1.2rem 4rem'
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

        {/* FORGIVING CYCLES FULL-WIDTH BANNER */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp(0.02)}
          className="w-full p-2.5 px-4 mb-4 rounded-xl text-xs border flex items-center justify-center gap-2"
          style={{
            background: dark ? 'rgba(20,15,10,0.3)' : '#fdf6ec',
            borderColor: dark ? 'rgba(201,168,76,0.15)' : '#e8d5b0',
            color: dark ? '#fcf6e8' : '#2c1a00',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span>🌙</span>
          <p className="m-0 text-center">
            Forgiving Cycles — Miss 1 day? It's your <strong className="font-semibold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>Relax Day</strong>. Miss 2? The cycle resets gently. Be gentle with yourself.
          </p>
        </motion.div>

        {/* BENTO BOX LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          
          {/* LEFT PANEL: ACTIONS */}
          <div className="flex flex-col gap-5 w-full">
            
            {/* MY SADHANA RITUALS CARD */}
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.08)} 
              style={{
                background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
                border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
                borderRadius: '24px',
                padding: '1.25rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3 border-b border-gold/10 pb-2">
                <span 
                  className="font-display text-xs flex items-center gap-1.5 uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border" 
                  style={{ 
                    color: dark ? '#ff9e7a' : '#E8622A',
                    backgroundColor: dark ? 'rgba(232, 98, 42, 0.15)' : 'rgba(232, 98, 42, 0.1)',
                    borderColor: dark ? 'rgba(232, 98, 42, 0.3)' : 'rgba(232, 98, 42, 0.25)',
                  }}
                >
                  🕯️ My Active Sadhanas
                </span>
                <button
                  onClick={() => setShowAddForm(prev => !prev)}
                  className="text-[10px] text-gold border border-gold/30 hover:bg-gold/15 py-1 px-3 rounded-full transition-all font-semibold"
                  style={{ color: dark ? '#ffeab8' : '#8B6914', borderColor: dark ? 'rgba(201,168,76,0.3)' : 'rgba(139,105,20,0.3)' }}
                >
                  Add ritual
                </button>
              </div>

              <p className="text-[10.5px] italic mt-0 mb-3 opacity-80 leading-relaxed font-sans" style={{ color: dark ? '#ffb394' : '#C44E1C' }}>
                Tapas (discipline) is a warm, steady fire. Just take one small step today.
              </p>

              {/* Today's Streak Mini-Bar */}
              <div 
                className="flex items-center justify-between gap-4 px-3 py-2 rounded-xl mb-3"
                style={{
                  background: dark ? 'rgba(201, 168, 76, 0.03)' : 'rgba(200, 169, 110, 0.03)',
                  border: dark ? '1px solid rgba(201, 168, 76, 0.08)' : '1px solid #e8d5b0',
                }}
              >
                <div className="flex items-center gap-2">
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
                      width: '28px',
                      height: '28px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 6px rgba(232, 98, 42, 0.15))'
                    }}
                  />
                  <span className="font-display text-2xl font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>{bestStreak}</span>
                  <span className="text-[9px] uppercase tracking-wider text-ink-soft/60 dark:text-ivory/60 leading-none">day streak</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 justify-end">
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-[3px] w-4 rounded-full`}
                        style={{
                          backgroundColor: idx < (bestStreak % 8 || (bestStreak > 0 ? 7 : 0))
                            ? '#C9933A'
                            : (dark ? 'rgba(255,255,255,0.08)' : '#e8d5b0')
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-ink-soft/40 dark:text-ivory/40 italic whitespace-nowrap hidden sm:inline">
                    Every streak starts somewhere
                  </span>
                </div>
              </div>

              {/* DAILY QUEST CHEST ANIMATION */}
              <AnimatePresence>
                {allDoneToday && selectedIso === todayStr && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-600/20 via-gold/10 to-saffron/20 p-4 rounded-2xl border border-gold/30 mb-3 overflow-hidden relative"
                  >
                    <div className="text-3xl relative z-10 mb-1">🏺</div>
                    <h3 className="text-xs font-bold text-[#c9933a] tracking-widest uppercase font-display">
                      Ancient Vessel Unlocked
                    </h3>
                    <span className="text-[10px] text-ink dark:text-white mt-1">+10 Prana Earned</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rituals list items */}
              <div className="flex flex-col gap-1.5">
                {habits.length === 0 ? (
                  <p className="text-[11px] text-ink-soft/40 dark:text-ivory/40 italic text-center py-4">No rituals added yet.</p>
                ) : (
                  habits.map((h) => {
                    const done = !!selectedDayDone[h.id]
                    const streak = getStreak(h.id)
                    const isPastOrToday = selectedIso <= todayStr

                    return (
                      <motion.div
                        key={h.id}
                        whileHover={{ scale: 1.005 }}
                        onClick={() => { if (isPastOrToday) handleToggleHabit(h.id, selectedIso) }}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all`}
                        style={{
                          background: done 
                            ? (dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(200, 169, 110, 0.08)')
                            : (dark ? 'rgba(255,255,255,0.02)' : '#fff8f0'),
                          borderColor: done 
                            ? 'rgba(201, 168, 76, 0.35)' 
                            : (dark ? 'rgba(255,255,255,0.05)' : '#e8d5b0'),
                          opacity: isPastOrToday ? 1 : 0.4,
                        }}
                      >
                        {/* Checkbox circle with colored dot */}
                        <div className="relative shrink-0 w-6 h-6 flex items-center justify-center">
                          <div 
                            className="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                            style={{
                              borderColor: done ? h.color : (dark ? 'rgba(255,255,255,0.2)' : '#e8d5b0'),
                              background: done ? `${h.color}22` : 'transparent',
                            }}
                          >
                            <div 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ 
                                backgroundColor: h.color,
                                opacity: done ? 1 : 0.4,
                              }} 
                            />
                          </div>
                        </div>
                        <span className="text-sm shrink-0">{h.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-display font-medium text-ink dark:text-ivory/95 truncate" style={{ color: dark ? '#fcf6e8' : '#2c1a00' }}>
                            {h.name}
                          </div>
                          <div className="text-[9px] text-ink-soft/50 dark:text-ivory/40">
                            {h.relaxDay ? (h.relaxDay !== 'None' ? `${h.relaxDay} relax day` : `${h.cycleLength} day cycle`) : `${h.cycleLength} day cycle`}
                          </div>
                        </div>
                        
                        {/* Streak number */}
                        <div className="flex items-center gap-1.5">
                          {streak > 0 && (
                            <motion.img
                              src={lotusImg}
                              alt="Streak Lotus"
                              initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              whileHover={{ scale: 1.25, rotate: 10 }}
                              transition={{
                                type: 'spring',
                                stiffness: 180,
                                damping: 12
                              }}
                              style={{
                                width: '15px',
                                height: '15px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 1px 3px rgba(200, 169, 110, 0.2))'
                              }}
                            />
                          )}
                          <span className="text-[10px] font-bold text-[#8B6914] dark:text-[#ffeab8]">{streak}</span>
                        </div>

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

              {/* INLINE ADD FORM */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      background: dark ? 'rgba(20, 15, 10, 0.25)' : '#fffaf3',
                      border: dark ? '1px solid rgba(201, 168, 76, 0.15)' : '1px solid #e8d5b0',
                      borderRadius: '16px',
                      padding: '1rem',
                      overflow: 'hidden',
                    }}
                    className="flex flex-col gap-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                      <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-[#8B6914] dark:text-[#e8d5b5]">
                        New Sadhana
                      </span>
                      <button 
                        onClick={() => setShowAddForm(false)} 
                        className="text-gold hover:text-rose-400 font-bold text-xs"
                      >
                        ×
                      </button>
                    </div>

                    {/* Inputs */}
                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Name</label>
                      <input
                        type="text"
                        value={name}
                        placeholder="e.g. Surya Namaskar, Meditation..."
                        maxLength={35}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-3 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Color Accent</label>
                      <div className="flex gap-1.5 flex-wrap py-0.5">
                        {HABIT_COLORS.map(c => (
                          <button
                            key={c}
                            onClick={() => setSelColor(c)}
                            className="w-5 h-5 rounded-full border transition-all"
                            style={{
                              backgroundColor: c,
                              borderColor: selColor === c ? (dark ? '#fff' : '#2c1a00') : 'transparent',
                              transform: selColor === c ? 'scale(1.1)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Cycle Length</label>
                        <select 
                          value={cycleLength}
                          onChange={(e) => setCycleLength(Number(e.target.value))}
                          className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-2 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold"
                        >
                          <option value={7}>7 Days (Weekly)</option>
                          <option value={15}>15 Days (Paksha)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Relax Day</label>
                        <select 
                          value={relaxDay}
                          onChange={(e) => setRelaxDay(e.target.value)}
                          className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-2 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold"
                        >
                          <option value="None">None</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1.5">✨ Pick a Suggested Ritual</label>
                      <div className="flex flex-wrap gap-1 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl max-h-[80px] overflow-y-auto">
                        {RITUAL_IDEAS[0].items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => { setName(item.name); setIcon(item.icon) }}
                            className="text-[9px] px-2 py-0.5 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 bg-white/[0.02] text-ink dark:text-ivory/80 transition-all whitespace-nowrap"
                          >
                            {item.icon} {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Choose Icon</label>
                      <div className="flex flex-wrap gap-1 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl max-h-[55px] overflow-y-auto">
                        {ICONS.map(ic => (
                          <button
                            key={ic}
                            onClick={() => setIcon(ic)}
                            className={`w-5.5 h-5.5 rounded flex items-center justify-center text-xs transition-all ${
                              ic === icon ? 'bg-gold/20 scale-110' : 'bg-transparent hover:bg-white/5'
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
                      className="w-full py-2 bg-gradient-to-r from-saffron to-gold text-white font-semibold text-xs tracking-wider rounded-xl disabled:opacity-30 transition-all hover:shadow-md active:scale-98"
                    >
                      Add to my sadhanas
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* WATER TRACKER WIDGET (Promoted up!) */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.12)}>
              <WaterWidget />
            </motion.div>

            {/* DAILY TASKS WIDGET */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.14)}>
              <DailyTasksWidget selectedIso={selectedIso} />
            </motion.div>
          </div>

          {/* RIGHT PANEL: CONTEXT ONLY */}
          <div className="flex flex-col gap-5 w-full lg:max-w-[320px] lg:ml-auto">
            
            {/* TODAY'S DATE + TITHI BLOCK & CALENDAR (Merged into one compact card) */}
            <motion.div
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.04)} 
              style={{
                background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
                border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
                borderRadius: '24px',
                padding: '0.85rem 1rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
              }}
              className="flex flex-col gap-2.5"
            >
              {/* Date Header */}
              <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
                <div>
                  <h2 className="font-display text-xs font-semibold flex items-center gap-1.5" style={{ color: dark ? '#ffeab8' : '#8B6914', margin: 0 }}>
                    {new Date(selectedIso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    <span className="text-gold/80">{selectedHindu.moonSymbol}</span>
                  </h2>
                  <p className="text-[9px] font-medium mt-0.5 mb-0" style={{ color: dark ? '#c8a96e' : '#8B6914' }}>
                    {getLunarSubtitle(selectedHindu)}
                  </p>
                </div>
                {/* Navigation arrows for Month */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronLeft size={10} />
                  </button>
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronRight size={10} />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1 border-b border-gold/10 pb-2 text-center max-w-[280px] mx-auto w-full">
                {[
                  { label: 'Active days', value: monthStats.activeDays },
                  { label: 'Perfect days', value: monthStats.perfectDays },
                  { label: 'Ritual sparks', value: monthStats.totalDone },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="py-0.5 px-1"
                    style={{
                      background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.3)',
                      border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid #e8d5b0',
                      borderRadius: '8px',
                    }}
                  >
                    <div className="font-display text-xs font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914', lineHeight: 1.1 }}>
                      {stat.value}
                    </div>
                    <div className="text-[7px] uppercase tracking-wider text-gold/60">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 7-Column Calendar Grid */}
              <div className="max-w-[280px] mx-auto w-full">
                <div className="grid grid-cols-7 gap-1 text-center font-display text-[8px] font-bold text-gold/40 uppercase tracking-wider mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 justify-items-center">
                  {/* Pre-offset blank days */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-7 h-7" />
                  ))}

                  {/* Days of the month */}
                  {dayNums.map(d => {
                    const iso = isoForDay(d)
                    const isToday = iso === todayStr
                    const isSelected = selectedDay === d
                    const dayDone = habitDone[iso] || {}
                    const doneOnDayCount = habits.filter(h => dayDone[h.id]).length
                    const isFuture = iso > todayStr
                    const hasHabits = habits.length > 0
                    const isPerfect = hasHabits && doneOnDayCount === habits.length
                    const isPartial = hasHabits && doneOnDayCount > 0 && doneOnDayCount < habits.length
                    const hasProgress = isPerfect || isPartial
                    const completionPct = hasHabits ? Math.round((doneOnDayCount / habits.length) * 100) : 0

                    let cellBg = 'transparent'
                    let textStyle = { color: dark ? '#fcf6e8' : '#2c1a00' }
                    
                    if (hasProgress && !isFuture) {
                      if (completionPct <= 30) {
                        cellBg = dark ? '#0e4429' : '#9be9a8';
                        textStyle = { color: dark ? '#85e89d' : '#1b5e20' };
                      } else if (completionPct <= 60) {
                        cellBg = dark ? '#006d32' : '#40c463';
                        textStyle = { color: '#ffffff' };
                      } else if (completionPct < 100) {
                        cellBg = dark ? '#26a641' : '#30a14e';
                        textStyle = { color: '#ffffff' };
                      } else if (completionPct === 100) {
                        cellBg = dark ? '#39d353' : '#216e39';
                        textStyle = { color: dark ? '#0e4429' : '#ffffff' };
                      }
                    }

                    let cellBorder = 'transparent'
                    let borderThickness = '1px'
                    if (isToday) {
                      cellBorder = dark ? 'rgba(201,168,76,0.5)' : '#e8d5b0';
                      if (cellBg === 'transparent') {
                        cellBg = dark ? 'rgba(201,168,76,0.1)' : 'rgba(200,169,110,0.1)';
                      }
                    }
                    if (isSelected) {
                      cellBorder = dark ? '#ffeab8' : '#8B6914';
                      borderThickness = '2px';
                      if (cellBg === 'transparent') {
                        cellBg = dark ? 'rgba(201,168,76,0.25)' : 'rgba(200, 169, 110, 0.2)';
                      }
                    }

                    return (
                       <motion.div
                         key={d}
                         whileHover={{ scale: 1.05 }}
                         onClick={() => setSelectedDay(d)}
                         className="rounded-full cursor-pointer flex flex-col items-center justify-center w-7 h-7 relative text-[9px] transition-all"
                         style={{
                           background: cellBg,
                           border: cellBorder !== 'transparent' ? `${borderThickness} solid ${cellBorder}` : 'none',
                           opacity: isFuture ? 0.35 : 1,
                         }}
                       >
                         <span className="font-semibold" style={textStyle}>
                           {d}
                         </span>
                         {/* Dot under number */}
                         {hasProgress && !isFuture && !isSelected && (
                           <span 
                             className="w-0.5 h-0.5 rounded-full absolute bottom-1" 
                             style={{ backgroundColor: isPerfect ? (dark ? '#39d353' : '#216e39') : '#c9933a' }} 
                           />
                         )}
                       </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* INTEGRATED LUNAR SCIENCE CAROUSEL (Custom dark themed Fact card) */}
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={fadeUp(0.12)} 
              style={{
                background: '#1c1208',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                borderRadius: '20px',
                padding: '0.85rem 1rem',
                minHeight: '210px',
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
                  background: 'radial-gradient(circle at 85% 12%, rgba(201,168,76,0.18), transparent 34%), radial-gradient(circle at 10% 88%, rgba(232,98,42,0.10), transparent 38%)',
                }}
              />
              <div className="flex items-center justify-between border-b border-[#c8a96e]/20 pb-1.5 mb-2">
                <h3 className="font-display text-[10px] text-gold flex items-center gap-1.5 uppercase font-bold tracking-wider" style={{ color: '#c8a96e', margin: 0 }}>
                  <Sparkles size={11} /> Mind-blowing moon fact
                </h3>
                <span className="text-[8px] text-[#c8a96e]/40">
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
                  className="flex-1 flex flex-col gap-2 py-0.5 relative z-10"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(201,168,76,0.25)',
                        boxShadow: '0 0 12px rgba(201,168,76,0.15)',
                      }}
                    >
                      <span className="text-base">{currentInsight.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="inline-flex text-[7px] uppercase tracking-[0.18em] text-[#c8a96e]/60 font-bold mb-0">
                        {currentInsight.stat}
                      </span>
                      <h4 style={{
                        fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2,
                        color: '#fdf6ec', margin: 0,
                      }}>
                        {currentInsight.title}
                      </h4>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '10px', lineHeight: 1.4, fontWeight: 300, fontFamily: "'Lora', serif",
                    color: '#c8a96e88', margin: '4px 0 0'
                  }}>
                    {currentInsight.desc}
                  </p>

                  <div
                    style={{
                      borderRadius: 12,
                      padding: '6px 10px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      marginTop: '4px'
                    }}
                  >
                    <p className="text-[9px] leading-relaxed m-0" style={{ color: '#c8a96e' }}>
                      <strong>Why it slaps:</strong> "{currentInsight.vibe}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#c8a96e]/10">
                <div className="flex gap-1">
                  {scientificInsights.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentInsightIdx(i)}
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: i === currentInsightIdx ? 12 : 4,
                        background: i === currentInsightIdx ? '#C9933A' : 'rgba(200,169,110,0.2)',
                      }}
                      aria-label={`Open lunar insight ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentInsightIdx(prev => (prev - 1 + scientificInsights.length) % scientificInsights.length)}
                    className="p-0.5 rounded border border-[#c8a96e]/20 bg-white/[0.02] hover:bg-[#c8a96e]/10 text-[#c8a96e] transition-all"
                  >
                    <ChevronLeft size={10} />
                  </button>
                  <button
                    onClick={() => setCurrentInsightIdx(prev => (prev + 1) % scientificInsights.length)}
                    className="p-0.5 rounded border border-[#c8a96e]/20 bg-white/[0.02] hover:bg-[#c8a96e]/10 text-[#c8a96e] transition-all"
                  >
                    <ChevronRight size={10} />
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
