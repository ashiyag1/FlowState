import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import MandalaQuoteCard from '../components/MandalaQuoteCard'
import { useSoundEffects } from '../hooks/useSoundEffects'
import morningBg from '../assets/hero/morningBg.png'
import afternoonBg from '../assets/hero/afternoonBg.png'
import eveningBg from '../assets/hero/eveningBg.png'
import nightBg from '../assets/hero/nightBg.png'

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
    tagline:       '✦ Your morning sanctuary ✦',
    badge:         'जल ही जीवन है',
    petalColors:   ['#D4607A', '#E87722', '#c9a84c'],
    stars: false,
    birds: true,
  },
  afternoon: {
    bgImage:       afternoonBg,
    skyGradient:   'linear-gradient(180deg, rgba(56,189,248,0.38) 0%, rgba(125,211,252,0.28) 35%, rgba(186,230,253,0.18) 65%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 0%, rgba(253,224,71,0.44) 0%, rgba(56,189,248,0.18) 30%, transparent 56%)',
    sideVignette:  'linear-gradient(90deg, rgba(8,30,50,0.45) 0%, transparent 100%)',
    tagline:       '✦ Your afternoon anchor ✦',
    badge:         'मन शांत, तन स्वस्थ',
    petalColors:   ['#60a5fa', '#e8c97a', '#7dd3fc'],
    stars: false,
    birds: false,
  },
  evening: {
    bgImage:       eveningBg,
    skyGradient:   'linear-gradient(180deg, rgba(124,58,237,0.50) 0%, rgba(194,65,12,0.55) 30%, rgba(234,88,12,0.45) 55%, rgba(251,191,36,0.28) 80%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 5%, rgba(249,115,22,0.52) 0%, rgba(124,58,237,0.28) 32%, transparent 58%)',
    sideVignette:  'linear-gradient(90deg, rgba(20,5,30,0.70) 0%, transparent 100%)',
    tagline:       '✦ Your evening unwind ✦',
    badge:         'शाम का सुकून',
    petalColors:   ['#f472b6', '#fb923c', '#a78bfa'],
    stars: false,
    birds: true,
  },
  night: {
    bgImage:       nightBg,
    skyGradient:   'linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(30,27,75,0.72) 40%, rgba(49,46,129,0.50) 70%, transparent 100%)',
    celestialGlow: 'radial-gradient(ellipse at 50% 3%, rgba(165,180,252,0.38) 0%, rgba(99,102,241,0.20) 30%, transparent 55%)',
    sideVignette:  'linear-gradient(90deg, rgba(5,2,20,0.80) 0%, transparent 100%)',
    tagline:       '✦ Your night refuge ✦',
    badge:         'रात की शांति',
    petalColors:   ['#a78bfa', '#818cf8', '#c4b5fd'],
    stars: true,
    birds: false,
  },
}

/* ─────────────────────────────────────────────────────────────
   PETAL CONFIG  (colors injected from TIME_CONFIG at render)
───────────────────────────────────────────────────────────── */
const PETAL_BASE = Array.from({ length: 14 }, (_, i) => ({
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
   HERO TEXT BLOCK — now time-aware
───────────────────────────────────────────────────────────── */
function HeroText({ tod, config }) {
  const { playHydrationSound, playWisdomSound } = useSoundEffects()

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(2.8rem, 7.5vw, 5.2rem)',
    fontWeight: 600,
    lineHeight: 0.95,
    color: '#FDF6E3',
    textShadow: '0 4px 30px rgba(16,6,2,0.5)',
    letterSpacing: '-0.01em',
  }

  return (
    <div style={{ flex: '1 1 320px', maxWidth: 580, textAlign: 'center' }}>

      {/* Time-aware Hindi badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`badge-${tod}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 999,
            background: 'rgba(253,246,227,0.13)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201,168,76,0.42)',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ color: '#e8c97a', fontSize: 11 }}>✦</span>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(253,246,227,0.85)',
          }}>
            {config.badge}
          </span>
          <span style={{ color: '#e8c97a', fontSize: 11 }}>✦</span>
        </motion.div>
      </AnimatePresence>

      {/* Main headline — static, timeless */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.08 }}
      >
        <div style={headingStyle}>Rooted in</div>
        <div style={{
          ...headingStyle, fontWeight: 700, fontStyle: 'italic',
          color: '#E87722', marginBottom: '0.25rem',
          textShadow: '0 0 40px rgba(232,119,34,0.55), 0 4px 24px rgba(16,6,2,0.4)',
        }}>
          Ritual.
        </div>
        <div style={{ ...headingStyle, marginBottom: '1.3rem' }}>Living in Flow.</div>
      </motion.div>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        style={{
          fontFamily: "'Lora', serif", fontStyle: 'italic',
          fontSize: '1.05rem', color: 'rgba(253,246,227,0.7)',
          lineHeight: 1.65, maxWidth: 460, margin: '0 auto 2rem',
        }}
      >
        Ancient wisdom. Modern rhythm.<br />
        Daily practices to heal your mind, body &amp; soul.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}
      >
        <Link
          to="/water"
          onClick={playHydrationSound}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 26px', borderRadius: 999, textDecoration: 'none',
            fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 600,
            color: 'white', letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #E87722 0%, #c9600a 100%)',
            border: '1px solid rgba(232,119,34,0.55)',
            boxShadow: '0 4px 20px rgba(232,119,34,0.42), inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          💧 Track Water
        </Link>

        <Link
          to="/quotes"
          onClick={playWisdomSound}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 26px', borderRadius: 999, textDecoration: 'none',
            fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 500,
            color: 'rgba(253,246,227,0.9)', letterSpacing: '0.08em',
            background: 'rgba(253,246,227,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.48)',
          }}
        >
          🕉️ Daily Wisdom
        </Link>

      </motion.div>

      {/* Time-aware tagline */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`tagline-${tod}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          style={{
            fontFamily: "'Lora', serif", fontStyle: 'italic',
            fontSize: '0.78rem', color: 'rgba(253,246,227,0.38)',
            letterSpacing: '0.1em', marginTop: '0.8rem',
          }}
        >
          {config.tagline}
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
export default function HeroSection() {
  /* ── Hydration-safe time-of-day ──
     Start with a safe default, then set real time in useEffect.
     Prevents server/client render mismatch and avoids calling
     new Date() during the initial render pass. */
  const [tod, setTod] = useState('morning')

  useEffect(() => {
    setTod(getTimeOfDay())
    const id = setInterval(() => setTod(getTimeOfDay()), 60_000)
    if (IS_DEBUG) console.log('[DEBUG] HeroSection mounted | timeOfDay:', getTimeOfDay())
    return () => clearInterval(id)
  }, [])

  const config = TIME_CONFIG[tod]

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#160b04',
    }}>

      {/* ── Layer 1: Background photo — swaps per time of day ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`photo-${tod}`}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${config.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
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

      {/* ── Layer 4: Dark directional overlays (preserved from original) ── */}
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

      {/* ── Hero content ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%', maxWidth: 1180,
        margin: '0 auto', padding: '5rem 1.5rem 3.5rem',
      }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'center',
          gap: '3rem',
        }}>
          <HeroText tod={tod} config={config} />

          {/* MandalaQuoteCard — unchanged, right side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', marginLeft: '4.6rem' }}
          >
            <MandalaQuoteCard tod={tod} />
          </motion.div>
        </div>
      </div>

    </section>
  )
}
