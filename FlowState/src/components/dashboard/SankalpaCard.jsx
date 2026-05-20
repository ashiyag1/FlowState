import { useState, useEffect } from 'react'
import { useSoundEffects } from '../../hooks/useSoundEffects'

export default function SankalpaCard() {
  const { playHabitSound } = useSoundEffects()

  const getTodayDate = () =>
    new Date().toISOString().split('T')[0]

  const [sankalpa, setSankalpa] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [isCompleted, setCompleted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('daily_sankalpa')

      if (raw) {
        const {
          text,
          isCompleted: done,
          dateSet,
        } = JSON.parse(raw)

        if (dateSet === getTodayDate()) {
          setSankalpa(text)
          setCompleted(done)
        } else {
          localStorage.removeItem('daily_sankalpa')
        }
      }
    } catch {
      localStorage.removeItem('daily_sankalpa')
    }

    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (sankalpa) {
      localStorage.setItem(
        'daily_sankalpa',
        JSON.stringify({
          text: sankalpa,
          isCompleted,
          dateSet: getTodayDate(),
        })
      )
    } else {
      localStorage.removeItem('daily_sankalpa')
    }
  }, [sankalpa, isCompleted, mounted])

  const handleCommit = () => {
    if (!inputVal.trim()) return

    setSankalpa(inputVal.trim())
    setInputVal('')
  }

  const handleFulfill = () => {
    playHabitSound()
    setCompleted(true)
  }

  if (!mounted) return null

  return (
    <div
      className="fs-dash-card"
      style={{
        background: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at 15% 20%, rgba(255,245,210,0.7) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 80%, rgba(220,185,110,0.45) 0%, transparent 50%),
          linear-gradient(155deg, #f5e4b8 0%, #edd89a 35%, #e8d090 60%, #f2e2b2 100%)
        `,
        border: '1px solid rgba(180, 140, 50, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.2rem 1.3rem 1.1rem',
        overflow: 'hidden',
      }}
    >
      {/* Sanskrit watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '4.8rem',
            color: 'rgba(139, 100, 20, 0.07)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            letterSpacing: '0.04em',
          }}
        >
          ॐ सङ्कल्प
        </span>
      </div>

      {/* Decorative corners */}
      {[
        { top: 8, left: 9, rotate: 0 },
        { top: 8, right: 9, rotate: 90 },
        { bottom: 8, right: 9, rotate: 180 },
        { bottom: 8, left: 9, rotate: 270 },
      ].map((pos, i) => (
        <svg
          key={i}
          style={{
            position: 'absolute',
            width: 22,
            height: 22,
            opacity: 0.38,
            transform: `rotate(${pos.rotate}deg)`,
            ...pos,
          }}
          viewBox="0 0 28 28"
          fill="none"
        >
          <path
            d="M4 4 Q4 16 14 14 Q16 4 4 4Z"
            fill="#8b6914"
          />

          <path
            d="M4 4 L14 14"
            stroke="#8b6914"
            strokeWidth="0.8"
          />
        </svg>
      ))}

      {/* Inner border */}
      <div
        style={{
          position: 'absolute',
          inset: 9,
          borderRadius: 14,
          border: '1px solid rgba(180,140,50,0.22)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '0.7rem',
        }}
      >
        <div style={{ marginBottom: '0.4rem' }}>
          <svg
            width="28"
            height="18"
            viewBox="0 0 56 32"
            fill="none"
            style={{ opacity: 0.6 }}
          >
            <ellipse
              cx="28"
              cy="25"
              rx="7"
              ry="9"
              fill="rgba(212,96,122,0.55)"
              transform="rotate(-12 28 25)"
            />

            <ellipse
              cx="28"
              cy="25"
              rx="7"
              ry="9"
              fill="rgba(212,96,122,0.55)"
            />

            <ellipse
              cx="28"
              cy="25"
              rx="7"
              ry="9"
              fill="rgba(212,96,122,0.55)"
              transform="rotate(12 28 25)"
            />

            <ellipse
              cx="28"
              cy="25"
              rx="4.5"
              ry="7"
              fill="rgba(232,119,34,0.45)"
              transform="rotate(-28 28 25)"
            />

            <ellipse
              cx="28"
              cy="25"
              rx="4.5"
              ry="7"
              fill="rgba(232,119,34,0.45)"
              transform="rotate(28 28 25)"
            />

            <circle
              cx="28"
              cy="23"
              r="3.5"
              fill="rgba(201,168,76,0.75)"
            />
          </svg>
        </div>

        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            color: '#8b6914',
            marginBottom: '0.15rem',
          }}
        >
          DAILY SANKALPA
        </div>

        <div
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, rgba(180,140,50,0.5), rgba(180,140,50,0.15))',
            marginBottom: '0.6rem',
          }}
        />
      </div>

      {/* BODY */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          gap: '1rem',
        }}
      >
        {sankalpa ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  color: '#5c3d1e',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {sankalpa}
              </p>

              {!isCompleted ? (
                <button
                  onClick={handleFulfill}
                  style={{
                    padding: '0.85rem 1.6rem',
                    background: 'linear-gradient(135deg, #E87722 0%, #c9a84c 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    boxShadow: '0 6px 16px rgba(232, 119, 34, 0.25)',
                  }}
                >
                  Fulfill Promise
                </button>
              ) : (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    background: 'rgba(45, 106, 79, 0.08)',
                    color: '#2d6a4f',
                    fontFamily: "'Lora', serif",
                    fontSize: '0.95rem',
                    lineHeight: 1.4,
                  }}
                >
                  Promise fulfilled for today.
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Set your intention for today"
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(180,140,50,0.35)',
                fontFamily: "'Lora', serif",
                fontSize: '0.98rem',
                outline: 'none',
              }}
            />
            <button
              onClick={handleCommit}
              disabled={!inputVal.trim()}
              style={{
                padding: '0.85rem 1.6rem',
                background: inputVal.trim()
                  ? 'linear-gradient(135deg, #c9a84c 0%, #8b6914 100%)'
                  : 'rgba(180,140,50,0.35)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: inputVal.trim() ? 'pointer' : 'not-allowed',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              Commit Intention
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
