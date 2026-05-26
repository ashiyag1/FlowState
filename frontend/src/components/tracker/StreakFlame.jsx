import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function StreakFlame({ streak, size = 14 }) {
  if (streak <= 0) return null
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        fontSize: '0.6rem', fontWeight: 700, color: '#C9A84C',
        whiteSpace: 'nowrap',
      }}>
      <motion.span
        animate={{ scale: [1, 1.25, 1], rotate: [0, -4, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'inline-flex' }}>
        <Flame size={size} fill="#C9A84C" stroke="#C9A84C" />
      </motion.span>
      {streak}
    </motion.span>
  )
}
