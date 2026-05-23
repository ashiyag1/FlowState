export default function OrnateDivider({ symbol = '\u2726' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '0 auto 2.2rem', maxWidth: 560 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
      <span style={{ fontSize: '1.25rem', color: '#c9a84c', textShadow: '0 0 12px rgba(201,168,76,0.6)' }}>
        {symbol}
      </span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
    </div>
  )
}
