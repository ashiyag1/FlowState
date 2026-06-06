import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LevelUpModal({ showLevelUp, levelUpLevel, dark, onClose }) {
  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10, 6, 3, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: dark ? 'linear-gradient(145deg, #22140a, #150a04)' : 'linear-gradient(145deg, #fdfaf2, #f5ecd8)',
              border: '1px solid #c8a96e',
              borderRadius: '30px',
              padding: '35px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(200, 169, 110, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background circle */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(232,98,42,0.15) 0%, transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            }} />

            {/* Mandala icon */}
            <div style={{ position: 'relative', zIndex: 1, marginBottom: '20px' }} className="fs-loading-pulse">
              <span style={{ fontSize: '64px', display: 'block' }}>🪷</span>
            </div>

            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '22px',
              color: '#c8a96e',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: '0 0 10px',
              position: 'relative',
              zIndex: 1
            }}>
              Seeker Level Up!
            </h2>

            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '38px',
              fontWeight: 700,
              fontStyle: 'italic',
              color: dark ? '#ffeab8' : '#3d2600',
              margin: '0 0 15px',
              position: 'relative',
              zIndex: 1
            }}>
              Level {levelUpLevel}
            </div>

            <p style={{
              fontStyle: 'italic',
              fontSize: '13px',
              color: dark ? 'rgba(245,230,200,0.75)' : '#5c4322',
              fontFamily: "'Lora', serif",
              lineHeight: 1.5,
              margin: '0 0 20px',
              position: 'relative',
              zIndex: 1
            }}>
              "तेजस्विनावधितमस्तु"<br />
              <span style={{ fontSize: '11px', opacity: 0.8 }}>— May our journey be filled with glowing energy.</span>
            </p>

            <div style={{
              background: dark ? 'rgba(200,169,110,0.08)' : 'rgba(200,169,110,0.15)',
              border: '1px solid rgba(200,169,110,0.3)',
              borderRadius: '16px',
              padding: '12px',
              fontSize: '12px',
              color: '#e8622a',
              fontWeight: 700,
              fontFamily: 'sans-serif',
              marginBottom: '24px',
              position: 'relative',
              zIndex: 1
            }}>
              🎁 REWARD: +5 Prana Points 🪷
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #e8622a 0%, #c8a96e 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: 'sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(232,98,42,0.25)',
                position: 'relative',
                zIndex: 1
              }}
            >
              Continue Sadhana
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LevelUpModal
