import React from 'react'
import { motion } from 'framer-motion'

export function FounderLetterCard({
  hasReadLetter,
  setHasReadLetter,
  setLetterOpen,
  user,
  updateProfile,
  dark,
  glassCardStyle
}) {
  return hasReadLetter ? (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
      <button
        onClick={() => setLetterOpen(true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#c8a96e',
          fontSize: '11.5px',
          cursor: 'pointer',
          fontFamily: 'sans-serif',
          textDecoration: 'underline',
          opacity: 0.75,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>💌</span> Read Ashiya's Vision Letter
      </button>
    </div>
  ) : (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        setLetterOpen(true)
        setHasReadLetter(true)
        if (user) {
          updateProfile({ preferences: { ...user.preferences, hasReadLetter: true } })
        } else {
          localStorage.setItem('fwa_mockup_letter_read', 'true')
        }
      }}
      style={{
        ...glassCardStyle,
        borderRadius: '24px',
        padding: '24px',
        border: dark ? '1px dashed rgba(200, 169, 110, 0.3)' : '1px dashed rgba(200, 169, 110, 0.5)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: dark ? 'rgba(30, 20, 25, 0.45)' : 'rgba(255, 240, 245, 0.55)',
      }}
    >
      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '14px', opacity: 0.6 }}>✨</div>
      <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '14px', opacity: 0.6 }}>💖</div>

      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
      }}>
        <span style={{ fontSize: '20px' }}>💌</span>
      </div>

      <div>
        <h4 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '20px',
          fontWeight: 700,
          color: dark ? '#ffeab8' : '#3d2600',
          margin: '0 0 4px 0'
        }}>
          A Note from the Founder
        </h4>
        <p style={{
          fontSize: '12.5px',
          color: dark ? 'rgba(245,230,200,0.65)' : '#5c4322',
          margin: 0,
          fontFamily: 'sans-serif',
          lineHeight: 1.4,
          maxWidth: '420px',
          fontStyle: 'italic'
        }}>
          "FlowState is basically a piece of my own healing journey... where we don't have to be perfect, just present."
        </p>
      </div>

      <span style={{
        fontSize: '11px',
        color: '#e8622a',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: 'sans-serif',
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        Read Ashiya's Vision Letter →
      </span>
    </motion.div>
  )
}

export default FounderLetterCard
