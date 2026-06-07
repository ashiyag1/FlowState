import React from 'react'

export function ActiveSadhanaPlayer({
  dark,
  activePractice,
  timerSeconds,
  viewMode,
  isReflectionTime,
  todayRitual,
  userName,
  selectedSankalpa,
  onStartPractice,
  onCompletePractice,
  onCancelPractice,
  onNavigateJournal,
  onOpenSankalpaPanel,
  hideReflection = false
}) {
  const glassCardStyle = {
    background: dark ? 'rgba(20, 13, 6, 0.8)' : 'rgba(255, 252, 243, 0.9)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.22)' : '1px solid rgba(200, 169, 110, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(139,105,20,0.07)',
    transition: 'all 0.3s ease',
  }

  const secLabelStyle = {
    fontFamily: "'Cinzel', serif",
    fontSize: '11px',
    color: '#c8a96e',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    opacity: 0.95
  }

  const showReflection = isReflectionTime && !hideReflection;

  return (
    <div className="active-sadhana-card" style={{ borderRadius: '24px', padding: '24px', ...glassCardStyle }}>
      <div style={secLabelStyle}>
        <span>{!showReflection ? "Suggested Sadhana" : "Evening Reflection"}</span>
        <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,169,110,0.2)' }} />
      </div>

      {activePractice ? (
        /* Active breathing player */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#c8a96e', fontFamily: 'sans-serif', fontWeight: 600 }}>
            ACTIVE PRACTICE: {activePractice.rname}
          </span>
          <div style={{
            fontSize: '48px', fontFamily: 'monospace', fontWeight: 700, color: dark ? '#ffeab8' : '#1c1208', fontVariantNumeric: 'tabular-nums'
          }}>
            {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCompletePractice}
              style={{ padding: '8px 20px', borderRadius: '99px', background: '#c8a96e', border: 'none', color: '#1c1208', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}
            >
              Complete Sadhana
            </button>
            <button
              onClick={onCancelPractice}
              style={{ padding: '8px 20px', borderRadius: '99px', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', color: '#c8a96e', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Static suggested view */
        <div>
          {!showReflection ? (
            selectedSankalpa === 'unset' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', padding: '10px 0' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                  Begin Your Day with Intention
                </h3>
                <p style={{ fontSize: '13.5px', color: dark ? 'rgba(245,230,200,0.75)' : '#5c4322', margin: '4px 0 12px', fontFamily: 'sans-serif', maxWidth: '420px', lineHeight: 1.5 }}>
                  Today is a fresh slate. Select or generate a daily Sankalpa above to reveal your suggested morning sadhana.
                </p>
                <button
                  onClick={onOpenSankalpaPanel}
                  style={{
                    padding: '10px 22px', borderRadius: '99px', background: 'linear-gradient(135deg, #e8622a, #c8a96e)',
                    border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
                    boxShadow: '0 4px 15px rgba(232,98,42,0.25)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em'
                  }}
                >
                  Set Daily Sankalpa ✨
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                    {todayRitual?.name || "Morning Ritual"}
                  </h3>
                  <p style={{ fontSize: '13px', color: dark ? 'rgba(245,230,200,0.7)' : '#5c4322', margin: '4px 0 0', fontFamily: 'sans-serif' }}>
                    {todayRitual?.desc || "Take a moment for yourself."}
                  </p>
                </div>
                <button
                  onClick={onStartPractice}
                  style={{
                    padding: '10px 20px', borderRadius: '99px', background: 'linear-gradient(135deg, #c8a96e, #ffe9a6)',
                    border: 'none', color: '#1c1208', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
                    boxShadow: '0 4px 15px rgba(200,169,110,0.3)'
                  }}
                >
                  Start {todayRitual.time}m Practice
                </button>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
                  How was your day, {userName || "Seeker"}?
                </h3>
                <p style={{ fontSize: '13px', color: dark ? 'rgba(245,230,200,0.7)' : '#5c4322', margin: '4px 0 0', fontFamily: 'sans-serif' }}>
                  Let go of productivity guilt. Capture your evening reflection.
                </p>
              </div>
              <button
                onClick={onNavigateJournal}
                style={{
                  padding: '10px 20px', borderRadius: '99px', background: 'linear-gradient(135deg, #c8a96e, #ffe9a6)',
                  border: 'none', color: '#1c1208', fontWeight: 700, cursor: 'pointer', fontFamily: 'sans-serif',
                  boxShadow: '0 4px 15px rgba(200,169,110,0.3)'
                }}
              >
                Write reflection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default ActiveSadhanaPlayer
