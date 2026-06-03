import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import MandalaQuoteCard from '../components/ui/MandalaQuoteCard'
import { useSoundEffects } from '../hooks/useSoundEffects'
import morningBg from '../assets/hero/morningBg.webp'
import afternoonBg from '../assets/hero/afternoonBg.webp'
import eveningBg from '../assets/hero/eveningBg.webp'
import nightBg from '../assets/hero/nightBg.webp'
import { useWellness } from '../context/WellnessContext'
import { useAuth } from '../context/AuthContext'
import { computeArchetype } from '../utils/soulArchetype'

/* ─────────────────────────────────────────────────────────────
   TIME OF DAY DETECTION  (safe — used inside useEffect only)
───────────────────────────────────────────────────────────── */
function getTimeOfDay() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 20) return 'evening'
  return 'night'
}

const IS_DEBUG = typeof window !== 'undefined' && (
  window.location.search.includes('debug=particles') ||
  localStorage.getItem('debug-particles')
)

/* ─────────────────────────────────────────────────────────────
   TIME-BASED CONFIG
   skyGradient    -> subtle color atmosphere over the selected photo
   bgImage        -> distinct background file for each time of day
   celestialGlow  → radial bloom for sun / moon position
   sideVignette   → left-edge dark gradient (already existed)
   tagline        → replaces the static "Your morning sanctuary"
   badge          → the Hindi/Sanskrit text in the pill
   petalColors    → shifts petal palette per period
   stars / birds  → ambient atmosphere toggles
───────────────────────────────────────────────────────────── */
const TIME_CONFIG = {
  morning: {
    bgImage:       morningBg,
    skyGradient:   'linear-gradient(180deg, rgba(253,211,77,0.42) 0%, rgba(232,119,34,0.55) 28%, rgba(252,176,100,0.30) 60%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.48) 0%, rgba(232,119,34,0.22) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(12,5,1,0.65) 0%, transparent 100%)',
    tagline:       '✦ your morning sanctuary ✦',
    badge:         'जल ही जीवन है',
    petalColors:   ['#D4607A', '#E87722', '#c9a84c'],
    stars: false,
    birds: true,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#C9933A',
    heading1:      'the alarms can wait.',
    heading2:      'no performance here.',
    heading3:      'just take a breath.',
    subheading:    'Close the inbox, mute the notifications, and start the day at your own pace.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  afternoon: {
    bgImage:       afternoonBg,
    skyGradient:   'linear-gradient(180deg, rgba(56,189,248,0.38) 0%, rgba(125,211,252,0.28) 35%, rgba(186,230,253,0.18) 65%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.48) 0%, rgba(232,119,34,0.22) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(8,30,50,0.45) 0%, transparent 100%)',
    tagline:       '✦ your afternoon pause ✦',
    badge:         'मन शांत, तन स्वस्थ',
    petalColors:   ['#60a5fa', '#e8c97a', '#7dd3fc'],
    stars: false,
    birds: false,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#E8B96A',
    heading1:      'unplug the screen.',
    heading2:      'hustle guilt is fake.',
    heading3:      'ground your thoughts.',
    subheading:    'You’ve been staring at that window for hours. Close the laptop lid, stretch, and let your brain reset.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  evening: {
    bgImage:       eveningBg,
    skyGradient:   'linear-gradient(180deg, rgba(124,58,237,0.50) 0%, rgba(194,65,12,0.55) 30%, rgba(234,88,12,0.45) 55%, rgba(251,191,36,0.28) 80%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 5%, rgba(249,115,22,0.52) 0%, rgba(124,58,237,0.28) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(20,5,30,0.70) 0%, transparent 100%)',
    tagline:       '✦ your evening unwind ✦',
    badge:         'शाम का सुकून',
    petalColors:   ['#f472b6', '#fb923c', '#a78bfa'],
    stars: false,
    birds: true,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#E87722',
    heading1:      'the work day is over.',
    heading2:      'you did enough today.',
    heading3:      'drop the productivity guilt.',
    subheading:    'Log off. You are not defined by how much you got done. Just exist here for a moment.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
  night: {
    bgImage:       nightBg,
    skyGradient:   'linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(30,27,75,0.72) 40%, rgba(49,46,129,0.50) 70%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 3%, rgba(165,180,252,0.38) 0%, rgba(99,102,241,0.20) 30%, transparent 55%)',
    sideVignette:  'linear-gradient(90deg, rgba(5,2,20,0.80) 0%, transparent 100%)',
    tagline:       '✦ your night refuge ✦',
    badge:         'रात की शांति',
    petalColors:   ['#a78bfa', '#818cf8', '#c4b5fd'],
    stars: true,
    birds: false,
    fontFamily:    "'Cormorant Garamond', serif",
    subFontFamily: "'Lora', serif",
    highlightColor:'#818CF8',
    heading1:      'close the tabs.',
    heading2:      'burnout isn\'t worth it.',
    heading3:      'go offline.',
    subheading:    'Turn off the alarms for a second, ignore the deadlines, and rest. You can figure it out tomorrow.',
    fontSize:      'clamp(1.9rem, 5.0vw, 3.4rem)',
    lineHeight:    1.02,
  },
}


/* ─────────────────────────────────────────────────────────────
   PETAL CONFIG  (colors injected from TIME_CONFIG at render)
───────────────────────────────────────────────────────────── */
// Reduce petal count on mobile to spare GPU memory on low-end Android devices.
// 14 compositor layers is too many for Snapdragon 665-class chips.
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 640
const PETAL_BASE = Array.from({ length: IS_MOBILE ? 6 : 14 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3) % 100}%`,
  size: 9 + (i % 5) * 2.5,
  dur: 8 + (i % 4) * 2.5,
  delay: (i * 1.3) % 10,
  colorIdx: i % 3,
  /* PRODUCTION-SAFE OPACITY: raised from 0.45→0.7 so particles
     remain visible through dark overlays & GPU compositing */
  opacity: 0.7 + (i % 3) * 0.15,
}))

/* ─────────────────────────────────────────────────────────────
   MANDALA SVG — inline, no external asset needed
───────────────────────────────────────────────────────────── */
function MandalaSVG() {
  return (
    <svg viewBox="0 0 360 360" fill="none" style={{ width: '100%', height: '100%' }}>
      {[0, 30, 60, 90, 120, 150].map(r => (
        <g key={r} transform={`rotate(${r} 180 180)`}>
          <ellipse cx="180" cy="90" rx="20" ry="90" stroke="#c9a84c" strokeWidth="1" />
        </g>
      ))}
      <circle cx="180" cy="180" r="160" stroke="#c9a84c" strokeWidth="0.8" />
      <circle cx="180" cy="180" r="110" stroke="#c9a84c" strokeWidth="0.5" />
      <circle cx="180" cy="180" r="60"  stroke="#c9a84c" strokeWidth="0.8" />
      <circle cx="180" cy="180" r="18"  fill="#c9a84c" opacity="0.3" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   STARS — twinkling dots for night sky
───────────────────────────────────────────────────────────── */
function Stars() {
  const STAR_DATA = Array.from({ length: 50 }, (_, i) => ({
    cx: `${(i * 13.7 + 3) % 100}%`,
    cy: `${(i * 7.3 + 2) % 55}%`,
    r: 0.5 + (i % 3) * 0.5,
    dur: 2 + (i % 3),
    delay: (i * 0.4) % 4,
  }))
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
      {STAR_DATA.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white">
          <animate attributeName="opacity" values="0.15;0.85;0.15"
            dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   BIRDS — silhouette paths drifting across for morning/evening
───────────────────────────────────────────────────────────── */
function Birds() {
  const BIRD_DATA = [
    { from: '-5% 18%',  to: '108% 13%', dur: 16, delay: 0 },
    { from: '-12% 30%', to: '112% 24%', dur: 21, delay: 4 },
    { from: '2% 42%',   to: '115% 35%', dur: 26, delay: 8 },
  ]
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
      {BIRD_DATA.map((b, i) => (
        <path key={i} d="M0,-4 Q6,-8 12,-4 Q6,-1 0,-4" fill="rgba(253,246,227,0.5)">
          <animateTransform attributeName="transform" type="translate"
            from={b.from} to={b.to}
            dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  )
}

/* ═════════════════════════════════════════════════════════
   FLOATING PETALS — colors shift per time-of-day
   
   FIXES applied:
   - Removed `filter: blur(0.4px)` — sub-pixel CSS blur is dropped
     by GPU compositor on Webkit/Blink in production builds
   - Raised opacity baseline (see PETAL_BASE)
   - Wrapped in a positioned container with explicit z-index
     to guarantee stacking above overlay layers
   - Added `will-change: transform` for GPU layer promotion
═════════════════════════════════════════════════════════ */
function FloatingPetals({ colors }) {
  if (IS_DEBUG) console.log('[DEBUG] FloatingPetals mounted | colors:', colors)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 5,
      pointerEvents: 'none',
      overflow: 'hidden',
      outline: IS_DEBUG ? '2px dashed red' : undefined,
    }}>
      {PETAL_BASE.map(p => (
        <div
          key={p.id}
          className="fs-petal"
          style={{
            left: p.left,
            top: '-40px',
            width: p.size,
            height: p.size * 0.65,
            background: colors[p.colorIdx],
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}


/* ─────────────────────────────────────────────────────────────
   HERO TEXT BLOCK — now time-aware & emotionally connected
───────────────────────────────────────────────────────────── */
function HeroText({ tod, config, reflection }) {
  const { playHydrationSound, playWisdomSound } = useSoundEffects()

  const returningUserNote = useMemo(() => {
    if (!reflection) return "A gentle return is still a return."
    if (reflection.isReturning) {
      return "A gentle return is still a return."
    }
    if (reflection.lateNightPattern && tod === 'night') {
      return "The quiet hours seem to suit you."
    }
    if (reflection.hasHeavyLogs) {
      return "Rest your thoughts for now."
    }
    if (reflection.isConsistent) {
      return "Your quiet practice is taking shape."
    }
    return reflection.message || "A gentle return is still a return."
  }, [reflection, tod])

  const headingStyle = {
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    fontWeight: 600,
    lineHeight: config.lineHeight,
    color: '#FDF6E3',
    textShadow: '0 4px 30px rgba(16,6,2,0.5)',
    letterSpacing: '-0.01em',
    transition: 'all 0.5s ease',
  }

  return (
    <div style={{ flex: '1 1 320px', maxWidth: 580, textAlign: 'center' }}>

      {/* Main headline — dynamic per time of day */}
      <motion.div
        key={`headline-${tod}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div style={headingStyle}>{config.heading1}</div>
        <div style={{
          ...headingStyle,
          fontWeight: 700,
          fontStyle: 'italic',
          color: config.highlightColor,
          marginBottom: '0.25rem',
          textShadow: `0 0 40px ${config.highlightColor}55, 0 4px 24px rgba(16,6,2,0.4)`,
        }}>
          {config.heading2}
        </div>
        <div style={{ ...headingStyle, marginBottom: '1.3rem' }}>
          {config.heading3}
        </div>
      </motion.div>

      {/* Subheading */}
      <motion.p
        key={`subheading-${tod}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: config.subFontFamily,
          fontStyle: 'italic',
          fontSize: '1.02rem',
          color: 'rgba(253,246,227,0.75)',
          lineHeight: 1.6,
          maxWidth: 460,
          margin: '0 auto 2rem',
          transition: 'all 0.5s ease',
        }}
      >
        {config.subheading}
      </motion.p>

      {/* Dynamic reflection pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 999,
          background: 'rgba(253,246,227,0.06)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,168,76,0.22)',
          marginBottom: '2rem',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>🪔</span>
        <span style={{
          fontFamily: config.subFontFamily,
          fontSize: '0.82rem',
          fontStyle: 'italic',
          color: 'rgba(253,246,227,0.85)',
          letterSpacing: '0.02em',
        }}>
          {returningUserNote}
        </span>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => window.scrollBy({ top: window.innerHeight - 80, behavior: 'smooth' })}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 999, textDecoration: 'none',
            fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', fontWeight: 600,
            color: 'white', letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, rgba(232, 119, 34, 0.45) 0%, rgba(201, 168, 76, 0.45) 100%)',
            border: '2px double #e8c97a',
            boxShadow: '0 6px 20px rgba(232, 119, 34, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
        >
          BEGIN YOUR PRACTICE ✦
        </motion.button>
      </motion.div>

      {/* Time-aware tagline */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`tagline-${tod}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            fontFamily: config.subFontFamily,
            fontStyle: 'italic',
            fontSize: '0.78rem',
            color: 'rgba(253,246,227,0.3)',
            letterSpacing: '0.08em',
            marginTop: '0.8rem',
          }}
        >
          ✦ unplug the noise • return to your pace ✦
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   HERO SECTION — default export

   Drop-in replacement for the original HeroSection.
   No changes needed in Home.jsx.
───────────────────────────────────────────────────────────── */
export default function HeroSection({ reflection, viewMode }) {
  const { user } = useAuth()
  const { journal, habits, getStreak } = useWellness()
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])
  const userName = user?.name?.split(' ')[0] || localStorage.getItem('fwa_guest_name') || ''

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
    <section style={{
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
          DEBUG: {PETAL_BASE.length} petals | {config.stars ? 50 : 0} stars | tod={tod}
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
        // env(safe-area-inset-top) handles the iPhone Dynamic Island / notch.
        // Falls back to 72px on non-notched devices.
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
            Welcome back{userName ? <>, <span style={{ color: '#c8a96e', fontWeight: 600 }}>{userName}</span></> : ''}
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
        marginTop: '80px', // provides spacing from the absolute positioned top bar
      }}>
        <HeroText tod={tod} config={config} reflection={reflection} />
      </div>


    </section>
  )
}
