import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, Sparkles, Flame, Check, X } from 'lucide-react'
import { useWellness } from '../context/WellnessContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import PageLayout from '../components/PageLayout'
import habitsBg from '../assets/pages/habits_bg.png'

const ICONS = ['🏃','🧘','💧','📖','🌿','🍎','🏋️','✍️','🎨','🎵','🌅','🚴','🧠','💊','🥗','🛌','🧹','🌸','☀️','🦋','🎯','🏊','🍵','🛁','🌙','💪','📝','🌱','🦷','🕉️','🙏','🪷','🔥','⭐','📚','🎧']
const HABIT_COLORS = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE','#1A8A7A','#E86060']

function fadeUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  }
}

function fadeIn(delay = 0) {
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, delay } },
  }
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
}

const cardVariants = (delay, darkHover = false) => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } },
  hover: {
    y: -3,
    boxShadow: darkHover ? '0 8px 32px rgba(0,0,0,0.35)' : '0 8px 32px rgba(92,61,30,0.10)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
})

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const duration = 500
    const start = performance.now()
    let frame
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(t * value))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return display
}

function GlassCard({ children, delay = 0, glowColor = 'rgba(201,168,76,0.15)' }) {
  return (
    <motion.div
      variants={cardVariants(delay)} initial="hidden" animate="show" whileHover="hover"
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '1.25rem 1.25rem',
        background: 'linear-gradient(160deg, rgba(252,245,228,0.92) 0%, rgba(250,238,215,0.9) 50%, rgba(248,232,205,0.88) 100%)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1.5px solid rgba(201,168,76,0.35)',
        overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', top: 0, left: '25%', right: '25%', height: 1.5,
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
      }} />
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: 60,
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      {children}
    </motion.div>
  )
}

function DarkGlassCard({ children, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants(delay, true)} initial="hidden" animate="show" whileHover="hover"
      style={{
        position: 'relative',
        borderRadius: '16px',
        padding: '1.25rem 1.25rem',
        background: 'linear-gradient(160deg, rgba(40,28,14,0.88) 0%, rgba(45,32,16,0.85) 50%, rgba(50,35,18,0.82) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(201,168,76,0.2)',
        overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', top: 0, left: '25%', right: '25%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
      }} />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: 50,
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      {children}
    </motion.div>
  )
}

function HabitCheckbox({ done, color, size = 22 }) {
  return (
    <motion.div
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.1 }}
      style={{
        width: size, height: size, borderRadius: '6px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: done ? 'none' : `1.5px solid rgba(168,140,80,0.3)`,
        background: done ? `linear-gradient(135deg, ${color}, ${color}dd)` : 'transparent',
        boxShadow: done ? `0 2px 10px ${color}55` : 'none',
      }}>
      <AnimatePresence mode="wait">
        {done && (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 120 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <Check size={size * 0.55} color="#fff" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StreakFlame({ streak, size = 14 }) {
  if (streak <= 0) return null
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        fontSize: '0.6rem', fontWeight: 700, color: '#C9A84C',
        whiteSpace: 'nowrap',
      }}>
      <motion.span
        animate={{ scale: [1, 1.25, 1], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'inline-flex' }}>
        <Flame size={size} fill="#C9A84C" stroke="#C9A84C" />
      </motion.span>
      {streak}
    </motion.span>
  )
}

function SectionEyebrow({ children }) {
  return (
    <p style={{
      fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.2em',
      color: '#C9933A', textTransform: 'uppercase', margin: '0 0 0.55rem',
      opacity: 0.85,
    }}>
      {'\u2726'} {children}
    </p>
  )
}

function ShimmerBar({ pct, color, glowColor }) {
  return (
    <div style={{
      height: 4, borderRadius: 2,
      background: 'rgba(168,140,80,0.1)',
      overflow: 'hidden', position: 'relative',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 8px ${glowColor}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }} />
      </motion.div>
    </div>
  )
}

