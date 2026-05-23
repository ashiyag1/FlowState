import { useSoundEffects } from '../../hooks/useSoundEffects'

export default function SankalpaDisplay({ sankalpa, isCompleted, onFulfill }) {
  const { playHabitSound } = useSoundEffects()

  const handleFulfill = () => {
    playHabitSound()
    onFulfill()
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '700px',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(27, 67, 50, 0.08) 0%, rgba(45, 106, 79, 0.06) 100%)'
          : 'linear-gradient(145deg, rgba(253, 246, 227, 0.96) 0%, rgba(248, 237, 210, 0.93) 100%)',
        border: isCompleted
          ? '1px solid rgba(45, 106, 79, 0.4)'
          : '1px solid rgba(201, 168, 76, 0.24)',
        borderRadius: '22px',
        padding: '2rem',
        boxShadow: '0 14px 36px rgba(92, 61, 30, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Completion Badge */}
        {isCompleted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            justifyContent: 'center',
            padding: '0.7rem 1.2rem',
            background: 'rgba(45, 106, 79, 0.12)',
            borderRadius: '20px',
            marginBottom: '1.2rem',
            animation: 'slideDown 0.5s ease-out'
          }}>
            <svg style={{
              width: '20px',
              height: '20px',
              color: '#2d6a4f',
              stroke: 'currentColor',
              strokeWidth: 2.5,
              fill: 'none'
            }} viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.9rem',
              color: '#2d6a4f',
              fontWeight: 500
            }}>
              Promise Fulfilled
            </span>
          </div>
        )}

        {/* Sankalpa Text */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          textAlign: 'center'
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem',
            fontWeight: 400,
            lineHeight: 1.6,
            color: '#5c3d1e',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            {sankalpa}
          </p>
        </div>

        {/* Fulfill Button */}
        {!isCompleted && (
          <button
            onClick={handleFulfill}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              padding: '1rem 1.8rem',
              background: 'linear-gradient(135deg, #E87722 0%, #c9a84c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontFamily: "'Cinzel', serif",
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 16px rgba(232, 119, 34, 0.25)',
              animation: 'slideUp 0.5s ease-out 0.3s both'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 10px 24px rgba(232, 119, 34, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 6px 16px rgba(232, 119, 34, 0.25)'
            }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
            <span>Fulfill Promise</span>
          </button>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '1.2rem 1.5rem',
            animation: 'fadeIn 0.6s ease-out 0.5s both'
          }}>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.95rem',
              color: 'rgba(45, 106, 79, 0.8)',
              textAlign: 'center',
              margin: 0,
              fontStyle: 'italic',
              lineHeight: 1.5
            }}>
              May this fulfilled intention ripple through your day.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          p {
            font-size: 1.4rem !important;
          }
        }

        @media (max-width: 480px) {
          p {
            font-size: 1.2rem !important;
          }
          button {
            padding: 0.85rem 1.5rem !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </div>
  )
}
