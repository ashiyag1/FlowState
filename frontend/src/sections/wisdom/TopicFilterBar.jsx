import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

const TOPIC_EMOJI = {
  'All':                '✨',
  'Relationships':      '🌺',
  'Anxiety':            '🕊️',
  'Focus':              '🧘',
  'Success':            '🏆',
  'Health':             '💚',
  'Purpose':            '🌅',
  'Discipline':         '⚔️',
  'Life Lessons':       '🦁',
  'Bhagavad Gita':      '📜',
  'Chanakya Neeti':     '🦅',
  'Ayurveda':           '🌿',
  'Kabirdas':           '🎵',
  'Adi Shankaracharya': '🪷',
}

export default function TopicFilterBar({ topics, active, onChange }) {
  const { dark } = useTheme()
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const checkScrollLimits = () => {
      setShowLeftArrow(el.scrollLeft > 5)
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
    }

    checkScrollLimits()

    el.addEventListener('scroll', checkScrollLimits)
    window.addEventListener('resize', checkScrollLimits)

    const timer = setTimeout(checkScrollLimits, 100)

    return () => {
      el.removeEventListener('scroll', checkScrollLimits)
      window.removeEventListener('resize', checkScrollLimits)
      clearTimeout(timer)
    }
  }, [topics])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollLeft += e.deltaY * 0.8
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    /*
      The outer div must NOT have overflow:hidden — that clips the shadow on pills.
      We only apply overflow-x:auto on the inner scroll track.
    */
    <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
      {/* Fade masks at edges to hint at scrollability */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
              style={{
                background: dark ? 'rgba(25, 18, 10, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: dark ? 'rgba(201, 168, 76, 0.35)' : 'rgba(201, 168, 76, 0.25)',
                color: dark ? '#FCEBC8' : '#3A2610',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer"
              style={{
                background: dark ? 'rgba(25, 18, 10, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: dark ? 'rgba(201, 168, 76, 0.35)' : 'rgba(201, 168, 76, 0.25)',
                color: dark ? '#FCEBC8' : '#3A2610',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            overflowY: 'visible',
            padding: '4px 28px 8px', // Added horizontal padding for scrollbar arrow clearance
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {topics.map((t) => {
            const isActive = active === t
            const emoji = TOPIC_EMOJI[t] || '•'

            return (
              <motion.button
                key={t}
                onClick={() => onChange(t)}
                whileTap={{ scale: 0.92 }}
                style={{
                  flexShrink: 0,           // ← never truncate / shrink
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg,#C9933A,#E8A83A)',
                        borderColor: 'transparent',
                        color: '#fff',
                        boxShadow: '0 0 18px rgba(201,147,58,0.45), 0 4px 12px rgba(201,147,58,0.25)',
                        transform: 'translateY(-1px)',
                      }
                    : {
                        background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)',
                        borderColor: dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)',
                        color: dark ? 'rgba(252,246,232,0.65)' : 'rgba(58,38,16,0.65)',
                      }),
                }}
              >
                {/* Shimmer sweep on active */}
                {isActive && (
                  <motion.span
                    aria-hidden
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.28) 50%,transparent 100%)',
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                  />
                )}
                <span style={{ fontSize: '13px', lineHeight: 1 }}>{emoji}</span>
                <span style={{ position: 'relative' }}>{t}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}