import React from 'react'
import { motion } from 'framer-motion'
import { BRANDING_OPTIONS, BRANDING_LOCKS } from './brandingConfig.js'

export function BrandingDropdown({
  dark,
  user,
  selectedBranding,
  setSelectedBranding,
  onClose,
  notif,
  customStyle = {}
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute', top: 'calc(100% + 12px)', left: 0,
        width: 250, zIndex: 100,
        borderRadius: 16,
        background: dark
          ? 'rgba(22, 14, 6, 0.95)'
          : 'rgba(253, 248, 235, 0.98)',
        backdropFilter: 'blur(32px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
        border: '1px solid rgba(212,168,42,0.22)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
        padding: '8px',
        pointerEvents: 'auto',
        ...customStyle
      }}
    >
      <div style={{
        fontSize: '9px',
        fontFamily: "'Cinzel', serif",
        letterSpacing: '0.12em',
        color: dark ? 'rgba(212,168,42,0.6)' : 'rgba(138,90,18,0.6)',
        padding: '6px 8px 4px',
        borderBottom: '1px solid rgba(212,168,42,0.1)',
        marginBottom: '4px',
        textTransform: 'uppercase',
      }}>
        Select Sanctuary Name
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(BRANDING_OPTIONS).map(([key, opt]) => {
          const isSelected = selectedBranding === key
          const requiredPrana = BRANDING_LOCKS[key] || 0
          const userPrana = user?.pranaPoints || 0
          const isLocked = requiredPrana > userPrana
          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ backgroundColor: dark ? 'rgba(212,168,42,0.08)' : 'rgba(212,168,42,0.06)' }}
              onClick={() => {
                if (isLocked) {
                  notif(`🔒 Unlock ${opt.name} by earning ${requiredPrana} Prana Points! Complete all daily rituals.`, 'info')
                  onClose()
                  return
                }
                setSelectedBranding(key)
                localStorage.setItem('fwa_selected_branding', key)
                onClose()
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '8px 10px',
                borderRadius: 10,
                background: isSelected
                  ? (dark ? 'rgba(212,168,42,0.14)' : 'rgba(212,168,42,0.1)')
                  : 'transparent',
                border: isSelected
                  ? '1px solid rgba(212,168,42,0.25)'
                  : '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s ease',
                opacity: isLocked ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{
                  fontFamily: opt.fontFamily,
                  fontSize: '0.92rem',
                  fontWeight: opt.fontWeight,
                  fontStyle: opt.fontStyle,
                  letterSpacing: opt.letterSpacing,
                  textTransform: opt.textTransform || 'none',
                  color: isSelected
                    ? (dark ? '#ffe090' : '#8a5a12')
                    : (dark ? '#e8d5a8' : '#5c3d1e'),
                }}>
                  {opt.name}
                </span>
                {isLocked && <span style={{ fontSize: '0.65rem', color: dark ? 'rgba(212,168,42,0.7)' : 'rgba(138,90,18,0.7)' }}>🔒 {requiredPrana}</span>}
              </div>
              <span style={{
                fontFamily: "'Lora', serif",
                fontStyle: 'italic',
                fontSize: '0.62rem',
                color: dark ? 'rgba(212,168,42,0.5)' : 'rgba(92,61,30,0.5)',
                marginTop: 1,
              }}>
                {opt.meaning}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
