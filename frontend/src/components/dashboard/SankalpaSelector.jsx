import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SANKALPAS, getLunarSankalpaSuggestions } from '../../data/sankalpaConfig.js'

export function SankalpaSelector({
  dark,
  selectedSankalpa,
  currentSankalpa,
  sankalpaPanelOpen,
  onTogglePanel,
  onSelectSankalpa,
  onGenerateSankalpa,
  isAuthenticated,
  isReflectionTime
}) {
  const [moodText, setMoodText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [showClassic, setShowClassic] = React.useState(false)

  const glassCardStyle = {
    background: dark ? 'rgba(20, 13, 6, 0.82)' : 'rgba(255, 252, 243, 0.94)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.25)' : '1px solid rgba(200, 169, 110, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 16px 45px rgba(0,0,0,0.6)' : '0 16px 35px rgba(139,105,20,0.08)',
    transition: 'all 0.3s ease',
  }

  // Get current lunar suggestions
  const { suggestions: lunarSuggestions, context: lunarContext } = useMemo(() => {
    return getLunarSankalpaSuggestions(new Date())
  }, [])

  const handleGenerate = async () => {
    if (!moodText.trim()) return
    setLoading(true)
    try {
      await onGenerateSankalpa(moodText)
      setMoodText('')
    } finally {
      setLoading(false)
    }
  }

  // Check if a preset key is currently selected
  const isSelected = (key) => {
    if (typeof selectedSankalpa === 'string') {
      return selectedSankalpa === key
    }
    return selectedSankalpa?.key === key
  }

  return (
    <>
      <style>{`
        @keyframes fs-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fs-pulse {
          0%, 100% { opacity: 0.65; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .fs-mandala-rotate {
          animation: fs-spin 10s linear infinite;
        }
        .fs-loading-pulse {
          animation: fs-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Collapsible Sankalpa badge panel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-12px', gap: '8px' }}>
        <div style={{
          ...glassCardStyle,
          borderRadius: '99px',
          padding: '8px 18px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          fontSize: '12px'
        }}>
          <span style={{ color: '#c8a96e', fontFamily: 'sans-serif', fontWeight: 600 }}>
            SANKALPA · <span style={{ color: dark ? '#ffeab8' : '#3d2600' }}>{currentSankalpa.emoji} {currentSankalpa.label}</span>
          </span>
          {isReflectionTime ? (
            <span style={{
              color: '#c8a96e',
              fontWeight: 600,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              userSelect: 'none'
            }}>
              🔒 Locked
            </span>
          ) : (
            <button
              onClick={onTogglePanel}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e8622a',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                outline: 'none'
              }}
            >
              {sankalpaPanelOpen ? 'close' : 'Change / Ask AI ✨'}
            </button>
          )}
        </div>
        <p style={{
          fontSize: '11px',
          color: dark ? 'rgba(245,230,200,0.6)' : 'rgba(45,31,14,0.6)',
          fontStyle: 'italic',
          margin: 0,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          maxWidth: '440px',
          lineHeight: 1.4
        }}>
          Current focus: <strong>"{currentSankalpa.msg}"</strong>.
          {isReflectionTime ? (
            <span style={{ display: 'block', marginTop: '4px', color: '#c8a96e', fontWeight: 500 }}>
              At this quiet hour, we reflect on our day, relax our mind, and let go of all search for change. 🪔
            </span>
          ) : (
            !sankalpaPanelOpen && (
              <span
                onClick={onTogglePanel}
                style={{
                  color: '#e8622a',
                  cursor: 'pointer',
                  fontWeight: 700,
                  marginLeft: '6px',
                  textDecoration: 'underline',
                  display: 'inline-block'
                }}
              >
                Ask AI to personalize ✨
              </span>
            )
          )}
        </p>
      </div>

      {/* Expandable selection tray */}
      <AnimatePresence>
        {sankalpaPanelOpen && !isReflectionTime && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              ...glassCardStyle,
              borderRadius: '24px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              marginTop: '12px',
              position: 'relative'
            }}>
              
              {/* SECTION 1: Personal AI Intention */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#c8a96e', 
                  fontWeight: 700, 
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  ✨ Seek AI Guidance (Personalized Sankalpa)
                </div>
                
                {isAuthenticated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      value={moodText}
                      onChange={(e) => setMoodText(e.target.value)}
                      placeholder="Describe your current state of mind (e.g., 'Feeling overwhelmed by tasks and need focus', 'Stressed about exams', 'Very energetic but scattered')..."
                      disabled={loading}
                      style={{
                        width: '100%',
                        height: '75px',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: dark ? '1px solid rgba(200, 169, 110, 0.2)' : '1px solid rgba(200, 169, 110, 0.35)',
                        background: dark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.65)',
                        color: dark ? '#f5edd8' : '#3d2600',
                        fontSize: '12.5px',
                        fontFamily: "'Lora', serif",
                        outline: 'none',
                        resize: 'none',
                        transition: 'border 0.2s',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: dark ? 'rgba(245,230,200,0.45)' : 'rgba(45,31,14,0.45)' }}>
                        Powered by Llama 3 & Sahayak AI 🪷
                      </span>
                      
                      {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="fs-loading-pulse">
                          <svg style={{
                            width: '16px',
                            height: '16px',
                            animation: 'fs-spin 2s linear infinite',
                            color: '#e8622a'
                          }} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30" />
                          </svg>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#e8622a', fontFamily: 'sans-serif' }}>
                            Crafting Intention...
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={handleGenerate}
                          disabled={!moodText.trim()}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            background: moodText.trim() 
                              ? 'linear-gradient(135deg, #e8622a 0%, #c8a96e 100%)' 
                              : (dark ? 'rgba(200,169,110,0.08)' : 'rgba(200,169,110,0.15)'),
                            color: moodText.trim() ? '#fff' : (dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'),
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: moodText.trim() ? 'pointer' : 'default',
                            fontFamily: 'sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            transition: 'all 0.2s',
                            boxShadow: moodText.trim() ? '0 4px 12px rgba(232,98,42,0.18)' : 'none'
                          }}
                        >
                          Seek Guidance
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: dark ? 'rgba(232,98,42,0.04)' : 'rgba(232,98,42,0.03)',
                    border: dark ? '1px dashed rgba(232,98,42,0.2)' : '1px dashed rgba(232,98,42,0.3)',
                    fontSize: '11.5px',
                    color: dark ? '#f5edd8' : '#3d2600',
                    fontFamily: 'sans-serif',
                    lineHeight: 1.4
                  }}>
                    🔒 <strong>Sign in</strong> to unlock personalized AI guides. Guest sessions are limited to lunar and classic presets.
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: dark ? 'rgba(200,169,110,0.12)' : 'rgba(200,169,110,0.2)' }} />

              {/* SECTION 2: Celestial Tithi Presets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#c8a96e', 
                    fontWeight: 700, 
                    fontFamily: 'sans-serif',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    🌙 Celestial Alignment (Today's Tithi)
                  </div>
                  <span style={{ 
                    fontSize: '10px', 
                    color: dark ? '#ffeab8' : '#8b6914', 
                    fontWeight: 600,
                    fontStyle: 'italic',
                    fontFamily: 'sans-serif'
                  }}>
                    {lunarContext}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {lunarSuggestions.map((item) => {
                    const isActive = isSelected(item.key)
                    return (
                      <button
                        key={item.key}
                        onClick={() => onSelectSankalpa(item.key)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '99px',
                          border: isActive ? '1px solid #c8a96e' : '0.5px solid rgba(200,169,110,0.25)',
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

              {/* SECTION 3: Classic Presets Drawer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => setShowClassic(!showClassic)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: dark ? 'rgba(245,230,200,0.5)' : 'rgba(45,31,14,0.5)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                    outline: 'none'
                  }}
                >
                  <span>{showClassic ? '▼' : '►'} Classic Intentions</span>
                </button>

                <AnimatePresence>
                  {showClassic && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '6px' }}>
                        {Object.entries(SANKALPAS)
                          .filter(([key]) => !['jyoti', 'sadhana', 'visrama', 'pratyahara', 'purna', 'shunya'].includes(key))
                          .map(([key, item]) => {
                            const isActive = isSelected(key)
                            return (
                              <button
                                key={key}
                                onClick={() => onSelectSankalpa(key)}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: '99px',
                                  border: isActive ? '1px solid #c8a96e' : '0.5px solid rgba(200,169,110,0.2)',
                                  fontSize: '11.5px',
                                  background: isActive ? '#c8a96e' : 'rgba(200,169,110,0.04)',
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SankalpaSelector
