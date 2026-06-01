import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoundEffects } from '../../context/SoundEffectsContext'
import { useTheme } from '../../context/ThemeContext'

const INSIGHTS = [
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "You have the right to work, but never to the fruit of work.", author: "Bhagavad Gita" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Within you is the key to all knowledge, all strength.", author: "Upanishads" },
  { text: "When wisdom rises, all darkness vanishes like mist.", author: "Adi Shankaracharya" },
  { text: "Control your senses, and you will conquer the universe.", author: "Chanakya Neeti" },
  { text: "Truth can be stated in a thousand different ways, yet each can be true.", author: "Swami Vivekananda" },
  { text: "He who has conquered his own mind has conquered the world.", author: "Chanakya" },
  { text: "Let thy actions be guided by love, not by fear.", author: "Rigveda" },
  { text: "Real study is not just memorization, but training the mind to think.", author: "Lilavati" },
  { text: "The soul is not born, nor does it die. It is eternal.", author: "Bhagavad Gita" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "As you think, so you become.", author: "Upanishads" },
  { text: "Do not be afraid. What is not real, never was. What is real, never will cease to be.", author: "Bhagavad Gita" },
  { text: "Conquer your mind and you conquer the world.", author: "Guru Nanak" },
  { text: "Even if you are a minority of one, the truth is the truth.", author: "Mahatma Gandhi" },
  { text: "The purpose of life is to know the Self.", author: "Adi Shankaracharya" },
  { text: "A lamp does not flicker in a place where no winds blow.", author: "Bhagavad Gita 6.19" },
]

const JAR_MILESTONES = [
  { at: 3, emoji: '🌸', msg: 'Blooming! 3 wisdoms collected.' },
  { at: 5, emoji: '✨', msg: "You're on a roll! 5 wisdoms." },
  { at: 7, emoji: '🔥', msg: 'Seeker energy! 7 wisdoms.' },
  { at: 10, emoji: '👑', msg: 'Lotus Sage unlocked! 10 wisdoms.' },
  { at: 15, emoji: '🌟', msg: 'Enlightened! 15 wisdoms collected.' },
]

const STORAGE_KEY = 'wisdom_jar_count'
const STORAGE_DATE_KEY = 'wisdom_jar_date'

function getStoredJar() {
  try {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY)
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_DATE_KEY, today)
      localStorage.setItem(STORAGE_KEY, '0')
      return 0
    }
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
  } catch { return 0 }
}

