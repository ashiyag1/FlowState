export default function SectionHeading({ eyebrow, title, accent, accentColor = 'var(--saffron)' }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <p style={{
        fontFamily: "'Cinzel',serif",
        fontSize: '0.68rem',
        letterSpacing: '0.28em',
        color: 'var(--bark-lt)',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {'\u2726'} {eyebrow} {'\u2726'}
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 'clamp(1.7rem,4vw,2.7rem)',
        fontWeight: 500,
        color: 'var(--bark)',
        lineHeight: 1.25,
      }}>
        {title}{' '}
        {accent && <em style={{ color: accentColor, fontStyle: 'italic' }}>{accent}</em>}
      </h2>
    </div>
  )
}
