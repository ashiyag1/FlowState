export default function TopBorder() {
  return (
    <div
      style={{
        height: '40px',
        background: 'linear-gradient(to bottom, rgba(22, 14, 6, 0.4) 0%, transparent 100%)',
        position: 'relative',
        zIndex: 10,
        marginTop: '-20px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.35) 0%, transparent 80%)',
        }}
      />
      <div
        style={{
          textAlign: 'center',
          padding: '6px 0',
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.62rem',
            letterSpacing: '0.35rem',
            color: '#c9a84c',
            opacity: 0.55,
            textShadow: '0 0 8px rgba(201, 168, 76, 0.4)',
          }}
        >
          ✦ ✦ ✦
        </span>
      </div>
    </div>
  )
}