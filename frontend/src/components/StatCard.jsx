import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function StatCard({
  icon, emoji, type, value, unit, label, sub, to, onClick, pct, bottomSlot,
}) {
  const { dark } = useTheme()

  return (
    <div className="fs-gold-corner-card fs-sandstone-tablet" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '235px', position: 'relative' }}>
      {to && (
        <Link
          to={to}
          onClick={onClick}
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            fontFamily: "'Lora', serif",
            fontSize: '0.78rem',
            color: type === 'streak' ? '#c9a84c' : (dark ? '#8aaa7a' : '#6b8f6b'),
            textDecoration: 'none',
          }}
        >
          View →
        </Link>
      )}

      <div style={{ marginBottom: 4, flexShrink: 0 }}>
        {icon ?? (emoji && <span style={{ fontSize: '2rem' }}>{emoji}</span>)}
      </div>

      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '2.15rem',
        fontWeight: 600,
        color: dark ? '#e8d9b5' : '#5C3D1E',
        lineHeight: 1,
      }}>
        {value}{' '}
        <span style={{
          fontFamily: "'Lora', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: dark ? '#c9b080' : '#8B5E2F',
        }}>{unit}</span>
      </div>

      <div style={{
        fontFamily: "'Lora', serif",
        fontSize: '0.9rem',
        color: dark ? '#c9b080' : '#8B5E2F',
        marginTop: 3,
      }}>{label}</div>

      {sub && (
        <div style={{
          fontFamily: "'Lora', serif",
          fontSize: '0.76rem',
          color: dark ? '#8a7a60' : '#b08968',
          marginTop: 5,
        }}>{sub}</div>
      )}

      {pct !== undefined && (
        <div style={{ marginTop: 'auto', paddingTop: 12 }}>
          <div style={{
            height: 6,
            background: dark ? '#3a2a10' : '#e8dcc8',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: '#5b9bd5',
              borderRadius: 4,
            }} />
          </div>
          <div style={{
            fontSize: '0.6rem',
            color: '#5b9bd5',
            textAlign: 'right',
            marginTop: 2,
            fontFamily: "'Lora', serif",
          }}>{pct}%</div>
        </div>
      )}

      {bottomSlot && (
        <div style={{ marginTop: pct !== undefined ? 6 : 'auto', paddingTop: 8 }}>
          {bottomSlot}
        </div>
      )}
    </div>
  )
}
