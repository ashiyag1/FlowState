import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function CompletionCelebration({ show, dark, book, onContinue, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            background: dark ? 'rgba(26,18,8,0.96)' : 'rgba(254,252,245,0.97)',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: '24px', padding: '2rem 2.5rem',
            textAlign: 'center', maxWidth: '320px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            pointerEvents: 'auto',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌸</div>
            <h3 style={{
              fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700,
              color: dark ? '#E8C97A' : '#6B4A18', marginBottom: '0.5rem',
            }}>
              Wisdom Absorbed!
            </h3>
            <p style={{
              fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.85rem',
              color: dark ? 'rgba(252,246,232,0.7)' : 'rgba(92,61,30,0.7)',
              lineHeight: 1.5, marginBottom: '1.25rem',
            }}>
              You've completed <strong style={{ color: dark ? '#C9933A' : '#8B5E2F' }}>{book.title}</strong>. The wisdom of the ancients now lives in you. 🪷
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={onContinue}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '999px', border: 'none',
                  background: 'linear-gradient(135deg, #C9933A, #E8B96A)',
                  color: '#1a1208', fontWeight: 700, fontSize: '0.8rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Continue Reading 📜
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '999px',
                  border: `1px solid ${dark ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.4)'}`,
                  background: 'transparent',
                  color: dark ? '#C9933A' : '#8B5E2F', fontWeight: 600, fontSize: '0.8rem',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
