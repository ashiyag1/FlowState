import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const MESSAGES = [
  "Your journal missed you 🪷",
  "Welcome back — your sanctuary awaits ✦",
  "The lotus returns, refreshed 🌸",
  "You came back. That's the whole practice. 🌿",
  "Your rituals have been waiting quietly 🕯️",
]

export default function RetentionNudge() {
  const [show, setShow] = useState(false)
  const [daysSince, setDaysSince] = useState(0)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    const lastVisited = localStorage.getItem('fwa_last_visited')
    const nudgeShownToday = localStorage.getItem('fwa_nudge_shown') === todayStr

    // Only show if: visited before, wasn't today, and we haven't shown the nudge this session
    if (lastVisited && lastVisited !== todayStr && !nudgeShownToday) {
      const last = new Date(lastVisited)
      const today = new Date(todayStr)
      const diff = Math.round((today - last) / (1000 * 60 * 60 * 24))
      setDaysSince(diff)

      // Pick a message
      const idx = Math.floor(Math.random() * MESSAGES.length)
      setMsg(MESSAGES[idx])

      // Show after a short delay
      const timer = setTimeout(() => {
        setShow(true)
        localStorage.setItem('fwa_nudge_shown', todayStr)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [])

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 6000)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{
            position: 'fixed',
            top: '5.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            maxWidth: 340,
            width: 'calc(100% - 2rem)',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(22,14,6,0.95), rgba(30,18,8,0.98))',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: 20,
            padding: '14px 18px',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.45), 0 0 40px rgba(201,168,76,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
          }}>
            {/* Animated lotus */}
            <motion.span
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 26, flexShrink: 0 }}
            >
              🌸
            </motion.span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "'Lora', serif",
                fontStyle: 'italic',
                fontSize: '0.88rem',
                color: '#f5e8c8',
                margin: 0,
                lineHeight: 1.4,
              }}>
                {msg}
              </p>
              {daysSince > 1 && (
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.6rem',
                  color: 'rgba(201,168,76,0.55)',
                  letterSpacing: '0.08em',
                  margin: '3px 0 0',
                  textTransform: 'uppercase',
                }}>
                  {daysSince} day{daysSince !== 1 ? 's' : ''} since your last visit
                </p>
              )}
            </div>

            {/* Progress bar at bottom (auto-dismiss indicator) */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0, left: 0,
                height: 2,
                width: '100%',
                background: 'linear-gradient(90deg, #c9933a, #e8b96a)',
                borderRadius: '0 0 20px 20px',
                transformOrigin: 'left',
              }}
            />

            <button
              onClick={() => setShow(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(201,168,76,0.4)',
                cursor: 'pointer',
                padding: 4,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
