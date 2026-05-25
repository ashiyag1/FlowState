import { useState } from 'react'
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
]

export default function LotusOracle() {
  const { playHabitSound, isMuted } = useSoundEffects()
  const { dark } = useTheme()
  const [isBloomed, setIsBloomed] = useState(false)
  const [quote, setQuote] = useState(null)

  const handleBloom = () => {
    if (isBloomed) return
    
    // Play sitar completing chime
    playHabitSound()
    
    // Pick random quote
    const rand = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]
    setQuote(rand)
    setIsBloomed(true)
  }

  const handleReset = () => {
    setIsBloomed(false)
    setTimeout(() => setQuote(null), 300)
  }

  return (
    <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none text-center relative overflow-hidden">
      {/* Background mandala circle blur */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05),transparent_60%)] pointer-events-none" />

      <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold mb-3.5" style={{ fontFamily: "'Cinzel', serif" }}>
        Lotus of Wisdom
      </h3>

      <div className="flex flex-col items-center justify-center min-h-[140px] relative">
        <motion.div 
          onClick={handleBloom}
          className={`cursor-pointer focus:outline-none flex items-center justify-center p-2 relative z-10`}
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
                  
                  <button 
                    onClick={handleReset}
                    className="mt-4 px-3 py-1 text-[9px] font-bold uppercase tracking-wider border border-gold/25 dark:border-gold/15 bg-black/5 dark:bg-white/5 rounded-full hover:bg-gold/10 hover:text-gold transition-colors duration-200 cursor-pointer"
                  >
                    Seek Again
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
