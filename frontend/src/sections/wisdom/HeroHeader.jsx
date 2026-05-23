import { useTheme } from '../../context/ThemeContext'

export default function HeroHeader() {
  const { dark } = useTheme()

  return (
    <div style={styles.hero}>
      <div>
        <h1 style={styles.title(dark)}>Wisdom</h1>
        <p style={styles.subtitle(dark)}>Timeless wisdom for modern minds.</p>
      </div>

      <div style={styles.searchRow(dark)}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          placeholder="Search topics, issues, scriptures..."
          style={styles.searchInput(dark)}
        />
        <span style={styles.searchKbd(dark)}>⌘K</span>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '1rem',
    flexShrink: 0,
  },
  title: (dark) => ({
    fontSize: '1.35rem',
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    color: dark ? '#e8d9b5' : '#5c3d1e',
    margin: 0,
    lineHeight: 1.2,
    letterSpacing: '0.02em',
  }),
  subtitle: (dark) => ({
    fontSize: '0.75rem',
    color: dark ? '#a09070' : '#8b6914',
    margin: '0.1rem 0 0',
    fontFamily: '"Lora", serif',
    fontStyle: 'italic',
  }),
  searchRow: (dark) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.75rem',
    background: dark ? 'rgba(40,30,15,0.35)' : 'rgba(255,255,255,0.7)',
    borderRadius: '10px',
    border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid rgba(201,168,76,0.18)',
    minWidth: '220px',
    maxWidth: '320px',
    backdropFilter: 'blur(6px)',
  }),
  searchIcon: { fontSize: '0.75rem', opacity: 0.5 },
  searchInput: (dark) => ({
    border: 'none',
    background: 'transparent',
    outline: 'none',
    flex: 1,
    fontSize: '0.75rem',
    fontFamily: '"Lora", serif',
    color: dark ? '#e8d9b5' : '#5c3d1e',
    '::placeholder': { color: dark ? '#6a5a40' : '#b0a090' },
  }),
  searchKbd: (dark) => ({
    fontSize: '0.55rem',
    color: dark ? '#6a5a40' : '#b0a090',
    padding: '0.1rem 0.35rem',
    background: dark ? '#2a1e10' : '#e8ddd0',
    borderRadius: '4px',
    fontFamily: 'monospace',
  }),
}