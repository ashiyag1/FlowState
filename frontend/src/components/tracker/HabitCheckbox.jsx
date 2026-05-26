import { motion, AnimatePresence } from 'framer-motion'

export default function HabitCheckbox({ done, color, size = 22 }) {
  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: done ? `1.5px solid ${color}` : `1.5px solid rgba(201,168,76,0.35)`,
        background: done 
          ? `radial-gradient(circle, ${color} 0%, rgba(201,168,76,0.12) 100%)` 
          : 'rgba(255, 255, 255, 0.02)',
        boxShadow: done ? `0 0 10px ${color}66, inset 0 0 4px rgba(255,255,255,0.2)` : 'none',
        cursor: 'pointer',
        transition: 'border 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
      }}>
      <AnimatePresence mode="wait">
        {done && (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}>
            <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>✦</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
