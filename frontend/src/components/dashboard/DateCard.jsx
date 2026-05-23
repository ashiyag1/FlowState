import realCalendarImg from '../../assets/dashboard/real-calendar.webp'

export default function DateCard() {
  const now = new Date()

  const day = now.toLocaleDateString('en-IN', {
    day: 'numeric',
  })

  const month = now.toLocaleDateString('en-IN', {
    month: 'short',
  })

  const weekday = now.toLocaleDateString('en-IN', {
    weekday: 'long',
  })

  return (
    <div className="fs-dash-card fs-date-card">
      <a
        href="#"
        style={{
          position: 'absolute',
          top: 16,
          right: 18,
          fontFamily: "'Lora', serif",
          fontSize: '0.78rem',
          color: '#7b5ea7',
          textDecoration: 'none',
        }}
      >
        View &rarr;
      </a>

      {/* Calendar Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 36% 28%, #f8bfd0 0%, #d06b91 58%, #a95182 100%)',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          marginBottom: 28,
          flexShrink: 0,
        }}
        className="fs-date-icon"
      >
        <img
          src={realCalendarImg}
          alt="Calendar"
          className="fs-date-icon-img"
        />
      </div>

      {/* Date */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.35rem',
          fontWeight: 600,
          color: 'var(--bark)',
          lineHeight: 1,
        }}
      >
        {day}{' '}
        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '1.05rem',
            fontWeight: 400,
            color: 'var(--bark-lt)',
          }}
        >
          {month}
        </span>
      </div>

      {/* Weekday */}
      <div
        style={{
          fontFamily: "'Lora', serif",
          fontSize: '0.86rem',
          color: 'var(--bark-lt)',
          marginTop: 4,
        }}
      >
        {weekday}
      </div>

      {/* Sankalp */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 14,
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            color: '#9b7ebd',
          }}
        >
          Today's Sankalp
        </div>

        <div
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '0.74rem',
            color: 'var(--bark-lt)',
            marginTop: 3,
          }}
        >
          Choose peace, choose progress.
        </div>
      </div>
    </div>
  )
}