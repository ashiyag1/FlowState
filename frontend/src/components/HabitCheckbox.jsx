import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

export default function HabitCheckbox({ done, color, size = 22 }) {
  return (
    <motion.div
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.1 }}
      style={{
        width: size, height: size, borderRadius: '6px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: done ? 'none' : `1.5px solid rgba(168,140,80,0.3)`,
        background: done ? `linear-gradient(135deg, ${color}, ${color}dd)` : 'transparent',
        boxShadow: done ? `0 2px 10px ${color}55` : 'none',
        cursor: 'pointer',
      }}>
      <AnimatePresence mode="wait">
        {done && (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 120 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <Check size={size * 0.55} color="#fff" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
