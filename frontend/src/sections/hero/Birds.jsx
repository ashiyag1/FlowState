export default function Birds() {
  const BIRD_DATA = [
    { from: '-5% 18%',  to: '108% 13%', dur: 16, delay: 0 },
    { from: '-12% 30%', to: '112% 24%', dur: 21, delay: 4 },
    { from: '2% 42%',   to: '115% 35%', dur: 26, delay: 8 },
  ]
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
      {BIRD_DATA.map((b, i) => (
        <path key={i} d="M0,-4 Q6,-8 12,-4 Q6,-1 0,-4" fill="rgba(253,246,227,0.5)">
          <animateTransform attributeName="transform" type="translate"
            from={b.from} to={b.to}
            dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  )
}
