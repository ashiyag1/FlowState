import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function MandalaPortal({ isOpen, book, onComplete }) {
  const { dark } = useTheme()

  useEffect(() => {
    if (isOpen) {
      // Auto-trigger completion after 1.8 seconds of the ritual animation
      const timer = setTimeout(() => {
        onComplete()
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0d0a07] text-gold select-none"
      >
        {/* Soft Background Golden Glow */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />

        {/* Large Ornate Rotating Mandala SVG */}
        <motion.div
          initial={{ scale: 0.2, rotate: 0, opacity: 0 }}
          animate={{ scale: [0.2, 1, 1.25, 1.6], rotate: [0, 180, 360, 540], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-80 h-80 flex items-center justify-center"
        >
          <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.45" className="text-gold/90">
            {/* Concentric rings */}
            <circle cx="50" cy="50" r="46" strokeDasharray="1.5 1" />
            <circle cx="50" cy="50" r="41" />
            <circle cx="50" cy="50" r="34" strokeDasharray="2 1.5" />
            <circle cx="50" cy="50" r="28" />
            <circle cx="50" cy="50" r="18" />
            <circle cx="50" cy="50" r="9" strokeDasharray="0.8 0.8" />
            
            {/* Center dot */}
            <circle cx="50" cy="50" r="1.5" fill="currentColor" />

            {/* Petals / Rays */}
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                {/* Ray lines */}
                <line x1="50" y1="50" x2="50" y2="4" />
                {/* Diamond patterns */}
                <path d="M50 8 L52 14 L50 20 L48 14 Z" />
                {/* Lotus curves */}
                <path d="M50 20 C46 28 46 34 50 41" />
                <path d="M50 20 C54 28 54 34 50 41" />
                {/* Tiny star details */}
                <circle cx="50" cy="6" r="0.6" fill="currentColor" />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Dynamic transition text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -10] }}
          transition={{ duration: 1.8, times: [0, 0.2, 0.85, 1] }}
          className="absolute text-center mt-[340px] px-6"
        >
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold/60 mb-2">
            Entering Sacred Study
          </p>
          {book && (
            <>
              <h2 className="text-xl sm:text-2xl font-serif text-white mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                {book.title}
              </h2>
              <p className="text-xs italic text-gold/80" style={{ fontFamily: "'Lora', serif" }}>
                {book.scripture}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
