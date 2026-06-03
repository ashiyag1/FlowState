import React from 'react'
import { motion } from 'framer-motion'

export function SacredWatermark({ dark, isNight, particles }) {
  return (
    <>
      {/* Drifting Sacred Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${s.y}%`, left: `${s.x}%`,
              fontSize: `${s.fontSize}px`, color: s.color,
              opacity: isNight ? 0.24 : 0.25,
              filter: 'drop-shadow(0 0 4px rgba(253,246,227,0.4))'
            }}
            animate={{
              opacity: isNight ? [0, 0.42, 0] : [0, 0.7, 0],
              y: isNight ? [0, -24, 0] : [0, -45, 0],
              x: [0, (i % 2 === 0 ? 8 : -8), 0],
              rotate: isNight ? [0, 80, 160] : [0, 180, 360]
            }}
            transition={{ duration: isNight ? s.duration * 1.6 : s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          >
            {s.char}
          </motion.div>
        ))}
      </div>

      {/* Sacred Om watermark */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: 'clamp(320px, 55vw, 600px)', height: 'clamp(320px, 55vw, 600px)',
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(201,168,76,0.035) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: "'Noto Serif Devanagari', serif",
          fontSize: 'clamp(14rem, 38vw, 32rem)',
          color: dark ? 'rgba(201, 168, 76, 0.035)' : 'rgba(201, 168, 76, 0.025)',
          lineHeight: 1, userSelect: 'none',
          transform: 'translateY(-6%)',
          letterSpacing: '-0.04em', fontWeight: 400,
        }}>ॐ</span>
      </div>
    </>
  )
}
export default SacredWatermark