export default function LotusOracle() {
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()
  const [isBloomed, setIsBloomed] = useState(false)
  const [quote, setQuote] = useState(null)
  const [jarCount, setJarCount] = useState(() => getStoredJar())
  const [showFlyAnim, setShowFlyAnim] = useState(false)
  const [toast, setToast] = useState(null)
  const [collected, setCollected] = useState([])
  const [shakeJar, setShakeJar] = useState(false)

  const handleBloom = () => {
    playHabitSound()
    // Pick a random insight not recently shown
    const available = INSIGHTS.filter(i => !collected.slice(-3).includes(i))
    const rand = available[Math.floor(Math.random() * available.length)]
    setQuote(rand)
    setIsBloomed(true)
  }

  const handleCollect = () => {
    if (!quote) return
    
    const newCount = jarCount + 1
    setJarCount(newCount)
    setCollected(prev => [...prev, quote])
    
    try {
      localStorage.setItem(STORAGE_KEY, String(newCount))
      window.dispatchEvent(new Event('wisdom_progress_updated'))
    } catch {}

    // Fly-to-jar animation
    setShowFlyAnim(true)
    setTimeout(() => setShowFlyAnim(false), 900)

    // Shake jar
    setShakeJar(true)
    setTimeout(() => setShakeJar(false), 600)

    // Check milestones
    const milestone = JAR_MILESTONES.find(m => m.at === newCount)
    if (milestone) {
      setTimeout(() => {
        setToast(milestone)
        setTimeout(() => setToast(null), 3000)
      }, 500)
    }

    // Reset to bloom again
    setIsBloomed(false)
    setTimeout(() => {
      const nextAvailable = INSIGHTS.filter(i => i !== quote)
      const next = nextAvailable[Math.floor(Math.random() * nextAvailable.length)]
      setQuote(next)
      setIsBloomed(true)
    }, 350)
  }

  const handleReset = () => {
    setIsBloomed(false)
    setTimeout(() => setQuote(null), 300)
  }

  const jarLabel = jarCount === 0 ? 'Empty' 
    : jarCount < 3 ? 'Growing' 
    : jarCount < 7 ? 'Filling up!' 
    : jarCount < 10 ? 'Almost full!' 
    : 'Overflowing! 🌟'

  return (
    <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none text-center relative overflow-hidden">
      {/* Background mandala circle blur */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05),transparent_60%)] pointer-events-none" />

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-2 left-2 right-2 z-50 px-3 py-2 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, #C9933A, #E8B96A)',
              boxShadow: '0 4px 20px rgba(201,147,58,0.4)',
            }}
          >
            <span className="text-sm font-bold text-white block">{toast.emoji} {toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header + Wisdom Jar counter */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold" style={{ fontFamily: "'Cinzel', serif" }}>
          Lotus Oracle
        </h3>
        {/* Wisdom Jar */}
        <motion.div
          animate={shakeJar ? { rotate: [0, -8, 8, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full cursor-default"
          style={{
            background: dark ? 'rgba(201,147,58,0.1)' : 'rgba(201,147,58,0.08)',
            border: '1px solid rgba(201,147,58,0.2)',
          }}
          title={`Wisdom Jar: ${jarCount} collected today`}
        >
          <span className="text-sm">🏺</span>
          <span className="text-[9px] font-bold" style={{ color: dark ? '#C9933A' : '#8B5E2F' }}>
            {jarCount}
          </span>
        </motion.div>
      </div>

      {/* Jar fill bar */}
      <div className="mb-3">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C9933A, #E8B96A)' }}
            animate={{ width: `${Math.min((jarCount / 10) * 100, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[8px] mt-1 font-semibold" style={{ color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(139,94,47,0.4)' }}>
          {jarLabel} · {Math.max(0, 10 - jarCount)} more to fill
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[130px] relative">
        {/* Fly-to-jar animation */}
        <AnimatePresence>
          {showFlyAnim && (
            <motion.div
              key="fly"
              className="absolute z-30 text-sm pointer-events-none"
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 0.4, x: 48, y: -55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              🪷
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          onClick={isBloomed ? undefined : handleBloom}
          className={`cursor-pointer focus:outline-none flex items-center justify-center p-2 relative z-10 ${isBloomed ? 'cursor-default' : ''}`}
          whileHover={{ scale: isBloomed ? 1 : 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={isBloomed ? { rotate: 360 } : { rotate: 0 }}
          transition={isBloomed ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] } : { type: 'spring', stiffness: 200 }}
        >
          {/* Radial Light Burst Effect behind lotus */}
          {isBloomed && (
            <motion.div 
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full bg-gold/30 dark:bg-gold/25 blur-md"
            />
          )}

          {/* Golden Lotus SVG */}
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
            {/* Left Petal */}
            <motion.path 
              d="M32 48C20 44 14 32 18 24C20 20 25 18 28 22" 
              animate={isBloomed ? { d: "M32 48C12 40 4 24 10 14C13 8 20 6 26 13" } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Right Petal */}
            <motion.path 
              d="M32 48C44 44 50 32 46 24C44 20 39 18 36 22" 
              animate={isBloomed ? { d: "M32 48C52 40 60 24 54 14C51 8 44 6 38 13" } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Inner Left Petal */}
            <motion.path 
              d="M32 48C24 40 22 28 28 16C29 14 31 15 32 18" 
              animate={isBloomed ? { d: "M32 48C18 36 12 20 22 10C24 8 28 10 30 14" } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Inner Right Petal */}
            <motion.path 
              d="M32 48C40 40 42 28 36 16C35 14 33 15 32 18" 
              animate={isBloomed ? { d: "M32 48C46 36 52 20 42 10C40 8 36 10 34 14" } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Center Petal */}
            <motion.path 
              d="M32 48C28 36 28 20 32 8C36 20 36 36 32 48Z" 
              fill="url(#lotus-gold-grad)" 
              animate={isBloomed ? { scaleY: 1.15 } : {}}
              transition={{ duration: 0.8 }}
            />
            <circle cx="32" cy="48" r="2" fill="#c9933a" />
            <defs>
              <linearGradient id="lotus-gold-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={dark ? "#6e4f20" : "#d2b48c"} />
                <stop offset="100%" stopColor="#c9a84c" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Closed / Bloom Instructions */}
        <AnimatePresence mode="wait">
          {!isBloomed ? (
            <motion.p 
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-mist-dark/60 dark:text-sand-lt/50 font-serif italic mt-3"
            >
              Tap the Lotus to seek guidance
            </motion.p>
          ) : (
            <motion.div
              key="bloomed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex flex-col items-center mt-4 w-full"
            >
              {quote && (
                <>
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-gold to-transparent mb-3.5" />
                  <p 
                    className="text-xs italic leading-relaxed text-ink/80 dark:text-ivory/80 px-2 font-serif"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    "{quote.text}"
                  </p>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-saffron/90 dark:text-saffron-lt mt-2">
                    — {quote.author}
                  </span>
                  
                  {/* Collect button */}
                  <motion.button
                    onClick={handleCollect}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full cursor-pointer flex items-center gap-1.5 text-white"
                    style={{ background: 'linear-gradient(135deg, #C9933A, #E8B96A)', boxShadow: '0 2px 12px rgba(201,147,58,0.35)' }}
                  >
                    🏺 Add to Jar
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collected count footer */}
      {jarCount > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[8px] mt-3 font-serif italic"
          style={{ color: dark ? 'rgba(201,147,58,0.45)' : 'rgba(139,94,47,0.45)' }}
        >
          🌸 {jarCount} {jarCount === 1 ? 'wisdom' : 'wisdoms'} collected today
        </motion.p>
      )}
    </div>
  )
}
