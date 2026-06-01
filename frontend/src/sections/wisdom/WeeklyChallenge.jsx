import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { checkChallengeCompletionToday, getChallengeTodayProgress } from '../../utils/wisdomTracking'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const WEEKLY_CHALLENGES = [
  {
    id: 'bhagavad_gita_3',
    title: 'Read the Bhagavad Gita',
    desc: 'Open the Gita and absorb 3 pages today — let Krishna\'s wisdom speak to you.',
    goal: '3 pages daily',
    emoji: '📜',
    color: '#C9933A',
    seekers: 2847,
    gradient: 'linear-gradient(135deg, #C9933A 0%, #E8B55A 100%)',
  },
  {
    id: 'lotus_jar_5',
    title: 'Fill Your Wisdom Jar',
    desc: 'Tap the Lotus Oracle and collect 5 quotes each day this week.',
    goal: '5 quotes daily',
    emoji: '🏺',
    color: '#9775FA',
    seekers: 1923,
    gradient: 'linear-gradient(135deg, #7950F2 0%, #B197FC 100%)',
  },
  {
    id: 'anxiety_guide',
    title: '7-Day Calm Challenge',
    desc: 'Read one Anxiety chapter from the Bhagavad Gita or Yoga Sutras each day.',
    goal: '1 chapter daily',
    emoji: '🕊️',
    color: '#4DABF7',
    seekers: 3102,
    gradient: 'linear-gradient(135deg, #1C7ED6 0%, #74C0FC 100%)',
  },
  {
    id: 'discipline_week',
    title: 'Chanakya Discipline Sprint',
    desc: 'Read 2 pages of Chanakya Neeti on Discipline daily to build an iron will.',
    goal: '2 pages daily',
    emoji: '⚔️',
    color: '#51CF66',
    seekers: 1567,
    gradient: 'linear-gradient(135deg, #2F9E44 0%, #8CE99A 100%)',
  },
]

const STORAGE_KEY = 'weekly_challenge_progress'

function getWeekChallenge() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  return WEEKLY_CHALLENGES[weekNum % WEEKLY_CHALLENGES.length]
}

function getTodayIdx() {
  return new Date().getDay()
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export default function WeeklyChallenge() {
  const { dark } = useTheme()
  const challenge = getWeekChallenge()
  const todayIdx = getTodayIdx()

  const [progress, setProgress] = useState(() => loadProgress())
  const [justDone, setJustDone] = useState(false)
  const [todayProgress, setTodayProgress] = useState(() => getChallengeTodayProgress(challenge.id))

  const key = challenge.id
  const daysCompleted = progress[key] || []
  const todayDone = daysCompleted.includes(todayIdx)
  const totalDone = daysCompleted.length

  useEffect(() => {
    const handleUpdate = () => {
      const currentProg = getChallengeTodayProgress(key)
      setTodayProgress(currentProg)
      
      const currentProgressData = loadProgress()
      const currentDaysCompleted = currentProgressData[key] || []
      const isAlreadyDone = currentDaysCompleted.includes(todayIdx)
      
      if (!isAlreadyDone && currentProg.current >= currentProg.target) {
        const updated = { ...currentProgressData, [key]: [...currentDaysCompleted, todayIdx] }
        setProgress(updated)
        saveProgress(updated)
        setJustDone(true)
        setTimeout(() => setJustDone(false), 2500)
      }
    }
    
    handleUpdate()
    
    window.addEventListener('wisdom_progress_updated', handleUpdate)
    return () => window.removeEventListener('wisdom_progress_updated', handleUpdate)
  }, [key, todayIdx])

  const pct = Math.round((totalDone / 7) * 100)

  return (
    <div
      className="rounded-2xl overflow-hidden mb-1"
      style={{
        background: dark
          ? 'rgba(255,255,255,0.02)'
          : 'rgba(255,255,255,0.55)',
        border: `1px solid ${challenge.color}30`,
        boxShadow: dark
          ? `0 0 0 1px ${challenge.color}10, 0 4px 24px rgba(0,0,0,0.2)`
          : `0 0 0 1px ${challenge.color}18, 0 4px 24px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Top accent stripe */}
      <div
        className="h-1 w-full"
        style={{ background: challenge.gradient }}
      />

      <div className="px-5 py-4">
        {/* ── Header row ─── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Emoji badge */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: `${challenge.color}18` }}
            >
              {challenge.emoji}
            </div>
            <div className="min-w-0">
              <p
                className="text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5"
                style={{ color: challenge.color }}
              >
                🔥 This Week's Challenge
              </p>
              <p
                className="text-sm font-bold leading-tight"
                style={{
                  color: dark ? 'rgba(252,246,232,0.9)' : 'rgba(58,38,16,0.9)',
                  fontFamily: "'Cinzel', serif",
                }}
              >
                {challenge.title}
              </p>
            </div>
          </div>

          {/* Done badge / Today's progress */}
          <div className="shrink-0">
            <AnimatePresence mode="wait">
              {todayDone ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5"
                  style={{ background: challenge.gradient }}
                >
                  ✓ Done today
                </motion.div>
              ) : (
                <motion.div
                  key="progress"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5"
                  style={{
                    background: dark ? `${challenge.color}12` : `${challenge.color}0e`,
                    borderColor: `${challenge.color}30`,
                    color: challenge.color,
                  }}
                >
                  ⚡ {todayProgress.current}/{todayProgress.target} {todayProgress.unit}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Description ─── */}
        <p
          className="text-xs leading-relaxed mb-4 font-serif italic"
          style={{ color: dark ? 'rgba(252,246,232,0.55)' : 'rgba(58,38,16,0.55)' }}
        >
          {challenge.desc}
        </p>

        {/* ── Day tracker ─── */}
        <div className="flex items-center gap-2 mb-3">
          {DAYS_SHORT.map((d, i) => {
            const done = daysCompleted.includes(i)
            const isToday = i === todayIdx
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                  style={{
                    background: done
                      ? challenge.gradient
                      : isToday
                        ? `${challenge.color}22`
                        : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                    border: isToday && !done
                      ? `1.5px solid ${challenge.color}70`
                      : '1.5px solid transparent',
                    color: done
                      ? '#fff'
                      : isToday
                        ? challenge.color
                        : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'),
                    boxShadow: done ? `0 2px 8px ${challenge.color}35` : 'none',
                  }}
                >
                  {done ? '✓' : d}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Progress bar + stats row ─── */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: challenge.gradient }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span
            className="text-[9px] font-bold shrink-0"
            style={{ color: dark ? 'rgba(201,147,58,0.5)' : 'rgba(139,94,47,0.5)' }}
          >
            {totalDone}/7 days
          </span>
          <span
            className="text-[9px] shrink-0 hidden sm:block"
            style={{ color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.22)' }}
          >
            {challenge.seekers.toLocaleString()} seekers
          </span>
        </div>

        {/* Just-done flash */}
        <AnimatePresence>
          {justDone && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-center text-[10px] font-bold mt-2"
              style={{ color: challenge.color }}
            >
              ✨ Day {totalDone} of 7 complete! Keep going!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
