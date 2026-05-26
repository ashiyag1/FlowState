import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Music, PenLine, CheckCircle2 } from 'lucide-react'
import PageLayout from '../components/ui/PageLayout'
import TopBorder from '../components/ui/TopBorder'
import HeroSection from '../sections/HeroSection'
import WisdomCarousel from '../sections/WisdomCarousel'
import DailyFlow from '../sections/DailyFlow'
import IndiaSections from '../sections/IndiaSections'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import homeBg from '../assets/home_bg.webp'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { getEmotionalReflection } from '../utils/emotionalMemory'
import { computeArchetype } from '../utils/soulArchetype'
import LotusFlower from '../icons/LotusFlower'
import { useNavigate } from 'react-router-dom'

// Rotating daily micro-challenges — overthinker & Gen Z friendly
const DAILY_CHALLENGES = [
  { emoji: '✍️', text: 'Write 3 words that describe your mind right now', action: 'Open Journal' },
  { emoji: '💧', text: 'Drink a glass of water before your next thought spiral', action: 'Track Water' },
  { emoji: '🫁', text: 'Take 4 slow breaths — inhale for 4, exhale for 6', action: null },
  { emoji: '🌅', text: 'Name one thing that went right today, no matter how small', action: 'Open Journal' },
  { emoji: '📵', text: 'Put your phone face-down for the next 10 minutes', action: null },
  { emoji: '🪞', text: "Write one sentence you'd say to a friend who felt how you feel", action: 'Open Journal' },
  { emoji: '🌿', text: 'Step outside or open a window — just one minute of fresh air', action: null },
]

function SoftSectionDivider({ dark }) {
  return (
    <div style={{
      height: '1px',
      width: '100%',
      margin: '5.5rem 0',
      background: dark
        ? 'radial-gradient(circle, rgba(201, 168, 76, 0.25) 0%, rgba(201, 168, 76, 0.08) 50%, transparent 80%)'
        : 'radial-gradient(circle, rgba(201, 168, 76, 0.32) 0%, rgba(201, 168, 76, 0.1) 50%, transparent 80%)',
    }} />
  )
}

