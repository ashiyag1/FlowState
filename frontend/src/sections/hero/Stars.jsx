export default function Stars() {
  const STAR_DATA = Array.from({ length: 50 }, (_, i) => ({
    cx: `${(i * 13.7 + 3) % 100}%`,
    cy: `${(i * 7.3 + 2) % 55}%`,
    r: 0.5 + (i % 3) * 0.5,
    dur: 2 + (i % 3),
    delay: (i * 0.4) % 4,
  }))
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
      {STAR_DATA.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white">
          <animate attributeName="opacity" values="0.15;0.85;0.15"
            dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}
