import { createContext, useContext, useState, useCallback } from 'react'

const NotifCtx = createContext(null)

export function useNotif() {
  return useContext(NotifCtx)
}

export function NotificationProvider({ children }) {
  const [item, setItem] = useState(null)

  const show = useCallback((msg, type) => {
    setItem({ msg, type, exiting: false })
  }, [])

  const hide = useCallback(() => {
    setItem(prev => prev ? { ...prev, exiting: true } : null)
    setTimeout(() => setItem(null), 250)
  }, [])

  return (
    <NotifCtx.Provider value={show}>
      {children}
      {item && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          animation: item.exiting ? 'nf-out 0.25s ease forwards' : 'nf-in 0.25s ease forwards',
        }}>
          <div style={{
            position: 'relative',
            background: '#fdf6e3',
            border: '1px solid rgba(200,151,58,0.3)',
            borderRadius: 24,
            padding: '32px 36px',
            width: 'min(420px, calc(100vw - 40px))',
            boxShadow: '0 24px 64px rgba(26,15,0,0.3)',
            animation: item.exiting ? 'nf-scale-out 0.25s ease forwards' : 'nf-scale-in 0.35s cubic-bezier(0.34,1.3,0.64,1) forwards',
          }}>
            <button
              onClick={hide}
              style={{
                position: 'absolute', top: 12, right: 14,
                width: 30, height: 30, borderRadius: '50%',
                border: 'none', background: 'transparent',
                color: '#5c3d1e', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(200,151,58,0.15)'; e.target.style.color = '#1a0f00' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#5c3d1e' }}
              aria-label="Close"
            >&#10005;</button>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 8 }}>
              <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1.2 }}>
                {item.type === 'success' ? '✓' : item.type === 'error' ? '✕' : item.type === 'info' ? '✦' : '💧'}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c8973a' }}>
                  {item.type === 'success' ? 'Success' : item.type === 'error' ? 'Error' : item.type === 'info' ? 'Info' : 'FlowState'}
                </p>
                <p style={{ margin: '8px 0 0', fontSize: 15, fontWeight: 600, color: '#1a0f00', lineHeight: 1.5 }}>{item.msg}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes nf-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nf-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes nf-scale-in { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
        @keyframes nf-scale-out { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(0.92) } }
      `}</style>
    </NotifCtx.Provider>
  )
}
