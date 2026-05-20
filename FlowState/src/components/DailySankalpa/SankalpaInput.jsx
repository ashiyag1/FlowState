import { useState } from 'react'

export default function SankalpaInput({ inputValue, setInputValue, onCommit }) {
  const handleCommit = () => {
    if (!inputValue.trim()) return
    onCommit(inputValue.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleCommit()
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      animation: 'fadeIn 0.5s ease-out',
      position: 'relative',
    }}>
      {/* Falling petals */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="fs-petal" style={{
          width: `${8 + (i % 3) * 4}px`,
          height: `${12 + (i % 3) * 5}px`,
          left: `${10 + i * 11}%`,
          top: `-20px`,
          background: i % 2 === 0
            ? 'rgba(212, 96, 122, 0.55)'
            : 'rgba(232, 119, 34, 0.45)',
          animationDuration: `${6 + i * 1.3}s`,
          animationDelay: `${i * 0.9}s`,
        }} />
      ))}

      <div style={{
        width: '100%',
        maxWidth: '620px',
        position: 'relative',
        borderRadius: '24px',
        padding: '2px',
        background: 'linear-gradient(145deg, #c9a84c, #e8c97a, #8b6914, #c9a84c)',
        boxShadow: '0 20px 60px rgba(92, 61, 30, 0.28), 0 4px 12px rgba(92,61,30,0.15)',
      }}>
        {/* Inner parchment card */}
        <div style={{
          width: '100%',
          borderRadius: '22px',
          padding: '2rem 2rem 1.8rem',
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(255,248,220,0.6) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(239,217,168,0.5) 0%, transparent 55%),
            linear-gradient(160deg, #f5e6c0 0%, #ede0b5 30%, #e8d8a5 60%, #f0e4bb 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Noise/grain texture overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '22px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.4,
            pointerEvents: 'none',
          }} />

          {/* Sanskrit watermark text */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: "'Noto Serif Devanagari', 'Lora', serif",
              fontSize: '5.5rem',
              color: 'rgba(139, 105, 20, 0.07)',
              letterSpacing: '0.05em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}>
              ॐ सङ्कल्प
            </span>
          </div>

          {/* Decorative corner flourishes */}
          {['topleft','topright','bottomleft','bottomright'].map((pos) => (
            <svg key={pos} style={{
              position: 'absolute',
              top: pos.includes('top') ? 8 : 'auto',
              bottom: pos.includes('bottom') ? 8 : 'auto',
              left: pos.includes('left') ? 8 : 'auto',
              right: pos.includes('right') ? 8 : 'auto',
              width: 36, height: 36,
              opacity: 0.5,
              transform: `rotate(${pos === 'topright' ? 90 : pos === 'bottomright' ? 180 : pos === 'bottomleft' ? 270 : 0}deg)`,
            }} viewBox="0 0 40 40" fill="none">
              <path d="M4 4 Q4 20 20 20" stroke="#8b6914" strokeWidth="1" fill="none"/>
              <path d="M4 4 Q20 4 20 20" stroke="#8b6914" strokeWidth="1" fill="none"/>
              <circle cx="4" cy="4" r="2" fill="#c9a84c" opacity="0.7"/>
            </svg>
          ))}

          {/* Decorative border inside */}
          <div style={{
            position: 'absolute', inset: '10px', borderRadius: '16px',
            border: '1px solid rgba(201, 168, 76, 0.25)',
            pointerEvents: 'none',
          }} />

          {/* Lotus symbol at top */}
          <div style={{ textAlign: 'center', marginBottom: '0.3rem', position: 'relative', zIndex: 1 }}>
            <svg width="32" height="20" viewBox="0 0 60 36" fill="none" style={{ opacity: 0.65 }}>
              <ellipse cx="30" cy="28" rx="8" ry="10" fill="rgba(212,96,122,0.6)" transform="rotate(-15 30 28)"/>
              <ellipse cx="30" cy="28" rx="8" ry="10" fill="rgba(212,96,122,0.6)"/>
              <ellipse cx="30" cy="28" rx="8" ry="10" fill="rgba(212,96,122,0.6)" transform="rotate(15 30 28)"/>
              <ellipse cx="30" cy="28" rx="5" ry="8" fill="rgba(232,119,34,0.5)" transform="rotate(-30 30 28)"/>
              <ellipse cx="30" cy="28" rx="5" ry="8" fill="rgba(232,119,34,0.5)" transform="rotate(30 30 28)"/>
              <circle cx="30" cy="26" r="4" fill="rgba(201,168,76,0.8)"/>
            </svg>
          </div>

          {/* Thin gold line divider under lotus */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            marginBottom: '1.4rem',
            position: 'relative', zIndex: 1,
          }} />

          {/* Label */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: '0.4rem', marginBottom: '1.4rem',
            textAlign: 'center', position: 'relative', zIndex: 1,
          }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.25rem', fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#4a2c0a',
              textShadow: '0 1px 2px rgba(255,255,255,0.4)',
            }}>Daily Sankalpa</span>
            <span style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.88rem',
              color: '#7a5c1a',
              fontStyle: 'italic',
            }}>Your sacred intention for today</span>
          </div>

          {/* Input with quill icon */}
          <div style={{ position: 'relative', marginBottom: '1.1rem', zIndex: 1 }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What is your deep intention for today?"
              maxLength={120}
              autoFocus
              style={{
                width: '100%',
                padding: '0.95rem 3rem 0.95rem 1.2rem',
                border: '1.5px solid rgba(201, 168, 76, 0.45)',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(255,248,230,0.85) 0%, rgba(245,235,200,0.75) 100%)',
                fontFamily: "'Lora', serif",
                fontSize: '1rem',
                fontStyle: 'italic',
                color: '#4a2c0a',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 8px rgba(139,105,20,0.08)',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.75)'
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(139,105,20,0.08), 0 0 18px rgba(201,168,76,0.2)'
                e.target.style.background = 'linear-gradient(135deg, rgba(255,252,238,0.95) 0%, rgba(248,240,210,0.9) 100%)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.45)'
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(139,105,20,0.08)'
                e.target.style.background = 'linear-gradient(135deg, rgba(255,248,230,0.85) 0%, rgba(245,235,200,0.75) 100%)'
              }}
            />
            {/* Quill feather icon */}
            <svg style={{
              position: 'absolute', right: '14px', top: '50%',
              transform: 'translateY(-50%)',
              width: '20px', height: '20px',
              opacity: 0.45, pointerEvents: 'none',
            }} viewBox="0 0 24 24" fill="none">
              <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76z" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8L2 22" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17.5 15H9" stroke="#8b6914" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Footer row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: '1rem',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.78rem',
              color: 'rgba(122, 92, 26, 0.55)',
            }}>
              {inputValue.length}/120
            </span>

            {/* Diya Commit Button */}
            <button
              onClick={handleCommit}
              disabled={!inputValue.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.55rem',
                padding: '0.7rem 1.6rem',
                background: !inputValue.trim()
                  ? 'linear-gradient(135deg, rgba(139,105,20,0.45) 0%, rgba(92,61,30,0.4) 100%)'
                  : 'linear-gradient(135deg, #7a4a10 0%, #5c3010 50%, #8b5a1a 100%)',
                color: !inputValue.trim() ? 'rgba(255,235,180,0.6)' : '#f5e0a0',
                border: `1px solid ${!inputValue.trim() ? 'rgba(139,105,20,0.3)' : 'rgba(201,168,76,0.5)'}`,
                borderRadius: '10px',
                fontFamily: "'Cinzel', serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                cursor: !inputValue.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: !inputValue.trim()
                  ? 'none'
                  : '0 6px 20px rgba(92,48,16,0.4), inset 0 1px 0 rgba(255,220,120,0.2)',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                if (!inputValue.trim()) return
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(92,48,16,0.5), inset 0 1px 0 rgba(255,220,120,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = inputValue.trim()
                  ? '0 6px 20px rgba(92,48,16,0.4), inset 0 1px 0 rgba(255,220,120,0.2)'
                  : 'none'
              }}
            >
              {/* Diya flame icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <ellipse cx="12" cy="18" rx="6" ry="3" fill="rgba(201,168,76,0.7)"/>
                <path d="M12 15 C10 12, 8 9, 11 6 C11 9, 14 9, 13 6 C16 9, 14 12, 12 15Z"
                  fill="#E87722" opacity="0.9"/>
                <path d="M12 14 C11 12, 10 10, 11.5 8 C11.5 10, 13 10, 12.5 8 C14 10, 13 12, 12 14Z"
                  fill="#ffd060" opacity="0.8"/>
              </svg>
              Commit
            </button>
          </div>

          {/* Bottom thin gold divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
            marginTop: '1.2rem',
            position: 'relative', zIndex: 1,
          }} />

          {/* Bottom decorative dots */}
          <div style={{
            textAlign: 'center', marginTop: '0.7rem',
            fontFamily: "'Cinzel', serif",
            fontSize: '0.5rem', letterSpacing: '0.5em',
            color: 'rgba(139,105,20,0.4)',
            position: 'relative', zIndex: 1,
          }}>
            ✦ ✦ ✦
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fs-petal {
          position: absolute;
          pointer-events: none;
          border-radius: 60% 40% 60% 40% / 60% 60% 40% 40%;
          animation: petalFall linear infinite;
        }
        @keyframes petalFall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 0.85; }
          80%  { opacity: 0.65; }
          100% { transform: translateY(400px) rotate(660deg) translateX(50px); opacity: 0; }
        }
        input::placeholder {
          color: rgba(139, 105, 20, 0.45);
          font-style: italic;
        }
        @media (max-width: 480px) {
          input { font-size: 0.9rem !important; }
        }
      `}</style>
    </div>
  )
}