export default function Habits() {
  const { habits, addHabit, deleteHabit, habitDone, toggleHabit, getStreak } = useWellness()
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [selColor, setSelColor] = useState(HABIT_COLORS[0])
  const [calDate, setCalDate] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const Card = dark ? DarkGlassCard : GlassCard

  const today = () => new Date().toISOString().slice(0, 10)
  const td = today()
  const todayDone = habitDone[td] || {}
  const doneCount = habits.filter(h => todayDone[h.id]).length

  const handleAdd = () => {
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color: selColor })
    setName('')
    setIcon(ICONS[0])
    setSelColor(HABIT_COLORS[0])
    setShowAddForm(false)
  }

  const handleToggleHabit = (id, dateKey = td) => {
    const alreadyDone = !!(habitDone[dateKey] || {})[id]
    toggleHabit(id, dateKey)
    if (!alreadyDone) playHabitSound()
  }

  const handleDeleteHabit = (e, id) => {
    e.stopPropagation()
    deleteHabit(id)
  }

  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const todayStr = new Date().toISOString().slice(0, 10)
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isoForDay = (d) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const weekday = (d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(isoForDay(d)).getDay()]

  const habitGoal = (h) => {
    const created = new Date(h.createdAt || todayStr)
    const firstDay = new Date(calYear, calMonth, 1)
    const lastDay = new Date(calYear, calMonth + 1, 0)
    const start = created > firstDay ? created : firstDay
    return Math.max(1, Math.round((lastDay - start) / 86400000) + 1)
  }

  const habitAchieved = (h) =>
    dayNums.filter(d => (habitDone[isoForDay(d)] || {})[h.id]).length

  const bestStreak = Math.max(0, ...habits.map(h => getStreak(h.id)))
  const allDoneToday = habits.length > 0 && doneCount === habits.length
  const pctToday = habits.length ? Math.round(doneCount / habits.length * 100) : 0

  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()

  return (
    <PageLayout>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${habitsBg}) center/cover no-repeat fixed`,
        filter: dark ? 'brightness(0.4) saturate(1.0)' : 'brightness(0.8) saturate(1.1)',
        opacity: dark ? 0.85 : 0.7,
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: dark
          ? 'radial-gradient(ellipse at 40% 50%, rgba(27,79,168,0.08) 0%, rgba(25,18,8,0.78) 40%, rgba(5,3,1,0.92) 100%)'
          : 'radial-gradient(ellipse at 40% 50%, rgba(27,79,168,0.04) 0%, rgba(248,238,218,0.2) 40%, rgba(240,225,195,0.45) 100%)',
      }} />
      <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', maxWidth: 700, height: 300,
          background: dark
            ? 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE'].map((c, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: `${8 + i * 15}%`,
              left: `${2 + (i * 13) % 90}%`,
              fontSize: '0.6rem',
              color: dark ? `${c}18` : `${c}22`,
            }}
            animate={{ y: [0, -16, 0], opacity: [0.1, 0.45, 0.1], rotate: [0, 12, -12, 0] }}
            transition={{ duration: 7 + i * 0.8, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          >◈</motion.div>
        ))}
        {[...Array(5)].map((_, i) => {
          const colors = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8']
          return (
            <motion.div
              key={`sparkle-${i}`}
              style={{
                position: 'absolute',
                bottom: `${10 + i * 18}%`,
                right: `${3 + (i * 17) % 85}%`,
              }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.3, 1.2, 0.3], rotate: [0, 180, 360] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
            >
              <Sparkles size={11} color={dark ? `${colors[i]}22` : `${colors[i]}30`} />
            </motion.div>
          )
        })}
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '4.5rem 1.5rem 4rem' }}>

        {/* ── HERO ── */}
        <motion.div variants={fadeUp(0)} initial="hidden" animate="show" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
            <span style={{
              fontSize: '1.4rem', display: 'inline-block',
              filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.15))',
              opacity: 0.55,
            }}>🪷</span>
          </motion.div>
          <motion.p variants={fadeIn(0.1)} style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.3em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.35rem',
            opacity: 0.8,
          }}>
            {'\u2726'} Build consistency {'\u2726'}
          </motion.p>
          <motion.h1 variants={fadeIn(0.15)} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.6rem, 6vw, 3.8rem)',
            fontWeight: 400, color: '#2D1F0E', lineHeight: 1.08,
            margin: '0 auto 0.35rem', maxWidth: 600,
            letterSpacing: '-0.02em',
          }}>
            Rituals
          </motion.h1>
          <motion.p variants={fadeIn(0.2)} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem', color: '#8A6E4E', fontWeight: 400,
            margin: '0 auto', maxWidth: 440, lineHeight: 1.5,
          }}>
            "Small daily disciplines, sustained with devotion, create the extraordinary life."
          </motion.p>
        </motion.div>

        <motion.div variants={fadeUp(0.04)} initial="hidden" animate="show"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '0 auto 1.8rem', maxWidth: 480,
          }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '0.6rem', color: '#C9933A', opacity: 0.5, fontFamily: "'Cinzel', serif" }}>
            ✦
          </motion.span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '1.5rem',
          alignItems: 'start',
        }}>

          {/* ═══ LEFT COLUMN ═══ */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ── WISDOM CARD ── */}
            <Card delay={0.06} glowColor="rgba(201,168,76,0.2)">
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 28, height: 1, margin: '0 auto 0.7rem',
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
                }} />
                <p style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.52rem',
                  letterSpacing: '0.22em', color: '#C9933A',
                  textTransform: 'uppercase', margin: '0 0 0.6rem',
                  opacity: 0.85,
                }}>
                  {'\u2726'} Wisdom of the day {'\u2726'}
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.1rem, 2.3vw, 1.3rem)',
                  fontWeight: 400, fontStyle: 'italic',
                  color: '#2D1F0E',
                  lineHeight: 1.65,
                  margin: '0 auto 0.35rem',
                  maxWidth: 480,
                }}>
                  "Consistency is not perfection — it is the quiet promise you keep to yourself."
                </p>
                <div style={{
                  width: 20, height: 1, margin: '0.5rem auto 0.35rem',
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)',
                }} />
                <p style={{
                  fontSize: '0.62rem', color: '#8A6E4E',
                  fontFamily: "'Lora', serif", fontStyle: 'italic',
                  margin: 0,
                }}>
                  — Ancient Proverb
                </p>
              </div>
            </Card>

            {/* ── ADD HABIT ── */}
            <motion.div variants={fadeUp(0.08)} initial="hidden" animate="show"
              whileHover={dark ? {} : { y: -2 }}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: dark
                  ? 'linear-gradient(160deg, rgba(45,32,18,0.88) 0%, rgba(50,36,20,0.85) 100%)'
                  : 'linear-gradient(160deg, rgba(252,245,228,0.92) 0%, rgba(250,238,215,0.9) 50%, rgba(248,232,205,0.88) 100%)',
                border: dark ? '1.5px solid rgba(201,168,76,0.18)' : '1.5px solid rgba(201,168,76,0.3)',
                boxShadow: dark ? '0 3px 16px rgba(0,0,0,0.2)' : '0 3px 16px rgba(92,61,30,0.06)',
              }}>
              <span style={{ position: 'absolute', top: 8, left: 10, fontSize: '0.5rem', color: '#C9933A', opacity: 0.15 }}>◈</span>
              <span style={{ position: 'absolute', top: 8, right: 10, fontSize: '0.5rem', color: '#D4607A', opacity: 0.15 }}>◈</span>
              <span style={{ position: 'absolute', bottom: 8, left: 10, fontSize: '0.5rem', color: '#D4607A', opacity: 0.15 }}>◈</span>
              <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: '0.5rem', color: '#C9933A', opacity: 0.15 }}>◈</span>
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
              }} />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 150, height: 50,
                  background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

              <div style={{ position: 'relative', zIndex: 1, padding: '1.1rem 1.25rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                  <p style={{
                    fontFamily: "'Cinzel', serif", fontSize: '0.52rem', letterSpacing: '0.2em',
                    color: '#C9933A', textTransform: 'uppercase', margin: 0, opacity: 0.85,
                  }}>
                    {'\u2726'} New Ritual
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ rotate: showAddForm ? 0 : 90 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                      width: 24, height: 24, borderRadius: '6px', border: 'none',
                      background: showAddForm ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: '#7A5F30', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Plus size={13} style={{ transform: showAddForm ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                  </motion.button>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: showAddForm ? '0.7rem' : 0,
                  padding: '0.5rem 0.65rem',
                  borderRadius: '10px',
                  background: dark ? 'rgba(20,14,6,0.4)' : 'rgba(255,248,234,0.5)',
                  border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.12)',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '7px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${selColor}33`,
                    fontSize: '0.95rem',
                    border: `1px solid ${selColor}55`,
                  }}>
                    {icon || ICONS[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '0.75rem', fontWeight: 500,
                      color: name ? '#2D1F0E' : '#8A6E4E',
                      margin: 0, fontStyle: name ? 'normal' : 'italic',
                      opacity: name ? 1 : 0.6,
                    }}>
                      {name || 'Name your ritual...'}
                    </p>
                    <span style={{
                      fontFamily: "'Lora', serif",
                      fontSize: '0.52rem', color: '#8A6E4E',
                      opacity: 0.55,
                    }}>
                      {showAddForm ? 'Fill in the details' : 'Tap + to customize'}
                    </span>
                  </div>
                  {!showAddForm && (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowAddForm(true)}
                      style={{
                        padding: '0.25rem 0.7rem', borderRadius: '7px',
                        border: '1px solid rgba(201,168,76,0.2)',
                        background: 'rgba(201,168,76,0.06)',
                        color: '#7A5F30',
                        fontSize: '0.52rem', fontFamily: "'Cinzel', serif",
                        cursor: 'pointer', letterSpacing: '0.05em',
                      }}>
                      Customize
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ marginBottom: '0.55rem' }}>
                        <label style={{
                          display: 'block', fontSize: '0.48rem', fontFamily: "'Cinzel', serif",
                          color: '#C9933A', letterSpacing: '0.15em', marginBottom: '0.25rem', opacity: 0.8,
                        }}>NAME</label>
                        <input style={{
                          width: '100%', padding: '0.5rem 0.7rem', borderRadius: '8px',
                          border: dark ? '1px solid rgba(201,168,76,0.12)' : '1px solid rgba(201,168,76,0.2)',
                          background: dark ? 'rgba(20,14,6,0.6)' : 'rgba(255,248,234,0.6)',
                          fontFamily: "'Lora', serif", fontSize: '0.7rem',
                          color: '#2D1F0E', outline: 'none',
                          boxSizing: 'border-box',
                        }}
                          type="text" value={name} placeholder="e.g. Morning walk by the river"
                          maxLength={50} onChange={e => setName(e.target.value)}
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                      </div>

                      <div style={{ marginBottom: '0.45rem' }}>
                        <label style={{
                          display: 'block', fontSize: '0.48rem', fontFamily: "'Cinzel', serif",
                          color: '#C9933A', letterSpacing: '0.15em', marginBottom: '0.25rem', opacity: 0.8,
                        }}>ACCENT</label>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {HABIT_COLORS.map(c => (
                            <motion.button
                              key={c}
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.15, y: -1 }}
                              onClick={() => setSelColor(c)}
                              style={{
                                width: 24, height: 24, borderRadius: '5px',
                                border: selColor === c ? '2px solid #2D1F0E' : '2px solid transparent',
                                background: c, cursor: 'pointer',
                                boxShadow: selColor === c
                                  ? `0 0 0 2px ${c}44, 0 2px 8px rgba(0,0,0,0.1)`
                                  : '0 1px 3px rgba(0,0,0,0.04)',
                              }}>
                              {selColor === c && (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={11} color={dark ? '#1a1208' : '#2D1F0E'} strokeWidth={2.5} />
                                </span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.55rem' }}>
                        <label style={{
                          display: 'block', fontSize: '0.48rem', fontFamily: "'Cinzel', serif",
                          color: '#C9933A', letterSpacing: '0.15em', marginBottom: '0.2rem', opacity: 0.8,
                        }}>ICON</label>
                        <div style={{
                          display: 'flex', flexWrap: 'wrap', gap: 2,
                          padding: '0.3rem', borderRadius: '8px',
                          background: dark ? 'rgba(20,14,6,0.4)' : 'rgba(255,248,234,0.4)',
                          maxHeight: 66, overflowY: 'auto',
                        }}>
                          {ICONS.map(ic => (
                            <motion.button key={ic} type="button" onClick={() => setIcon(ic)}
                              whileTap={{ scale: 0.8 }}
                              whileHover={{ scale: 1.2 }}
                              style={{
                                width: 26, height: 26, borderRadius: '5px', border: 'none',
                                fontSize: '0.7rem', cursor: 'pointer',
                                background: ic === icon ? `${selColor}44` : 'transparent',
                              }}>
                              {ic}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <motion.button onClick={handleAdd}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -2, boxShadow: `0 4px 16px ${selColor}55` }}
                        style={{
                          width: '100%', padding: '0.52rem 0', borderRadius: '8px', border: 'none',
                          background: `linear-gradient(135deg, ${selColor}, ${selColor}bb)`,
                          color: dark ? '#1a1208' : '#2D1F0E',
                          fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer',
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: '0.06em',
                          boxShadow: `0 2px 10px ${selColor}44`,
                        }}>
                        + Add {name.trim() || 'Ritual'}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── CALENDAR ── */}
            {habits.length > 0 ? (
              <motion.div variants={fadeUp(0.14)}>
                <Card glowColor="rgba(201,168,76,0.12)">
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '0.8rem',
                  }}>
                    <h2 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.05rem', fontWeight: 500,
                      color: '#2D1F0E', margin: 0,
                    }}>
                      {calDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.2rem' }}>
                      <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }}
                        onClick={() => { setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n }) }}
                        style={{
                          width: 26, height: 26, borderRadius: '6px',
                          border: '1px solid rgba(168,140,80,0.18)',
                          background: 'transparent', color: '#7A5F30', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><ChevronLeft size={13} /></motion.button>
                      <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }}
                        onClick={() => { setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n }) }}
                        style={{
                          width: 26, height: 26, borderRadius: '6px',
                          border: '1px solid rgba(168,140,80,0.18)',
                          background: 'transparent', color: '#7A5F30', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><ChevronRight size={13} /></motion.button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', minWidth: 650 }}>
                      <thead>
                        <tr>
                          <th style={{
                            textAlign: 'left', padding: '0.35rem 0.5rem', fontWeight: 600,
                            color: '#C9933A', fontSize: '0.52rem', letterSpacing: '0.04em', width: 115,
                            borderBottom: '1px solid rgba(201,168,76,0.15)', opacity: 0.85,
                          }}>Ritual</th>
                          {dayNums.map(d => {
                            const iso = isoForDay(d)
                            const isToday = iso === todayStr
                            return (
                              <th key={d} style={{
                                textAlign: 'center', padding: '0.2rem 0.06rem',
                                fontWeight: isToday ? 700 : 500,
                                color: isToday ? '#E8622A' : '#8A6E4E',
                                fontSize: '0.5rem', minWidth: 20,
                                borderBottom: isToday
                                  ? '2px solid #E8622A'
                                  : '1px solid rgba(168,140,80,0.08)',
                              }}>
                                <div>{weekday(d)}</div>
                                <div style={{
                                  fontSize: '0.58rem', marginTop: 0.5,
                                  fontWeight: isToday ? 700 : 500,
                                  color: isToday ? '#E8622A' : undefined,
                                }}>{d}</div>
                              </th>
                            )
                          })}
                          <th style={{
                            textAlign: 'center', padding: '0.35rem 0.15rem', fontWeight: 600,
                            color: '#C9933A', fontSize: '0.5rem', letterSpacing: '0.04em',
                            borderBottom: '1px solid rgba(201,168,76,0.15)', width: 32, opacity: 0.85,
                          }}>Goal</th>
                          <th style={{
                            textAlign: 'center', padding: '0.35rem 0.15rem', fontWeight: 600,
                            color: '#C9933A', fontSize: '0.5rem', letterSpacing: '0.04em',
                            borderBottom: '1px solid rgba(201,168,76,0.15)', width: 36, opacity: 0.85,
                          }}>Done</th>
                        </tr>
                      </thead>
                      <tbody>
                        {habits.map((h, idx) => {
                          const achieved = habitAchieved(h)
                          const goal = habitGoal(h)
                          const pctDone = Math.min(100, Math.round(achieved / goal * 100))
                          const isGreen = pctDone >= 100
                          const isYellow = pctDone >= 60 && !isGreen

                          return (
                            <motion.tr key={h.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.025 }}
                              style={{
                                borderBottom: '1px solid rgba(168,140,80,0.06)',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(168,140,80,0.04)' : 'rgba(168,140,80,0.04)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '0.38rem 0.5rem', maxWidth: 115 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
                                  <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>{h.icon}</span>
                                  <span style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '0.75rem', fontWeight: 500,
                                    color: '#2D1F0E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>{h.name}</span>
                                </div>
                              </td>
                              {dayNums.map((d, di) => {
                                const iso = isoForDay(d)
                                const done = !!(habitDone[iso] || {})[h.id]
                                const isToday = iso === todayStr
                                const isHovered = hoveredDay === di
                                return (
                                  <td key={d} style={{ textAlign: 'center', padding: '0.18rem 0' }}>
                                    <motion.button
                                      onClick={() => { if (iso <= todayStr) handleToggleHabit(h.id, iso) }}
                                      disabled={iso > todayStr}
                                      onMouseEnter={() => setHoveredDay(di)}
                                      onMouseLeave={() => setHoveredDay(null)}
                                      whileTap={iso <= todayStr ? { scale: 0.75 } : {}}
                                      whileHover={iso <= todayStr && !done ? { scale: 1.15 } : {}}
                                      style={{
                                        width: 18, height: 18, margin: '0 auto',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '4px',
                                        border: done
                                          ? 'none'
                                          : isToday
                                            ? '1.5px solid rgba(184,106,32,0.35)'
                                            : '1.5px solid rgba(168,140,80,0.14)',
                                        background: done
                                          ? h.color
                                          : isToday
                                            ? 'rgba(184,106,32,0.06)'
                                            : isHovered
                                              ? 'rgba(168,140,80,0.06)'
                                              : 'transparent',
                                        cursor: iso > todayStr ? 'not-allowed' : 'pointer',
                                        opacity: iso > todayStr ? 0.12 : 1,
                                        boxShadow: done ? `0 1px 4px ${h.color}44` : 'none',
                                      }}>
                                      {done && (
                                        <motion.span
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          style={{ fontSize: '0.42rem', color: '#fff', fontWeight: 700, lineHeight: 0 }}>
                                          ✓
                                        </motion.span>
                                      )}
                                    </motion.button>
                                  </td>
                                )
                              })}
                              <td style={{ textAlign: 'center', padding: '0.2rem', fontSize: '0.55rem', fontWeight: 600, color: '#8A6E4E' }}>{goal}</td>
                              <td style={{ textAlign: 'center', padding: '0.2rem' }}>
                                <motion.span layout style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 2,
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '3px', fontSize: '0.55rem', fontWeight: 700,
                                  background: isGreen ? 'rgba(58,140,76,0.12)' : isYellow ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.08)',
                                  color: isGreen ? '#2d6a4f' : isYellow ? '#7A5F30' : '#8A6E4E',
                                  lineHeight: '1.2',
                                }}>
                                  {achieved}
                                  {isGreen && <Check size={9} />}
                                </motion.span>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{
                    display: 'flex', gap: '0.8rem', marginTop: '0.6rem', paddingTop: '0.45rem',
                    borderTop: '1px solid rgba(168,140,80,0.08)',
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { color: '#2d6a4f', bg: 'rgba(58,140,76,0.12)', label: '100%' },
                      { color: '#7A5F30', bg: 'rgba(201,168,76,0.15)', label: '60%+' },
                      { color: '#8A6E4E', bg: 'rgba(201,168,76,0.08)', label: 'Ongoing' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.5rem', color: '#8A6E4E' }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: item.bg, border: `1px solid ${item.color}22` }} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              !showAddForm && (
                <motion.div variants={fadeUp(0.16)}>
                  <Card glowColor="rgba(201,168,76,0.08)">
                    <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                      <motion.div
                        animate={{ y: [0, -5, 0], rotate: [0, -2, 2, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ marginBottom: '0.7rem' }}>
                        <span style={{ fontSize: '2rem', opacity: 0.35, display: 'inline-block', filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.15))' }}>🪷</span>
                      </motion.div>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '0.95rem', color: '#7A5F30',
                        margin: '0 0 0.25rem',
                      }}>
                        No rituals yet
                      </p>
                      <p style={{
                        fontSize: '0.65rem', color: '#8A6E4E',
                        fontFamily: "'Lora', serif", fontStyle: 'italic',
                        margin: 0,
                      }}>
                        Tap "New Ritual" above to begin tracking your consistency.
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            )}
          </motion.div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* ── TODAY'S PROGRESS ── */}
            <Card delay={0.1} glowColor="rgba(201,168,76,0.15)">
              <SectionEyebrow>Today's Progress</SectionEyebrow>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}>
                <div>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.7rem', fontWeight: 500,
                    color: '#2D1F0E', lineHeight: 1,
                  }}>
                    <AnimatedNumber value={doneCount} />
                  </span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.95rem', color: '#8A6E4E', marginLeft: 2,
                  }}>/{habits.length}</span>
                </div>
                <motion.div
                  animate={allDoneToday ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{
                    padding: '0.25rem 0.7rem',
                    borderRadius: '20px',
                    background: allDoneToday ? 'rgba(26,122,78,0.12)' : 'rgba(232,98,42,0.1)',
                  }}>
                  <span style={{
                    fontSize: '0.52rem', fontWeight: 700,
                    color: allDoneToday ? '#1A7A4E' : '#E8622A',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.06em',
                  }}>
                    {allDoneToday ? '✦ Complete' : `${doneCount}/${habits.length}`}
                  </span>
                </motion.div>
              </div>
              <ShimmerBar
                pct={pctToday}
                color={allDoneToday ? '#1A7A4E' : '#E8622A'}
                glowColor={allDoneToday ? 'rgba(26,122,78,0.35)' : 'rgba(232,98,42,0.25)'}
              />
            </Card>

            {/* ── CHECK-IN ── */}
            <Card delay={0.14} glowColor="rgba(201,168,76,0.12)">
              <SectionEyebrow>Check-in</SectionEyebrow>

              {habits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '0.8rem 0' }}>
                  <p style={{ fontSize: '0.65rem', color: '#8A6E4E', fontFamily: "'Lora', serif", fontStyle: 'italic', margin: 0 }}>
                    No rituals yet.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
                  {habits.map((h, idx) => {
                    const done = !!todayDone[h.id]
                    const streak = getStreak(h.id)
                    return (
                      <motion.button key={h.id} onClick={() => handleToggleHabit(h.id)}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 9,
                          padding: '0.55rem 0.65rem', borderRadius: '10px',
                          border: '1px solid',
                          borderColor: done
                            ? `${h.color}66`
                            : dark ? 'rgba(168,140,80,0.06)' : 'rgba(168,140,80,0.14)',
                          background: done
                            ? `${h.color}22`
                            : dark ? 'rgba(20,14,6,0.4)' : 'rgba(255,248,234,0.35)',
                          cursor: 'pointer', width: '100%', textAlign: 'left', borderStyle: 'solid',
                        }}>
                        <HabitCheckbox done={done} color={h.color} />
                        <span style={{ fontSize: '0.8rem', flexShrink: 0, opacity: done ? 0.7 : 1 }}>{h.icon}</span>
                        <span style={{
                          flex: 1, fontSize: '0.7rem', fontWeight: 500,
                          fontFamily: "'Cormorant Garamond', serif",
                          color: done ? '#8A6E4E' : '#2D1F0E',
                          textDecoration: done ? 'line-through' : 'none',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          opacity: done ? 0.55 : 1,
                        }}>{h.name}</span>
                        <StreakFlame streak={streak} />
                        <motion.span onClick={(e) => handleDeleteHabit(e, h.id)}
                          whileTap={{ scale: 0.8 }}
                          style={{
                            padding: 2, borderRadius: '3px',
                            background: 'transparent', color: 'rgba(168,140,80,0.12)',
                            cursor: 'pointer', flexShrink: 0, opacity: 0,
                            transition: 'opacity 0.15s', display: 'inline-flex',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                          <X size={10} />
                        </motion.span>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </Card>

            {/* ── BEST STREAK ── */}
            <Card delay={0.18} glowColor="rgba(201,168,76,0.2)">
              <SectionEyebrow>Best Streak</SectionEyebrow>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.65rem' }}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '2.1rem', fontWeight: 500,
                    color: '#C9A84C', lineHeight: 1,
                    textShadow: '0 0 20px rgba(201,168,76,0.2)',
                  }}>
                  <AnimatedNumber value={bestStreak} />
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1], rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: '1.2rem', lineHeight: 1, marginBottom: '0.05rem' }}>
                  <Flame size={26} fill="#C9A84C" stroke="#C9A84C" />
                </motion.span>
              <span style={{
                fontSize: '0.6rem', color: '#C9933A',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginBottom: '0.2rem',
                opacity: 0.7,
              }}>
                day{bestStreak !== 1 ? 's' : ''}
              </span>
              </div>
            </Card>

            {/* ── MONTHLY ── */}
            <Card delay={0.22} glowColor="rgba(201,168,76,0.1)">
              <SectionEyebrow>Monthly</SectionEyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => {
                  const wdColors = ['#E86060','#E8622A','#C9933A','#1A7A4E','#1B4FA8','#7B68AE','#D4607A']
                  return (
                    <div key={i} style={{
                      textAlign: 'center', fontSize: '0.42rem', fontWeight: 700,
                      color: wdColors[i], padding: '0.12rem 0', opacity: 0.65,
                    }}>{d}</div>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={'e' + i} />
                ))}
                {dayNums.map(d => {
                  const iso = isoForDay(d)
                  const dayDone = habitDone[iso] || {}
                  const doneH = habits.filter(h => dayDone[h.id])
                  const isToday = iso === todayStr
                  const allDone = habits.length > 0 && doneH.length === habits.length
                  const someDone = doneH.length > 0 && !allDone

                  return (
                    <motion.div key={d}
                      whileHover={{ scale: 1.3, zIndex: 2 }}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '4px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: allDone
                          ? 'rgba(26,122,78,0.15)'
                          : someDone
                            ? 'rgba(232,98,42,0.08)'
                            : isToday
                              ? 'rgba(201,168,76,0.12)'
                              : 'transparent',
                        border: isToday ? '1.5px solid rgba(184,106,32,0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                      }}>
                      <span style={{
                        fontSize: '0.48rem',
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#E8622A' : allDone ? '#1A7A4E' : someDone ? '#C9933A' : dark ? '#C8B898' : '#4A3520',
                        lineHeight: 1.2,
                      }}>{d}</span>
                      <div style={{ display: 'flex', gap: 1, marginTop: 1 }}>
                        {doneH.slice(0, 3).map(h => (
                          <div key={h.id} style={{
                            width: 3, height: 3, borderRadius: '50%',
                            background: h.color, boxShadow: `0 0 2px ${h.color}66`,
                          }} />
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {habits.length > 0 && (
                <div style={{
                  marginTop: '0.5rem', paddingTop: '0.4rem',
                  borderTop: '1px solid rgba(168,140,80,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: '0.48rem', color: '#8A6E4E' }}>
                    {dayNums.filter(d => {
                      const dayDone = habitDone[isoForDay(d)] || {}
                      return habits.filter(h => dayDone[h.id]).length > 0
                    }).length} active
                  </span>
                  <span style={{
                    fontSize: '0.45rem', color: '#7A5F30', opacity: 0.4,
                    fontFamily: "'Cinzel', serif",
                  }}>
                    {calDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </Card>

          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
