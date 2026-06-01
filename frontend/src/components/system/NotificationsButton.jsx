import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell } from 'lucide-react'
import { usePushNotifications } from '../../hooks/usePushNotifications'

import { useTheme } from '../../context/ThemeContext'

const ITEMS = [
  { key: 'journal',  emoji: '📓', label: 'Journal Reminder',  desc: 'Reflect & write', defaultTime: '09:00' },
  { key: 'habit',    emoji: '✅', label: 'Habit Check',        desc: 'Evening review', defaultTime: '20:00' },
  { key: 'hydrate',  emoji: '💧', label: 'Hydration Reminder', desc: 'Every 45 min',   defaultTime: '45',   interval: true },
  { key: 'sleep',    emoji: '🌙', label: 'Sleep Reminder',     desc: 'Wind down time', defaultTime: '22:30' },
  { key: 'wisdom',   emoji: '🧘', label: 'Daily Wisdom',       desc: 'Morning inspiration', defaultTime: '07:00' },
]

const G = '#c8973a'
const GL = '#e8b84b'
const B = '#1a0f00'
const BR = '#5c3d1e'
const CR = '#fdf6e3'

export default function NotificationsButton() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { schedule, updateSchedule, requestPermission } = usePushNotifications()
  const { dark } = useTheme()

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') { setOpen(false); setEditing(null) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const toggle = (key) => {
    updateSchedule(key, { enabled: !schedule[key]?.enabled })
  }

  const request = async () => {
    await requestPermission()
  }

  const saveTime = (key, val) => {
    if (ITEMS.find(i => i.key === key)?.interval) {
      const mins = parseInt(val, 10)
      if (mins > 0 && mins <= 480) updateSchedule(key, { intervalMins: mins })
    } else {
      const [h, m] = val.split(':').map(Number)
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) updateSchedule(key, { hour: h, minute: m })
    }
    setEditing(null)
  }

  const anyOn = schedule && Object.values(schedule).some(s => s?.enabled)

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(212,168,42,0.22)',
          background: anyOn
            ? (dark ? 'rgba(200,151,58,0.15)' : 'rgba(200,151,58,0.12)')
            : (dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)'),
          color: anyOn ? G : (dark ? '#d9b96a' : '#6b4c12'),
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: '0 1px 6px rgba(160,100,10,0.04), inset 0 1px 0 rgba(232,199,122,0.08)',
        }}
        title="Notification Settings"
        aria-label="Notifications"
      >
        <Bell size={13} />
      </button>

      {open && createPortal(
        <>
          <div onClick={() => { setOpen(false); setEditing(null) }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999999,
              background: 'rgba(10,5,0,0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'nm-fade 0.25s ease forwards',
            }}
          />
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 999999,
              width: 'min(460px, calc(100vw - 32px))',
              maxHeight: 'min(80vh, 560px)',
              display: 'flex', flexDirection: 'column',
              background: CR, borderRadius: 24,
              border: '1px solid rgba(200,151,58,0.25)',
              boxShadow: '0 32px 80px rgba(10,5,0,0.4), 0 0 0 1px rgba(200,151,58,0.08)',
              animation: 'nm-pop 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
            }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '28px 28px 0',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G }}>Tarang‑FlowState</p>
                <h2 style={{ margin: '4px 0 0', fontSize: 23, fontWeight: 700, color: B, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.01em' }}>Notification Settings</h2>
              </div>
              <button onClick={() => { setOpen(false); setEditing(null) }}
                style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                  border: 'none', background: 'transparent', color: BR,
                  fontSize: 17, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.background = `${G}20`; e.target.style.color = B }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = BR }}
                aria-label="Close"
              >&#10005;</button>
            </div>

            <div style={{ padding: '14px 28px 0' }}>
              {(!schedule?.journal?.hour && !schedule?.habit?.hour) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: `${G}12`, border: `1px solid ${G}35`,
                  borderRadius: 14, padding: '10px 14px', fontSize: 12, color: BR,
                }}>
                  <span style={{ fontSize: 16 }}>🔔</span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>Enable browser notifications to get reminders in background.</span>
                  <button onClick={request}
                    style={{
                      flexShrink: 0, background: `linear-gradient(135deg,${G},${GL})`,
                      border: `1px solid ${G}`, borderRadius: 20, padding: '5px 14px',
                      fontSize: 11, fontWeight: 700, color: B, cursor: 'pointer',
                      fontFamily: 'inherit', letterSpacing: '0.03em',
                    }}
                  >Allow</button>
                </div>
              )}
            </div>

            <div style={{ padding: '10px 28px 20px', overflowY: 'auto', flex: 1 }}>
              {ITEMS.map(item => {
                const s = schedule[item.key]
                const on = s?.enabled
                const display = item.interval
                  ? `Every ${s?.intervalMins || 45} min`
                  : `${String(s?.hour ?? 9).padStart(2, '0')}:${String(s?.minute ?? 0).padStart(2, '0')}`
                const isEditing = editing === item.key
                return (
                  <div key={item.key}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 0', borderBottom: `1px solid ${G}18`,
                    }}
                  >
                    <button onClick={() => toggle(item.key)}
                      style={{
                        width: 42, height: 24, borderRadius: 12,
                        border: `1.5px solid ${G}`,
                        background: on ? `linear-gradient(135deg,${G},${GL})` : '#e7d7b8',
                        cursor: 'pointer', position: 'relative', flexShrink: 0,
                        display: 'flex', alignItems: 'center',
                        transition: 'background 0.25s',
                        boxShadow: on ? `0 2px 8px ${G}35` : '0 1px 3px rgba(0,0,0,0.08)',
                      }}
                      aria-label={`Toggle ${item.label}`}
                    >
                      <span style={{
                        position: 'absolute', top: 2.5,
                        left: on ? 21 : 3,
                        width: 17, height: 17, borderRadius: '50%',
                        background: '#fff', border: `1px solid ${GL}`,
                        transition: 'left 0.25s cubic-bezier(0.34,1.4,0.64,1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }} />
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: B }}>{item.emoji} {item.label}</div>
                      {isEditing ? (
                        <EditRow item={item} s={s} onSave={saveTime} onCancel={() => setEditing(null)} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11.5, color: BR, opacity: 0.7, marginTop: 1 }}>{display} · {item.desc}</span>
                          <button onClick={() => setEditing(item.key)}
                            style={{
                              background: 'none', border: `1px solid ${G}30`, borderRadius: 6,
                              padding: '1px 6px', fontSize: 10.5, color: BR, cursor: 'pointer',
                              fontFamily: 'inherit', lineHeight: '1.6',
                            }}
                            onMouseEnter={e => { e.target.style.borderColor = G; e.target.style.color = B }}
                            onMouseLeave={e => { e.target.style.borderColor = `${G}30`; e.target.style.color = BR }}
                          >✏️ Edit</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ padding: '0 28px 18px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#9a7a50' }}>🌿 Times are in your local timezone</p>
            </div>
          </div>
          <style>{`
            @keyframes nm-fade { from { opacity: 0 } to { opacity: 1 } }
            @keyframes nm-pop { from { opacity: 0; transform: translate(-50%, -50%) scale(0.93) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
          `}</style>
        </>,
        document.body
      )}
    </>
  )
}