export default function Home() {
  const { startWisdomAmbience, stopWisdomAmbience, isMuted, toggleMute } = useSoundEffects()
  const { dark } = useTheme()
  const { journal, habitDone, habits, todayTotal, waterGoal } = useWellness()
  const navigate = useNavigate()

  const [activeSound, setActiveSound] = useState(null)
  const [soundPanelOpen, setSoundPanelOpen] = useState(false)
  const [challengeDone, setChallengeDone] = useState(false)

  // Track user session active days in local storage for re-entry checks
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    const lastVisited = localStorage.getItem('fwa_last_visited')
    if (lastVisited && lastVisited !== todayStr) {
      localStorage.setItem('fwa_prev_visited', lastVisited)
    }
    localStorage.setItem('fwa_last_visited', todayStr)
  }, [])

  // Load challenge done state
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    const saved = localStorage.getItem('fwa_challenge_done')
    if (saved === todayStr) setChallengeDone(true)
  }, [])

  // Calculate dynamic reflection & time of day
  const reflection = useMemo(() => getEmotionalReflection(journal, habitDone), [journal, habitDone])
  const isNight = reflection.tod === 'night'

  // Soul archetype
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])

  // Journal streak
  const journalStreak = useMemo(() => {
    const dates = [...new Set(journal.map(e => e.date))].sort().reverse()
    let count = 0
    const todayDate = new Date()
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(todayDate)
      d.setDate(d.getDate() - i)
      const expected = d.toISOString().slice(0, 10)
      if (dates[i] === expected) count++
      else break
    }
    return count
  }, [journal])

  // Today's habits completion
  const todayStr = new Date().toISOString().slice(0, 10)
  const habitsCompletedToday = Object.keys(habitDone[todayStr] || {}).length
  const totalHabits = habits.length
  const habitPct = totalHabits > 0 ? habitsCompletedToday / totalHabits : 0
  const waterPct = waterGoal > 0 ? Math.min(todayTotal / waterGoal, 1) : 0

  // Daily challenge (deterministic by day of month)
  const dailyChallenge = useMemo(() => {
    const d = new Date().getDate()
    return DAILY_CHALLENGES[d % DAILY_CHALLENGES.length]
  }, [])

  const handleChallengeComplete = () => {
    const ts = new Date().toISOString().slice(0, 10)
    localStorage.setItem('fwa_challenge_done', ts)
    setChallengeDone(true)
  }

  // Floating particles
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      x: 5 + (i * 7.7) % 90,
      y: 10 + (i * 11.3 + 7) % 80,
      delay: i * 0.4,
      duration: 7 + (i % 5) * 2.5,
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
      if (isNight) {
        return `
          linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(13,18,36,0.6) 18%, transparent 28%),
          radial-gradient(ellipse at 50% 45%, rgba(10,14,32,0.96) 0%, rgba(8,12,24,0.4) 55%, transparent 75%),
          radial-gradient(ellipse at 15% 75%, rgba(129,140,248,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 35%, rgba(99,102,241,0.05) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 0%, rgba(193,178,255,0.04) 0%, transparent 35%),
          url(${homeBg}) center top / cover no-repeat
        `
      } else {
        return `
          linear-gradient(180deg, rgba(23,14,6,0.85) 0%, rgba(23,14,6,0.3) 18%, transparent 28%),
          radial-gradient(ellipse at 50% 45%, rgba(22,14,6,0.92) 0%, rgba(22,14,6,0.4) 55%, transparent 75%),
          radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 35%),
          url(${homeBg}) center top / cover no-repeat
        `
      }
    } else {
      if (isNight) {
        return `
          linear-gradient(180deg, rgba(240,244,248,0.6) 0%, rgba(228,232,240,0.12) 18%, transparent 28%),
          radial-gradient(ellipse at 50% 45%, rgba(240,244,250,0.6) 0%, rgba(240,244,250,0.12) 55%, transparent 75%),
          radial-gradient(ellipse at 15% 75%, rgba(129,140,248,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 35%),
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
    }
  }, [dark, isNight])

  return (
    <>
      <HeroSection reflection={reflection} />
      <TopBorder />
      <PageLayout>
        <main style={{ position: 'relative', paddingTop: '4.5rem', background: dynamicBackgroundStyle }}>

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
                ? 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            <span style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: 'clamp(14rem, 38vw, 32rem)',
              color: dark ? 'rgba(201, 168, 76, 0.05)' : 'rgba(201, 168, 76, 0.04)',
              lineHeight: 1, userSelect: 'none',
              transform: 'translateY(-6%)',
              letterSpacing: '-0.04em', fontWeight: 400,
            }}>ॐ</span>
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '3rem 1.2rem 0' }}>

            {/* ── YOUR VIBE TODAY CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Left: Archetype + Greeting */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 20,
                background: dark
                  ? 'linear-gradient(135deg, rgba(15,10,4,0.85), rgba(30,18,8,0.7))'
                  : 'linear-gradient(135deg, rgba(255,252,240,0.9), rgba(255,248,225,0.8))',
                border: '1px solid rgba(201,168,76,0.22)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: 22, filter: `drop-shadow(0 0 8px ${archetype.glow})` }}
                  >
                    {archetype.emoji}
                  </motion.span>
                  <div>
                    <p style={{
                      fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(201,168,76,0.7)', margin: 0,
                    }}>Soul Type</p>
                    <p style={{
                      fontFamily: "'Playfair Display', serif", fontSize: '1.05rem',
                      fontWeight: 700, margin: 0,
                      background: archetype.gradient,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{archetype.id}</p>
                  </div>
                </div>
                <p style={{
                  fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.82rem',
                  color: dark ? 'rgba(245,230,200,0.75)' : 'rgba(78,51,24,0.75)',
                  margin: 0, lineHeight: 1.5,
                }}>{archetype.tagline}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/journal')}
                  style={{
                    marginTop: 4,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 14px', borderRadius: 999,
                    background: 'linear-gradient(135deg, #c9933a, #e8b96a)',
                    border: 'none', color: '#fff',
                    fontFamily: "'Cinzel', serif", fontSize: '0.62rem',
                    fontWeight: 600, letterSpacing: '0.08em',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(201,147,58,0.3)',
                    alignSelf: 'flex-start',
                  }}
                >
                  <PenLine size={10} /> Log how you feel
                </motion.button>
              </div>

              {/* Right: Today's Stats */}
              <div style={{
                padding: '1.25rem 1.5rem', borderRadius: 20,
                background: dark ? 'rgba(15,10,4,0.7)' : 'rgba(255,252,240,0.85)',
                border: '1px solid rgba(201,168,76,0.18)',
                backdropFilter: 'blur(20px)',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <p style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.65)', margin: 0,
                }}>Today's Wellness</p>

                {/* Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>🔥</span>
                  <p style={{
                    fontFamily: "'Lexend', sans-serif", fontSize: '0.72rem',
                    color: dark ? '#f5e6c8' : '#2d1f0e', margin: 0,
                  }}>
                    <strong>{journalStreak}</strong>-day journal streak
                  </p>
                </div>

                {/* Habits bar */}
                {totalHabits > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '0.65rem', color: dark ? 'rgba(245,230,200,0.55)' : 'rgba(78,51,24,0.55)', margin: 0 }}>Rituals</p>
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: '#c9933a', margin: 0 }}>{habitsCompletedToday}/{totalHabits}</p>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.2)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${habitPct * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #c9933a, #e8b96a)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Water bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <p style={{ fontFamily: "'Lexend', sans-serif", fontSize: '0.65rem', color: dark ? 'rgba(245,230,200,0.55)' : 'rgba(78,51,24,0.55)', margin: 0 }}>Hydration</p>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', color: '#60a5fa', margin: 0 }}>{Math.round(waterPct * 100)}%</p>
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: dark ? 'rgba(96,165,250,0.12)' : 'rgba(96,165,250,0.2)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${waterPct * 100}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #7dd3fc)' }}
                    />
                  </div>
                </div>

                <p style={{
                  fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.74rem',
                  color: dark ? 'rgba(245,230,200,0.6)' : 'rgba(78,51,24,0.6)',
                  margin: 0, lineHeight: 1.5,
                  borderTop: '1px solid rgba(201,168,76,0.12)', paddingTop: 8,
                }}>
                  {reflection.message}
                </p>
              </div>
            </motion.div>

            {/* ── DAILY MICRO-CHALLENGE ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              style={{
                marginBottom: '2.5rem',
                padding: '1rem 1.4rem',
                borderRadius: 16,
                background: dark
                  ? 'linear-gradient(135deg, rgba(15,10,4,0.7), rgba(25,15,5,0.6))'
                  : 'linear-gradient(135deg, rgba(255,252,240,0.85), rgba(255,247,220,0.7))',
                border: challengeDone
                  ? '1px solid rgba(52,211,153,0.35)'
                  : '1px solid rgba(201,168,76,0.2)',
                backdropFilter: 'blur(16px)',
                display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{dailyChallenge.emoji}</span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{
                  fontFamily: "'Cinzel', serif", fontSize: '0.55rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: challengeDone ? 'rgba(52,211,153,0.8)' : 'rgba(201,168,76,0.65)',
                  margin: '0 0 3px',
                }}>
                  {challengeDone ? "✓ Today's challenge complete" : '✦ Today\'s Challenge'}
                </p>
                <p style={{
                  fontFamily: "'Lora', serif", fontSize: '0.85rem',
                  color: dark ? '#f2ebd9' : '#2d1f0e', margin: 0, lineHeight: 1.4,
                }}>
                  {dailyChallenge.text}
                </p>
              </div>
              <AnimatePresence mode="wait">
                {challengeDone ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 12px', borderRadius: 999,
                      background: 'rgba(52,211,153,0.12)',
                      border: '1px solid rgba(52,211,153,0.3)',
                      color: '#34d399', fontFamily: "'Cinzel', serif",
                      fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={12} /> Done!
                  </motion.div>
                ) : (
                  <motion.button
                    key="action"
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      handleChallengeComplete()
                      if (dailyChallenge.action === 'Open Journal') navigate('/journal')
                      if (dailyChallenge.action === 'Track Water') navigate('/water')
                    }}
                    style={{
                      padding: '5px 14px', borderRadius: 999,
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: dark ? '#e8c46a' : '#8a5a12',
                      fontFamily: "'Cinzel', serif", fontSize: '0.6rem',
                      fontWeight: 600, letterSpacing: '0.06em',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {dailyChallenge.action || 'Done ✓'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            <DailyFlow />
            <SoftSectionDivider dark={dark} />
            <WisdomCarousel />
            <SoftSectionDivider dark={dark} />
            <IndiaSections />
          </div>

          <ImmersiveFooter />
        </main>
      </PageLayout>

      {/* Floating Sanctuary Soundscape panel */}
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
          title="Ambient Music Controls"
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
    </>
  )
}
