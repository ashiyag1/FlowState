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
        .sankalpa-selector-container::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(200, 169, 110, 0.4), rgba(232, 98, 42, 0.15), rgba(200, 169, 110, 0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>

      {/* Collapsible Sankalpa Card */}
      <div className="sankalpa-selector-container" style={{
        ...glassCardStyle,
        borderRadius: '24px',
        padding: '24px 24px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: dark 
          ? '0 20px 50px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.06)' 
          : '0 20px 40px rgba(139,105,20,0.08), inset 0 1px 2px rgba(255,255,255,0.6)',
        border: selectedSankalpa === 'unset' ? '1.5px solid rgba(232, 98, 42, 0.45)' : 'none',
        animation: selectedSankalpa === 'unset' ? 'fs-loading-pulse 2s ease-in-out infinite' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Saffron-Gold Top Highlight Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #c9933a, #e8622a, #d4607a)'
        }} />

        {/* Large Classical Devanagari Watermark */}
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '25px',
          fontFamily: "'Noto Serif Devanagari', serif",
          fontSize: '72px',
          fontWeight: 800,
          color: dark ? 'rgba(200, 169, 110, 0.035)' : 'rgba(200, 169, 110, 0.055)',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
          transform: 'rotate(-5deg)'
        }}>
          सङ्कल्प
        </div>

        {/* Subtle spinning Mandala background watermark */}
        <svg
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            width: '140px',
            height: '140px',
            opacity: dark ? 0.05 : 0.07,
            pointerEvents: 'none',
            color: '#c8a96e',
            animation: 'fs-spin 35s linear infinite'
          }}
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="36" />
          <circle cx="50" cy="50" r="26" />
          <circle cx="50" cy="50" r="16" />
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = (idx * 360) / 12
            return (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <path d="M50 4 C46 22, 54 22, 50 4" />
                <path d="M50 14 C48 26, 52 26, 50 14" />
              </g>
            )
          })}
        </svg>

        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{
            fontFamily: "'Noto Serif Devanagari', 'Cinzel', serif",
            fontSize: '12px',
            color: '#c8a96e',
            letterSpacing: '0.08em',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            सङ्कल्प · Daily Intention
          </span>
          {isReflectionTime ? (
            <span style={{
              background: dark ? 'rgba(200, 169, 110, 0.12)' : 'rgba(200, 169, 110, 0.08)',
              border: '1px solid rgba(200, 169, 110, 0.35)',
              borderRadius: '20px',
              padding: '3px 10px',
              color: '#c8a96e',
              fontWeight: 700,
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05)',
              userSelect: 'none'
            }}>
              <span>🔒</span>
              <span>Locked</span>
            </span>
          ) : (
            <button
              onClick={onTogglePanel}
              style={{
                background: 'rgba(232, 98, 42, 0.08)',
                border: '1px solid rgba(232, 98, 42, 0.25)',
                borderRadius: '20px',
                padding: '4px 12px',
                color: '#e8622a',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Lexend', sans-serif",
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232, 98, 42, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(232, 98, 42, 0.08)'
              }}
            >
              {sankalpaPanelOpen ? 'Close' : 'Change / Ask AI ✨'}
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(200,169,110,0), rgba(200,169,110,0.25) 20%, rgba(200,169,110,0.25) 80%, rgba(200,169,110,0))', position: 'relative', zIndex: 1 }} />

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: dark ? '#ffeab8' : '#3d2600',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '-0.01em'
          }}>
            <span style={{ fontSize: '26px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}>{currentSankalpa.emoji}</span>
            <span>{currentSankalpa.label}</span>
          </h3>
          <p style={{
            fontSize: '13.5px',
            color: dark ? 'rgba(245,230,200,0.85)' : '#5c4322',
            margin: 0,
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 350,
            lineHeight: 1.55,
          }}>
            <span className="hidden md:inline">Current focus: </span><strong style={{ fontWeight: 500, color: dark ? '#ffffff' : '#2D1F0E' }}>"{currentSankalpa.msg}"</strong>
          </p>
          {isReflectionTime ? (
            <p className="sankalpa-reflection-warning" style={{
              fontSize: '12px',
              color: '#c8a96e',
              margin: '6px 0 0 0',
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 500,
              lineHeight: 1.45,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🪔</span>
              <span>At this quiet hour, we reflect on our day, relax our mind, and let go of all search for change.</span>
            </p>
          ) : (
            !sankalpaPanelOpen && (
              <span
                onClick={onTogglePanel}
                style={{
                  color: '#e8622a',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                  textDecoration: 'underline',
                  fontFamily: "'Lexend', sans-serif",
                  marginTop: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Ask AI to personalize intention ✨
              </span>
            )
          )}
        </div>
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
            <div className="sankalpa-tray-card" style={{
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
