import { motion } from 'framer-motion'

export default function ShimmerBar({ pct, color, glowColor }) {
  return (
    <div style={{
      height: 4, borderRadius: 2,
      background: 'rgba(168,140,80,0.1)',
      overflow: 'hidden', position: 'relative',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%', borderRadius: 2,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 8px ${glowColor}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }} />
      </motion.div>
    </div>
  )
}
