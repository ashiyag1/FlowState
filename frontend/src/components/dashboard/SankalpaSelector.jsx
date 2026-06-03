import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SANKALPAS } from '../../data/sankalpaConfig.js'

export function SankalpaSelector({
  dark,
  selectedSankalpa,
  currentSankalpa,
  sankalpaPanelOpen,
  onTogglePanel,
  onSelectSankalpa
}) {
  const glassCardStyle = {
    background: dark ? 'rgba(20, 13, 6, 0.8)' : 'rgba(255, 252, 243, 0.9)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.22)' : '1px solid rgba(200, 169, 110, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(139,105,20,0.07)',
    transition: 'all 0.3s ease',
  }

  return (
    <>
      {/* Collapsible Sankalpa badge panel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-12px', gap: '8px' }}>
        <div style={{
          ...glassCardStyle,
          borderRadius: '99px',
          padding: '8px 18px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          fontSize: '12px'
        }}>
          <span style={{ color: '#c8a96e', fontFamily: 'sans-serif', fontWeight: 600 }}>
            SANKALPA · <span style={{ color: dark ? '#ffeab8' : '#3d2600' }}>{currentSankalpa.emoji} {currentSankalpa.label}</span>
          </span>
          <button
            onClick={onTogglePanel}
            style={{
              background: 'transparent', border: 'none', color: '#e8622a', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif'
            }}
          >
            {sankalpaPanelOpen ? 'close' : 'change'}
          </button>
        </div>
        <p style={{
          fontSize: '11px',
          color: dark ? 'rgba(245,230,200,0.55)' : 'rgba(45,31,14,0.55)',
          fontStyle: 'italic',
          margin: 0,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          maxWidth: '440px',
          lineHeight: 1.4
        }}>
          We've set your daily Sankalpa (intention) to <strong>{currentSankalpa.label}</strong>. You can change this anytime to suit your state of mind.
        </p>
      </div>

      {/* Expandable selection tray */}
      <AnimatePresence>
        {sankalpaPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              ...glassCardStyle,
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '8px'
            }}>
              <div style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 600, fontFamily: 'sans-serif' }}>
                SELECT YOUR INTENTION TODAY:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(SANKALPAS).map(([key, item]) => {
                  const isActive = selectedSankalpa === key
                  return (
                    <button
                      key={key}
                      onClick={() => onSelectSankalpa(key)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '99px',
                        border: isActive ? '1px solid #c8a96e' : '0.5px solid rgba(200,169,110,0.3)',
                        fontSize: '12px',
                        background: isActive ? '#c8a96e' : 'rgba(200,169,110,0.06)',
                        color: isActive ? '#1c1208' : (dark ? '#ffeab8' : '#3d2600'),
                        cursor: 'pointer',
                        fontWeight: isActive ? 600 : 400,
                        fontFamily: 'sans-serif',
                        transition: 'all 0.15s'
                      }}
                    >
                      {item.emoji} {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
export default SankalpaSelector
