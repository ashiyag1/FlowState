export default function MandalaSVG() {
  return (
    <svg viewBox="0 0 360 360" fill="none" style={{ width: '100%', height: '100%' }}>
      {[0, 30, 60, 90, 120, 150].map(r => (
        <g key={r} transform={`rotate(${r} 180 180)`}>
          <ellipse cx="180" cy="90" rx="20" ry="90" stroke="#c9a84c" strokeWidth="1" />
        </g>
      ))}
      <circle cx="180" cy="180" r="160" stroke="#c9a84c" strokeWidth="0.8" />
      <circle cx="180" cy="180" r="110" stroke="#c9a84c" strokeWidth="0.5" />
      <circle cx="180" cy="180" r="60"  stroke="#c9a84c" strokeWidth="0.8" />
      <circle cx="180" cy="180" r="18"  fill="#c9a84c" opacity="0.3" />
    </svg>
  )
}
