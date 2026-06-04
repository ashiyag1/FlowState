import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { useTheme } from '../../context/ThemeContext'
import { useAchievements } from '../../context/AchievementsContext'

/* ─────────────────────────────────────────────────────────────
   DHOOP BURNER (INCENSE BURNER) SVG COMPONENT
   Renders the ornate metal burner with base, pedestal, bowl,
   handle, finial, filigree cutouts, and glowing interior.
───────────────────────────────────────────────────────────── */
function DhoopBurner({ state, dark }) {
  const isGlowing = state === 'committed' || state === 'fulfilled' || state === 'embers'

  // Smoke particles
  const smokeParticles = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => ({
      delay: i * 0.6,
      duration: 3.2 + (i % 3) * 1.2,
      startX: 42 + (i * 3) % 18, // center around 50
    })), []
  )

  const smokeBg = dark
    ? 'radial-gradient(circle, rgba(255,255,255,0.48) 0%, rgba(230,230,230,0.15) 55%, transparent 100%)'
    : 'radial-gradient(circle, rgba(120,105,90,0.38) 0%, rgba(140,125,110,0.12) 55%, transparent 100%)'

  return (
    <div className="relative w-[130px] h-[130px] flex items-center justify-center">
      {/* Ambient outer glow when active */}
      {isGlowing && (
        <motion.div
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-[-8px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,119,34,0.22) 0%, transparent 68%)',
            zIndex: 0,
          }}
        />
      )}

      {/* Incense smoke particles */}
      <AnimatePresence>
        {state === 'committed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 overflow-visible pointer-events-none z-10"
          >
            {smokeParticles.map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  top: 25,
                  left: `${s.startX}%`,
                  width: 9 + (i % 3) * 3,
                  height: 9 + (i % 3) * 3,
                  background: smokeBg,
                  filter: 'blur(2px)',
                }}
                animate={{
                  y: [0, -180],
                  x: [0, (i % 2 === 0 ? 28 : -28), (i % 2 === 0 ? -12 : 12)],
                  scale: [1, 2.8, 0.5],
                  opacity: [0, 0.78, 0.78, 0],
                }}
                transition={{
                  duration: s.duration,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <radialGradient id="dhoop-brassGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f5edd8" />
            <stop offset="30%" stopColor="#c9933a" />
            <stop offset="75%" stopColor="#8a5a2b" />
            <stop offset="100%" stopColor="#3d2e1a" />
          </radialGradient>
          <radialGradient id="dhoop-glowGrad" cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#fff8e8" stopOpacity="1" />
            <stop offset="30%" stopColor="#ffc550" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#e8622a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff4000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dhoop-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1208" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a1208" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base shadow */}
        <ellipse cx="50" cy="98" rx="26" ry="3" fill="url(#dhoop-shadow)" />

        {/* Handle (curved loop to the right) */}
        <path
          d="M66 74 C82 74, 94 79, 94 92 C94 94, 92 96, 90 96"
          stroke="url(#dhoop-brassGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M66 74 C82 74, 94 79, 94 92 C94 94, 92 96, 90 96"
          stroke="#fff0cc"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />

        {/* Glow from inside the filigree dome cutouts */}
        {isGlowing && (
          <path
            d="M26 56 C26 31, 74 31, 74 56 Z"
            fill="url(#dhoop-glowGrad)"
            className="fs-glow"
          />
        )}

        {/* Lower cup/bowl */}
        <path
          d="M23 56 Q23 80 50 80 Q77 80 77 56 Z"
          fill="url(#dhoop-brassGrad)"
          stroke="#2c1a0c"
          strokeWidth="0.8"
        />
        {/* Rim highlights */}
        <path
          d="M23 56 H77"
          stroke="#fff0cc"
          strokeWidth="2.2"
          opacity="0.4"
        />
        <path
          d="M23 56 H77"
          stroke="#2c1a0c"
          strokeWidth="0.8"
        />

        {/* Flared Pedestal Base */}
        <path
          d="M38 80 Q38 90 32 93 H68 Q62 90 62 80 Z"
          fill="url(#dhoop-brassGrad)"
          stroke="#2c1a0c"
          strokeWidth="0.8"
        />

        {/* Ornate Filigree Dome Lid */}
        {/* Dark interior back layer */}
        <path
          d="M25 55 C25 29, 75 29, 75 55 Z"
          fill="#1f1208"
        />

        {/* Traditional Geometric cutout designs */}
        <path
          d="M32 49 Q35 43 40 40 M32 49 Q40 48 44 43 M42 35 Q46 27 50 24 M42 35 Q48 37 50 43 M50 24 Q54 27 58 35 M50 43 Q52 37 58 35 M68 49 Q60 48 56 43 M68 49 Q65 43 60 40"
          stroke={isGlowing ? '#ffe399' : '#8a5a2b'}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={isGlowing ? 0.95 : 0.6}
        />
        <circle cx="50" cy="33" r="2.2" fill={isGlowing ? '#fff' : 'none'} stroke="#8a5a2b" strokeWidth="1" />
        <circle cx="38" cy="44" r="1.8" fill={isGlowing ? '#ffe399' : 'none'} stroke="#8a5a2b" strokeWidth="1" />
        <circle cx="62" cy="44" r="1.8" fill={isGlowing ? '#ffe399' : 'none'} stroke="#8a5a2b" strokeWidth="1" />

        {/* Solid Dome ribs/cage outline */}
        <path
          d="M25 55 C25 29, 75 29, 75 55 Z"
          stroke="url(#dhoop-brassGrad)"
          strokeWidth="3.2"
          fill="none"
        />
        <path
          d="M27 54 C27 31, 73 31, 73 54"
          stroke="#fff0cc"
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
        />

        {/* Dome Finial (knob on top) */}
        <circle cx="50" cy="26" r="4" fill="url(#dhoop-brassGrad)" stroke="#2c1a0c" strokeWidth="0.8" />
        <path
          d="M48 22 L50 17 L52 22 Z"
          fill="url(#dhoop-brassGrad)"
          stroke="#2c1a0c"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN DAILY SANKALPA CARD COMPONENT
───────────────────────────────────────────────────────────── */
export default function SankalpaCard() {
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()
  const { trackEvent } = useAchievements()

  const getTodayDate = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime.split('T')[0];
  }

  const [sankalpa, setSankalpa] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [isCompleted, setCompleted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSmoke, setShowSmoke] = useState(false)
  const [showPetals, setShowPetals] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editVal, setEditVal] = useState('')

  // Load state from localstorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('daily_sankalpa')
      if (raw) {
        const { text, isCompleted: done, dateSet } = JSON.parse(raw)
        if (dateSet === getTodayDate()) {
          setSankalpa(text)
          setCompleted(done)
        } else {
          localStorage.removeItem('daily_sankalpa')
        }
      }
    } catch {
      localStorage.removeItem('daily_sankalpa')
    }
    setMounted(true)
  }, [])

  // Persist state changes
  useEffect(() => {
    if (!mounted) return
    if (sankalpa) {
      localStorage.setItem(
        'daily_sankalpa',
        JSON.stringify({
          text: sankalpa,
          isCompleted,
          dateSet: getTodayDate(),
        })
      )
    } else {
      localStorage.removeItem('daily_sankalpa')
    }
  }, [sankalpa, isCompleted, mounted])

  // Stop smoke after 5 seconds
  useEffect(() => {
    let timer;
    if (showSmoke) {
      timer = setTimeout(() => {
        setShowSmoke(false)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [showSmoke])

  // Stop petals after 6 seconds
  useEffect(() => {
    let timer;
    if (showPetals) {
      timer = setTimeout(() => {
        setShowPetals(false)
      }, 6000)
    }
    return () => clearTimeout(timer)
  }, [showPetals])

  const handleCommit = () => {
    if (!inputVal.trim()) return
    setSankalpa(inputVal.trim())
    trackEvent('sankalpa_set')
    setInputVal('')
    setShowSmoke(true)
  }

  const handleFulfill = () => {
    playHabitSound()
    setCompleted(true)
    setShowPetals(true)
    trackEvent('sankalpa_completed')
  }

  const handleEdit = () => {
    setEditVal(sankalpa)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (!editVal.trim()) return
    setSankalpa(editVal.trim())
    setCompleted(false)
    setIsEditing(false)
    setEditVal('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditVal('')
  }

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to remove today's sankalpa?")) return;
    setSankalpa(null)
    setCompleted(false)
    setInputVal('')
    setIsEditing(false)
    setEditVal('')
    setShowSmoke(false)
    setShowPetals(false)
    localStorage.removeItem('daily_sankalpa')
  }

  // Define Rose Petal shower coordinates
  const rosePetals = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${(i * 11) % 94 + 3}%`,
      delay: i * 0.07,
      duration: 3.2 + (i % 4) * 0.6,
      size: 8 + (i % 3) * 4,
      rotate: (i * 37) % 360,
    })), []
  )

  const burnerState = !sankalpa ? 'unset' : (isCompleted ? 'fulfilled' : (showSmoke ? 'committed' : 'embers'))

  if (!mounted) return null

  // Noise and gradient parchment background
  const bgGrad = dark
    ? `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at 15% 20%, rgba(201,168,76,0.18) 0%, transparent 60%),
      radial-gradient(ellipse at 85% 80%, rgba(139,94,30,0.12) 0%, transparent 60%),
      linear-gradient(155deg, #2b1d0c 0%, #1e1309 60%, #150a02 100%)
    `
    : `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at 15% 20%, rgba(255,245,210,0.72) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 80%, rgba(220,185,110,0.48) 0%, transparent 50%),
      linear-gradient(155deg, #f5e4b8 0%, #edd89a 35%, #e8d090 60%, #f2e2b2 100%)
    `

  return (
    <div
      className="fs-dash-card"
      style={{
        background: bgGrad,
        border: dark ? '1px solid rgba(201, 168, 76, 0.18)' : '1px solid rgba(180, 140, 50, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.2rem 1.4rem 1.1rem',
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {/* Dynamic Rose Petal Burst Shower when sankalpa is completed */}
      <AnimatePresence>
        {showPetals && (
          <motion.div 
            className="absolute inset-0 overflow-hidden pointer-events-none z-20"
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            {rosePetals.map((p) => (
              <motion.div
                key={p.id}
                style={{
                  position: 'absolute',
                  top: -20,
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.8,
                  background: 'linear-gradient(135deg, #d4607a 0%, #e85578 100%)',
                  borderRadius: '50% 10% 50% 50% / 50% 50% 20% 50%',
                  boxShadow: '0 2px 6px rgba(212, 96, 122, 0.4)',
                  transform: `rotate(${p.rotate}deg)`,
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: [0, 240],
                  x: [0, (p.id % 2 === 0 ? 18 : -18), (p.id % 2 === 0 ? -6 : 6)],
                  rotate: [p.rotate, p.rotate + 360],
                  opacity: [0, 0.95, 0.95, 0],
                }}
                transition={{
                  duration: p.duration,
                  ease: 'easeOut',
                  delay: p.delay,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sanskrit background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '5.2rem',
            color: dark ? 'rgba(201, 168, 76, 0.025)' : 'rgba(139, 100, 20, 0.07)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            letterSpacing: '0.04em',
          }}
        >
          ॐ सङ्कल्प
        </span>
      </div>

      {/* Ornate corner svg borders */}
      {[
        { top: 8, left: 9, rotate: 0 },
        { top: 8, right: 9, rotate: 90 },
        { bottom: 8, right: 9, rotate: 180 },
        { bottom: 8, left: 9, rotate: 270 },
      ].map((pos, i) => (
        <svg
          key={i}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            opacity: dark ? 0.28 : 0.38,
            transform: `rotate(${pos.rotate}deg)`,
            ...pos,
          }}
          viewBox="0 0 28 28"
          fill="none"
        >
          <path d="M4 4 Q4 16 14 14 Q16 4 4 4Z" fill="#8b6914" />
          <path d="M4 4 L14 14" stroke="#8b6914" strokeWidth="0.8" />
        </svg>
      ))}

      {/* Inner dashed boundary */}
      <div
        className="absolute inset-[9px] rounded-[14px] pointer-events-none"
        style={{ border: dark ? '1px dashed rgba(201,168,76,0.14)' : '1px dashed rgba(180,140,50,0.22)' }}
      />

      {/* Layout Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
        {/* Left Side: Ornate Incense burner */}
        <div className="flex-shrink-0">
          <DhoopBurner state={burnerState} dark={dark} />
        </div>

        {/* Right Side: Intention Setting Form */}
        <div className="flex-1 w-full text-center sm:text-left flex flex-col justify-center">
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: dark ? '#ffeab8' : '#8b6914',
              display: 'block',
              marginBottom: '0.15rem',
            }}
          >
            DAILY SANKALPA
          </span>

          <div
            style={{
              height: 1,
              background: dark 
                ? 'linear-gradient(90deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))'
                : 'linear-gradient(90deg, rgba(180,140,50,0.5), rgba(180,140,50,0.15))',
              marginBottom: '0.65rem',
            }}
          />

          {sankalpa ? (
            <div className="flex flex-col gap-3">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    placeholder="Edit your intention..."
                    className="w-full text-sm rounded-xl outline-none transition-all duration-200"
                    style={{
                      padding: '0.7rem 1rem',
                      border: dark ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(180,140,50,0.45)',
                      background: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.5)',
                      color: dark ? '#f5edd8' : '#5c3d1e',
                      fontFamily: "'Lora', serif",
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editVal.trim()}
                      className="px-4 py-1.5 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      style={{
                        background: editVal.trim()
                          ? 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)'
                          : (dark ? 'rgba(45,106,79,0.15)' : 'rgba(45,106,79,0.2)'),
                        color: editVal.trim() ? '#fff' : (dark ? 'rgba(255,255,255,0.25)' : 'rgba(45,106,79,0.4)'),
                        border: 'none',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-1.5 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      style={{
                        background: 'transparent',
                        color: dark ? '#c9b080' : '#8b6914',
                        border: dark ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(180,140,50,0.3)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      color: dark ? '#f5edd8' : '#5c3d1e',
                      margin: 0,
                      lineHeight: 1.4,
                      fontStyle: 'italic',
                    }}
                  >
                    "{sankalpa}"
                  </p>

                  {!isCompleted ? (
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={handleFulfill}
                        className="px-6 py-2.5 rounded-xl font-display text-[11px] font-bold uppercase tracking-wider text-white shadow-md cursor-pointer transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, #E87722 0%, #c9a84c 100%)',
                          boxShadow: '0 4px 14px rgba(232, 119, 34, 0.28)',
                          border: 'none',
                        }}
                      >
                        Fulfill Promise
                      </button>
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          background: 'transparent',
                          color: dark ? '#c9b080' : '#8b6914',
                          border: dark ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(180,140,50,0.3)',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          background: 'transparent',
                          color: dark ? '#e07a5f' : '#b23b2c',
                          border: dark ? '1px solid rgba(224,122,95,0.25)' : '1px solid rgba(178,59,44,0.3)',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 items-center">
                      <div
                        className="rounded-xl text-center sm:text-left font-serif text-[13px] italic flex items-center justify-center sm:justify-start gap-1.5"
                        style={{
                          padding: '0.6rem 0.8rem',
                          background: dark ? 'rgba(90, 170, 120, 0.08)' : 'rgba(45, 106, 79, 0.08)',
                          color: dark ? '#8aaa7a' : '#2d6a4f',
                          width: 'fit-content'
                        }}
                      >
                        🌸 Promise fulfilled. Your space is clear and calm.
                      </div>
                      <button
                        onClick={handleEdit}
                        className="px-4 py-1.5 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          background: 'transparent',
                          color: dark ? '#c9b080' : '#8b6914',
                          border: dark ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(180,140,50,0.3)',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-1.5 rounded-xl font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          background: 'transparent',
                          color: dark ? '#e07a5f' : '#b23b2c',
                          border: dark ? '1px solid rgba(224,122,95,0.25)' : '1px solid rgba(178,59,44,0.3)',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Set your intention for today..."
                className="w-full text-sm rounded-xl outline-none transition-all duration-200"
                style={{
                  padding: '0.8rem 1rem',
                  border: dark ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(180,140,50,0.35)',
                  background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
                  color: dark ? '#f5edd8' : '#5c3d1e',
                  fontFamily: "'Lora', serif",
                }}
              />
              <div>
                <button
                  onClick={handleCommit}
                  disabled={!inputVal.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-display text-[11px] font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
                  style={{
                    background: inputVal.trim()
                      ? 'linear-gradient(135deg, #c9a84c 0%, #8b6914 100%)'
                      : (dark ? 'rgba(201,168,76,0.1)' : 'rgba(180,140,50,0.25)'),
                    color: inputVal.trim() ? '#fff' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(92,61,30,0.4)'),
                    border: 'none',
                  }}
                >
                  Commit Intention
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