function EditRow({ item, s, onSave, onCancel }) {
  const [val, setVal] = useState(
    item.interval ? String(s?.intervalMins || 45) : `${String(s?.hour ?? 9).padStart(2, '0')}:${String(s?.minute ?? 0).padStart(2, '0')}`
  )

  const input = (
    <input
      type={item.interval ? 'number' : 'time'}
      value={val}
      min={item.interval ? 1 : undefined}
      max={item.interval ? 480 : undefined}
      step={item.interval ? 5 : undefined}
      onChange={e => setVal(e.target.value)}
      style={{
        width: item.interval ? 72 : 110,
        padding: '5px 10px', borderRadius: 8,
        border: `1.5px solid ${G}`,
        background: '#fff', fontSize: 12.5,
        fontFamily: 'inherit', color: B, outline: 'none',
      }}
    />
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
      {input}
      <span style={{ fontSize: 10.5, color: BR }}>{item.interval ? 'minutes' : ''}</span>
      <button onClick={() => onSave(item.key, val)}
        style={{
          background: `linear-gradient(135deg,${G},${GL})`,
          border: `1px solid ${G}`, borderRadius: 8,
          padding: '4px 12px', fontSize: 11, fontWeight: 700,
          color: B, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >Save</button>
      <button onClick={onCancel}
        style={{
          background: 'transparent', border: `1px solid ${BR}40`, borderRadius: 8,
          padding: '4px 12px', fontSize: 11, color: BR,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >Cancel</button>
    </div>
  )
}
