import { createContext, useContext, useState, useCallback } from 'react'

const NotifCtx = createContext(null)

export function useNotif() {
  return useContext(NotifCtx)
}

export function NotificationProvider({ children }) {
  const [item, setItem] = useState(null)

  const show = useCallback((msg, type) => {
    setItem({ msg, type, exiting: false })
    // auto dismiss
    setTimeout(() => {
      setItem(prev => prev ? { ...prev, exiting: true } : null)
      setTimeout(() => setItem(null), 250)
    }, 4000)
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
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'relative',
            background: '#fdf6e3',
            pointerEvents: 'auto',
            border: '1px solid rgba(200,151,58,0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            width: 'max-content',
            maxWidth: 'calc(100vw - 40px)',
            boxShadow: '0 12px 32px rgba(26,15,0,0.15)',
            animation: item.exiting ? 'nf-scale-out 0.25s ease forwards' : 'nf-scale-in 0.35s cubic-bezier(0.34,1.3,0.64,1) forwards',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>
                {item.type === 'success' ? '✓' : item.type === 'error' ? '✕' : item.type === 'info' ? '✦' : '💧'}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a0f00', lineHeight: 1.3 }}>{item.msg}</p>
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
