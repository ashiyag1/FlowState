import { useTheme } from '../../context/ThemeContext'

export default function QuoteBanner() {
  const { dark } = useTheme()

  return (
    <div style={styles.wrapper(dark)}>
      <span style={styles.mark}>"</span>
      <p style={styles.text(dark)}>
        When wisdom becomes a part of your daily life,
        life itself becomes your greatest teacher.
      </p>
      <span style={styles.diya}>🪔</span>
    </div>
  )
}

const styles = {
  wrapper: (dark) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.5rem 0.6rem',
    borderTop: dark ? '1px solid rgba(201,168,76,0.05)' : '1px solid rgba(201,168,76,0.08)',
    textAlign: 'center',
    flexShrink: 0,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  }),
  mark: {
    fontSize: '1.2rem',
    color: '#c9a84c',
    opacity: 0.2,
    fontFamily: 'serif',
    lineHeight: 1,
  },
  text: (dark) => ({
    fontSize: '0.75rem',
    fontFamily: '"Lora", serif',
    color: dark ? '#7a6a50' : '#8b6914',
    margin: 0,
    lineHeight: 1.4,
    fontStyle: 'italic',
  }),
  diya: { fontSize: '0.85rem', opacity: 0.7 },
}