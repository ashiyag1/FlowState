import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Flame, Sparkles, Trophy, Star } from 'lucide-react'
import { useWellness } from '../../context/WellnessContext'
import { useTheme } from '../../context/ThemeContext'
import { getHinduDetails } from '../../utils/hinduCalendar'

function isoForDay(calYear, calMonth, d) {
  return `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function getDayRun(day, calYear, calMonth, habitDone, habits, todayStr) {
  const iso = isoForDay(calYear, calMonth, day)
  const dayDone = habitDone[iso] || {}
  const count = habits.filter(h => dayDone[h.id]).length
  if (count === 0 || iso > todayStr) return 0
  let run = 0
  for (let cursor = day; cursor >= 1; cursor -= 1) {
    const cursorIso = isoForDay(calYear, calMonth, cursor)
    const cursorDone = habitDone[cursorIso] || {}
    const cursorCount = habits.filter(h => cursorDone[h.id]).length
    if (cursorCount === 0 || cursorIso > todayStr) break
    run += 1
  }
  return run
}

function computeGrade(pct) {
  if (pct >= 95) return { letter: 'S', label: 'Legendary', emoji: '👑' }
  if (pct >= 80) return { letter: 'A', label: 'Elite', emoji: '🔥' }
  if (pct >= 65) return { letter: 'B', label: 'Solid', emoji: '💪' }
  if (pct >= 45) return { letter: 'C', label: 'Steady', emoji: '🌱' }
  return { letter: 'D', label: 'Rising', emoji: '✨' }
}

export default function CalendarModal({ open, onClose }) {
  const { dark } = useTheme()
  const { habits, habitDone, getStreak } = useWellness()
  const [calDate, setCalDate] = useState(new Date())

  const todayStr = new Date().toISOString().slice(0, 10)
  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()

  const monthStats = dayNums.reduce((acc, day) => {
    const iso = isoForDay(calYear, calMonth, day)
    if (iso > todayStr) return acc
    const dayDone = habitDone[iso] || {}
    const count = habits.filter(h => dayDone[h.id]).length
    if (count > 0) acc.activeDays += 1
    if (habits.length > 0 && count === habits.length) acc.perfectDays += 1
    acc.totalDone += count
    return acc
  }, { activeDays: 0, perfectDays: 0, totalDone: 0 })

  const bestStreak = Math.max(0, ...habits.map(h => getStreak(h.id)))
  const totalHabits = habits.length
  const totalPossible = Math.max(1, monthStats.activeDays * totalHabits)
  const consistencyPct = Math.round((monthStats.totalDone / totalPossible) * 100)
  const grade = computeGrade(consistencyPct)

  const getMoodMessage = () => {
    if (bestStreak >= 21) return { head: 'Unreal.', sub: `${bestStreak}-day streak. You're literally built different. 🔥`, icon: '👑' }
    if (bestStreak >= 14) return { head: 'Beast Mode.', sub: `${bestStreak}-day streak. Consistency is your superpower. ⚡`, icon: '🔥' }
    if (bestStreak >= 7) return { head: 'On Fire!', sub: `${bestStreak}-day streak! This is elite behavior. 🔥`, icon: '🔥' }
    if (bestStreak >= 5) return { head: 'Locked In.', sub: `${bestStreak} days strong. Momentum is building. 🚀`, icon: '🚀' }
    if (bestStreak >= 3) return { head: 'Getting Solid.', sub: `${bestStreak}-day streak! Keep showing up. 💪`, icon: '💪' }
    if (bestStreak >= 1) return { head: 'Day 1 Energy.', sub: 'Every streak starts with one day. You\'re in motion. 🌱', icon: '🌱' }
    return { head: 'Ready When You Are.', sub: 'No streak yet — but today could be Day 1. ✨', icon: '✨' }
  }

  const mood = getMoodMessage()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: dark
              ? 'linear-gradient(135deg, rgba(10,8,5,0.97) 0%, rgba(25,18,8,0.97) 100%)'
              : 'linear-gradient(135deg, rgba(255,252,246,0.98) 0%, rgba(250,242,230,0.98) 100%)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            overflow: 'auto',
          }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.2rem 4rem', position: 'relative' }}>
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'fixed', top: 18, right: 18, zIndex: 100,
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                color: dark ? '#e8d9b5' : '#5C3D1E',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Hero Streak Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{
                textAlign: 'center', marginBottom: 24, paddingTop: 12,
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 4, lineHeight: 1 }}>
                {mood.icon}
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700,
                color: dark ? '#FBF6EE' : '#1C1208', margin: '4px 0 2px',
                background: bestStreak >= 5
                  ? 'linear-gradient(135deg, #E8622A, #C9933A, #E8622A)'
                  : 'none',
                WebkitBackgroundClip: bestStreak >= 5 ? 'text' : 'unset',
                WebkitTextFillColor: bestStreak >= 5 ? 'transparent' : 'unset',
              }}>
                {mood.head}
              </h1>
              <p style={{
                fontFamily: "'Lora', serif", fontSize: '0.85rem', fontStyle: 'italic',
                color: dark ? '#c9b080' : '#8B5E2F', maxWidth: 360, margin: '0 auto',
              }}>
                {mood.sub}
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24,
              }}
            >
              {[
                { value: bestStreak, label: 'Best Streak', icon: <Flame size={14} />, color: '#E8622A' },
                { value: monthStats.activeDays, label: 'Active Days', icon: <Sparkles size={14} />, color: '#C9933A' },
                { value: monthStats.perfectDays, label: 'Perfect Days', icon: <Star size={14} />, color: '#1A7A4E' },
                { value: grade.letter, label: grade.label, icon: <Trophy size={14} />, color: '#1B4FA8', big: true },
              ].map((stat, i) => (
                <div key={stat.label}
                  style={{
                    borderRadius: 16, padding: '12px 6px', textAlign: 'center',
                    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)'}`,
                    boxShadow: i === 0 && bestStreak >= 5
                      ? `0 0 24px ${dark ? 'rgba(232,98,42,0.25)' : 'rgba(232,98,42,0.15)'}`
                      : 'none',
                  }}
                >
                  <div style={{ color: stat.color, marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
                    {stat.icon}
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif', serif",
                    fontSize: stat.big ? '1.4rem' : '1.2rem', fontWeight: 700,
                    color: dark ? '#FBF6EE' : '#1C1208', lineHeight: 1.2,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: "'Cinzel', serif", fontSize: '7px',
                    color: dark ? '#c9b080' : '#8B5E2F', letterSpacing: '0.06em',
                    textTransform: 'uppercase', marginTop: 2,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Consistency Bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                marginBottom: 24, padding: '14px 16px',
                borderRadius: 16,
                background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)'}`,
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
              }}>
                <span style={{
                  fontFamily: "'Cinzel', serif", fontSize: '9px', letterSpacing: '0.08em',
                  color: dark ? '#c9b080' : '#8B5E2F', fontWeight: 700, textTransform: 'uppercase',
                }}>
                  Consistency Score
                </span>
                <span style={{
                  fontFamily: "'Playfair Display', serif', serif", fontSize: '1rem', fontWeight: 700,
                  color: consistencyPct >= 80 ? '#1A7A4E' : consistencyPct >= 50 ? '#C9933A' : '#E8622A',
                }}>
                  {consistencyPct}%
                </span>
              </div>
              <div style={{
                height: 6, borderRadius: 3, overflow: 'hidden',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${consistencyPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: 3,
                    background: consistencyPct >= 80
                      ? 'linear-gradient(90deg, #1A7A4E, #2DA06A)'
                      : consistencyPct >= 50
                        ? 'linear-gradient(90deg, #C9933A, #E8B96A)'
                        : 'linear-gradient(90deg, #E8622A, #F4925A)',
                  }}
                />
              </div>
            </motion.div>

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                borderRadius: 20, padding: '1rem',
                background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${dark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.15)'}`,
              }}
            >
              {/* Calendar Month Nav */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12, paddingBottom: 10,
                borderBottom: `1px solid ${dark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.15)'}`,
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif', serif", fontSize: '1.05rem', fontWeight: 600,
                  color: dark ? '#e8d9b5' : '#5C3D1E', margin: 0,
                }}>
                  {calDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </h3>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })}
                    style={{
                      padding: '4px 8px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      background: 'transparent', color: dark ? '#c9b080' : '#8B5E2F',
                    }}>
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={() => setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })}
                    style={{
                      padding: '4px 8px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      background: 'transparent', color: dark ? '#c9b080' : '#8B5E2F',
                    }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} style={{
                    textAlign: 'center', fontFamily: "'Cinzel', serif", fontSize: '8px', fontWeight: 700,
                    color: dark ? 'rgba(201,168,76,0.3)' : 'rgba(139,94,47,0.3)', textTransform: 'uppercase',
                    padding: '4px 0', letterSpacing: '0.05em',
                  }}>
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`e-${i}`} style={{ aspectRatio: '1' }} />
                ))}
                {dayNums.map(d => {
                  const iso = isoForDay(calYear, calMonth, d)
                  const isToday = iso === todayStr
                  const isFuture = iso > todayStr
                  const dayDone = habitDone[iso] || {}
                  const doneCount = habits.filter(h => dayDone[h.id]).length
                  const isPerfect = totalHabits > 0 && doneCount === totalHabits
                  const isPartial = totalHabits > 0 && doneCount > 0 && doneCount < totalHabits
                  const hasProgress = isPerfect || isPartial
                  const completionPct = totalHabits ? Math.round((doneCount / totalHabits) * 100) : 0
                  const runLength = getDayRun(d, calYear, calMonth, habitDone, habits, todayStr)
                  const isOnRun = runLength >= 2
                  const hindu = getHinduDetails(iso)

                  let bg = 'transparent'
                  let border = 'transparent'
                  let shadow = 'none'
                  let textColor = dark ? 'rgba(255,246,232,0.6)' : '#594022'

                  if (isToday) {
                    bg = dark ? 'rgba(232,98,42,0.15)' : 'rgba(232,98,42,0.12)'
                    border = 'rgba(232,98,42,0.4)'
                    textColor = '#E8622A'
                  } else if (!isFuture && isPerfect) {
                    bg = dark
                      ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(232,98,42,0.18))'
                      : 'linear-gradient(135deg, rgba(251,244,228,0.95), rgba(253,240,232,0.95))'
                    border = dark ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.5)'
                    shadow = dark ? '0 0 14px rgba(201,168,76,0.28)' : '0 0 12px rgba(201,168,76,0.18)'
                    textColor = dark ? '#fcf6e8' : '#594022'
                  } else if (!isFuture && isPartial) {
                    bg = dark
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(201,168,76,0.05))'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(201,168,76,0.08))'
                    border = dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.2)'
                  } else if (!isFuture && doneCount === 0) {
                    textColor = dark ? 'rgba(255,246,232,0.35)' : 'rgba(89,64,34,0.35)'
                  }

                  return (
                    <div key={d}
                      style={{
                        aspectRatio: '1', borderRadius: 10, padding: 3,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: bg, border: `1px solid ${border}`, boxShadow: shadow,
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {isOnRun && (
                        <div style={{
                          position: 'absolute', left: 2, right: 2, bottom: 2, height: 2,
                          borderRadius: 1,
                          background: 'linear-gradient(90deg, transparent, rgba(245,200,76,0.7), transparent)',
                        }} />
                      )}
                      <span style={{
                        fontFamily: "'Playfair Display', serif', serif", fontSize: '0.8rem', fontWeight: 600,
                        color: textColor, lineHeight: 1.2,
                      }}>
                        {d}
                      </span>
                      {hasProgress && (
                        <div style={{ display: 'flex', gap: 1.5, marginTop: 1 }}>
                          <div style={{
                            width: 14, height: 3, borderRadius: 2,
                            background: isPerfect
                              ? 'linear-gradient(90deg, #C9933A, #E8B96A)'
                              : `linear-gradient(90deg, ${dark ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.4)'}, transparent)`,
                          }} />
                        </div>
                      )}
                      <span style={{
                        position: 'absolute', bottom: 2, right: 3,
                        fontSize: '5px', color: dark ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.25)',
                      }}>
                        {hindu.tithiNum}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Motivational Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                textAlign: 'center', marginTop: 24,
                fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.75rem',
                color: dark ? 'rgba(201,176,128,0.5)' : 'rgba(139,94,47,0.4)',
              }}
            >
              {bestStreak >= 3
                ? `${bestStreak} days of showing up. That's not luck — that's you. ✦`
                : 'Small steps. Big shifts. Start where you are. ✦'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
