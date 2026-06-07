import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { useAuth } from '../context/AuthContext'
import { computeArchetype } from '../utils/soulArchetype'

// Extracted Subcomponents & Config
import MandalaSVG from './hero/MandalaSVG'
import Stars from './hero/Stars'
import Birds from './hero/Birds'
import FloatingPetals from './hero/FloatingPetals'
import HeroText from './hero/HeroText'
import { TIME_CONFIG, getTimeOfDay } from './hero/timeConfig'

const IS_DEBUG = typeof window !== 'undefined' && (
  window.location.search.includes('debug=particles') ||
  localStorage.getItem('debug-particles')
)

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 640
const PETAL_COUNT = IS_MOBILE ? 6 : 14

export default function HeroSection({ reflection, viewMode }) {
  const { user } = useAuth()
  const { journal, habits, getStreak } = useWellness()
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])
  const userName = user?.name || 'Seeker'

  const habitStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0
    return Math.max(0, ...habits.map(h => getStreak(h.id)))
  }, [habits, getStreak])

  const filledSegments = useMemo(() => {
    return habitStreak % 8 || (habitStreak > 0 ? 7 : 0)
  }, [habitStreak])

  /* ── Hydration-safe time-of-day ── */
  const [tod, setTod] = useState('morning')

  useEffect(() => {
    const actual = getTimeOfDay()
    if (viewMode) {
      if (viewMode === 'evening') {
        setTod(actual === 'night' ? 'night' : 'evening')
      } else {
        setTod(actual === 'afternoon' ? 'afternoon' : 'morning')
      }
    } else {
      setTod(actual)
    }
  }, [viewMode])

  useEffect(() => {
    const id = setInterval(() => {
      const actual = getTimeOfDay()
      if (viewMode) {
        if (viewMode === 'evening') {
          setTod(actual === 'night' ? 'night' : 'evening')
        } else {
          setTod(actual === 'afternoon' ? 'afternoon' : 'morning')
        }
      } else {
        setTod(actual)
      }
    }, 60_000)
    return () => clearInterval(id)
  }, [viewMode])

  const config = TIME_CONFIG[tod]

  const greeting = useMemo(() => {
    if (tod === 'morning') return 'Good morning'
    if (tod === 'afternoon') return 'Good afternoon'
    if (tod === 'evening') return 'Good evening'
    return 'Good night'
  }, [tod])

  return (
    <section className="fs-hero-section" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#160b04',
      padding: '0 20px',
      borderBottom: '0.5px solid #e8d5b0',
      width: '100%',
    }}>

      {/* ── Layer 1: Background photo — swaps per time of day ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`photo-${tod}`}
          style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        >
          <img
            src={config.bgImage}
            alt=""
            fetchpriority="high"
            decoding="async"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: 'auto',
              minHeight: '100%',
              display: 'block',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Layer 2: Sky gradient blended over the photo ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`sky-${tod}`}
          style={{ position: 'absolute', inset: 0, background: config.skyGradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* ── Layer 3: Celestial glow (sun / moon bloom) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${tod}`}
          style={{ position: 'absolute', inset: 0, background: config.celestialGlow }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* ── Layer 4: Dark directional overlays ── */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,7,2,0.42) 0%, rgba(35,16,4,0.18) 35%, rgba(25,10,3,0.55) 75%, rgba(253,246,227,0) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 8%, rgba(255,210,100,0.22) 0%, rgba(232,119,34,0.08) 28%, transparent 56%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', background: config.sideVignette }} />
      {/* Soft golden mist at base */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, background: 'linear-gradient(to bottom, rgba(253,246,227,0) 0%, rgba(246,214,151,0.16) 52%, rgba(253,246,227,0.32) 100%)' }} />

      {/* ── Stars — night only ── */}
      <AnimatePresence>
        {config.stars && (
          <motion.div key="stars" style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2 }}>
            <Stars />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Birds — morning + evening ── */}
      <AnimatePresence>
        {config.birds && (
          <motion.div key="birds" style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}>
            <Birds />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating petals — color-shifted per time of day ── */}
      <FloatingPetals colors={config.petalColors} />

      {IS_DEBUG && (
        <div style={{
          position: 'absolute', top: 60, left: 8,
          background: 'rgba(0,0,0,0.7)', color: 'red',
          fontSize: 10, padding: '3px 8px', borderRadius: 4,
          fontFamily: 'monospace', zIndex: 9999,
          pointerEvents: 'none',
        }}>
          DEBUG: {PETAL_COUNT} petals | {config.stars ? 50 : 0} stars | tod={tod}
        </div>
      )}

      {/* ── Spinning mandala watermark ── */}
      <div
        className="fs-mandala-spin"
        style={{
          position: 'absolute', top: -80, right: -80,
          width: 360, height: 360,
          opacity: 0.055, pointerEvents: 'none',
        }}
      >
        <MandalaSVG />
      </div>

      {/* ── Greeting & Streak Top Bar ── */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 72px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        width: '96%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        {/* Left Side: Personalised greeting */}
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: '11px',
            color: '#c8a96e',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
            fontWeight: 500,
            fontFamily: 'sans-serif',
          }}>
            {greeting}
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '26px',
            color: '#fdf6ec',
            lineHeight: 1.2,
            fontWeight: 500,
            margin: 0,
          }}>
            Welcome back, <span style={{ color: '#c8a96e', fontWeight: 600 }}>{userName}</span>
          </h1>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(200, 169, 110, 0.15)',
            border: '0.5px solid rgba(200, 169, 110, 0.35)',
            borderRadius: '99px',
            padding: '4px 10px',
            fontSize: '11px',
            color: '#c8a96e',
            marginTop: '6px',
          }}>
            <span style={{ fontSize: '12px' }}>🍃</span> {archetype.id} · Day {habitStreak || 1}
          </div>
        </div>

        {/* Right Side: Habit Streak */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '32px',
            color: '#c8a96e',
            lineHeight: 1,
            fontWeight: 500,
          }}>
            {habitStreak}
          </div>
          <div style={{
            fontSize: '10px',
            color: 'rgba(253, 246, 236, 0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            habit streak
          </div>
          <div style={{
            display: 'flex',
            gap: '3px',
            marginTop: '6px',
            justifyContent: 'flex-end',
          }}>
            {Array.from({ length: 7 }).map((_, idx) => {
              const isFilled = idx < filledSegments
              return (
                <div
                  key={idx}
                  style={{
                    width: '18px',
                    height: '3px',
                    borderRadius: '99px',
                    background: isFilled ? '#c8a96e' : 'rgba(232, 213, 176, 0.3)',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Central Hero Text ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '80px',
      }}>
        <HeroText tod={tod} config={config} reflection={reflection} />
      </div>

    </section>
  )
}
