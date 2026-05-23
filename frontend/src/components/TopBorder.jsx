export default function TopBorder() {
  return (
    <>
      <div
        style={{
          height: 8,
          background:
            'linear-gradient(90deg, var(--saffron), var(--gold), var(--forest), var(--gold), var(--saffron))',
        }}
      />

      <div
        style={{
          textAlign: 'center',
          padding: '5px 0',
          background:
            'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            color: '#8b6914',
          }}
        >
          ✦ ✦ ✦
        </span>
      </div>
    </>
  )
}