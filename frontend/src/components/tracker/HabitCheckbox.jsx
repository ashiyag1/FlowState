import { motion, AnimatePresence } from 'framer-motion'

export default function HabitCheckbox({ done, color, size = 22 }) {
  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        border: done ? `1.5px solid ${color}` : `1.5px solid rgba(201,168,76,0.35)`,
        background: 'rgba(255, 255, 255, 0.02)',
        boxShadow: done ? `0 0 10px ${color}66, inset 0 0 4px rgba(255,255,255,0.2)` : 'none',
        cursor: 'pointer',
        transition: 'border 0.3s ease, box-shadow 0.3s ease',
      }}>
      
      {/* Liquid Fill */}
      <motion.div
        initial={false}
        animate={{ y: done ? '0%' : '100%', scaleY: done ? 1 : 1.5 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `radial-gradient(circle at top, ${color} 0%, ${color}dd 100%)`,
          borderRadius: done ? '50%' : '40%', // subtle blob shape change
          transformOrigin: 'bottom center',
        }}
      />
      
      {/* Check Icon */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {done && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -45, y: 5 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.1 }}>
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>✦</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
