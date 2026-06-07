const IS_DEBUG = typeof window !== 'undefined' && (
  window.location.search.includes('debug=particles') ||
  localStorage.getItem('debug-particles')
)

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 640

const PETAL_BASE = Array.from({ length: IS_MOBILE ? 6 : 14 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3) % 100}%`,
  size: 9 + (i % 5) * 2.5,
  dur: 8 + (i % 4) * 2.5,
  delay: (i * 1.3) % 10,
  colorIdx: i % 3,
  opacity: 0.7 + (i % 3) * 0.15,
}))

export default function FloatingPetals({ colors }) {
  if (IS_DEBUG) console.log('[DEBUG] FloatingPetals mounted | colors:', colors)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 5,
      pointerEvents: 'none',
      overflow: 'hidden',
      outline: IS_DEBUG ? '2px dashed red' : undefined,
    }}>
      {PETAL_BASE.map(p => (
        <div
          key={p.id}
          className="fs-petal"
          style={{
            left: p.left,
            top: '-40px',
            width: p.size,
            height: p.size * 0.65,
            background: colors[p.colorIdx],
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
