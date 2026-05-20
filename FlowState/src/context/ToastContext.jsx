import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const ToastCtx = createContext(null)

let toastId = 0
const uid = () => `t${++toastId}`

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = useCallback((id) => {
    setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x))
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id))
      delete timers.current[id]
    }, 300)
  }, [])

  const show = useCallback((msg, type = 'default', duration = 4000) => {
    const id = uid()
    setToasts(t => [...t, { id, msg, type, exiting: false }])
    timers.current[id] = setTimeout(() => remove(id), duration)
  }, [remove])

  useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout) }, [])

  return (
    <ToastCtx.Provider value={show}>
      <style>{toastCSS}</style>
      {children}
      {toasts.map(t => (
        <div key={t.id} className={t.exiting ? 'fs-toast-bg-exit' : 'fs-toast-bg'}>
          <div className={t.exiting ? 'fs-toast-exit' : 'fs-toast'}>
            <button className="fs-toast-close" onClick={() => remove(t.id)} aria-label="Close">&#10005;</button>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 24 }}>
              <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1.3 }}>
                {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'info' ? '✦' : '💧'}
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#c8973a' }}>
                  {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : t.type === 'info' ? 'Info' : 'FlowState'}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 15, fontWeight: 600, color: '#1a0f00', lineHeight: 1.4 }}>{t.msg}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

const toastCSS = `
.fs-toast-bg {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  animation: fs-toast-fade-in 0.2s ease forwards;
}
.fs-toast-bg-exit {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  animation: fs-toast-fade-in 0.2s ease reverse forwards;
}
.fs-toast {
  position: relative;
  background: #fdf6e3;
  border: 1px solid rgba(200,151,58,0.3);
  border-radius: 24px;
  padding: 28px 32px;
  width: min(440px, calc(100vw - 32px));
  box-shadow: 0 24px 64px rgba(26,15,0,0.3);
  animation: fs-toast-pop 0.35s cubic-bezier(0.34,1.3,0.64,1) forwards;
}
.fs-toast-exit {
  position: relative;
  background: #fdf6e3;
  border: 1px solid rgba(200,151,58,0.3);
  border-radius: 24px;
  padding: 28px 32px;
  width: min(440px, calc(100vw - 32px));
  box-shadow: 0 24px 64px rgba(26,15,0,0.3);
  animation: fs-toast-pop 0.25s ease reverse forwards;
}
.fs-toast-close {
  position: absolute; top: 12px; right: 14px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 50%;
  background: transparent;
  color: #5c3d1e; font-size: 15px; line-height: 1;
  cursor: pointer; transition: all 0.15s;
}
.fs-toast-close:hover {
  background: rgba(200,151,58,0.15);
  color: #1a0f00;
}
@keyframes fs-toast-fade-in {
  from { opacity: 0 }
  to   { opacity: 1 }
}
@keyframes fs-toast-pop {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
`