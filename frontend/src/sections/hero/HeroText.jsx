import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { useSoundEffects } from '../../hooks/useSoundEffects'

export default function HeroText({ tod, config, reflection }) {
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
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: 999,
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
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 28px',
            borderRadius: 999,
            textDecoration: 'none',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'white',
            letterSpacing: '0.06em',
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
