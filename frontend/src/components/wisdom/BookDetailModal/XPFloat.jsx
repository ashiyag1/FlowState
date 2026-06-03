import React from 'react'
import { motion } from 'framer-motion'

export function XPFloat({ id, onDone }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -50, scale: 1.2 }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
      onAnimationComplete={onDone}
      style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, pointerEvents: 'none',
        fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem',
        background: 'linear-gradient(135deg, #C9933A, #E8B96A)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 2px 6px rgba(201,147,58,0.5))',
        whiteSpace: 'nowrap',
      }}
    >
      +10 XP ✨
    </motion.div>
  )
}
