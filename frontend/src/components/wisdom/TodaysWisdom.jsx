import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import ManuscriptCard from './ManuscriptCard'

export default function TodaysWisdom({ wisdom }) {
  const { savedWisdom, toggleSavedWisdom } = useWisdom()
  const { dark } = useTheme()
  const isSaved = savedWisdom.includes('today')

  return (
    <div style={styles.container}>
      <ManuscriptCard>
        <span style={styles.prefix}>🪔</span>
        <div style={styles.textGroup}>
          <p style={styles.sanskrit(dark)}>{wisdom.sanskrit}</p>
          <div style={styles.meta}>
            <span style={styles.english(dark)}>{wisdom.english}</span>
            <span style={styles.source(dark)}>— {wisdom.source}</span>
          </div>
        </div>
        <div style={styles.actions}>
          <button style={styles.actionBtn(dark)} onClick={() => toggleSavedWisdom('today')}>
            {isSaved ? '❤️' : '🤍'}
          </button>
          <button style={styles.actionBtn(dark)}>↗</button>
        </div>
      </ManuscriptCard>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  prefix: {
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    opacity: 0.3,
    flexShrink: 0,
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.1rem',
    flex: 1,
    minWidth: 0,
  },
  sanskrit: (dark) => ({
    margin: 0,
    fontSize: 'clamp(0.8rem, 1.6vw, 1.1rem)',
    fontFamily: '"Lora", serif',
    fontStyle: 'italic',
    color: dark ? '#f0e0c0' : '#3a2510',
    lineHeight: 1.35,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  }),
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  english: (dark) => ({
    fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
    fontFamily: '"Lora", serif',
    color: dark ? '#d4c090' : '#4a3018',
    lineHeight: 1.35,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  }),
  source: (dark) => ({
    fontSize: 'clamp(0.55rem, 1vw, 0.7rem)',
    color: dark ? '#a09070' : '#8b6914',
    fontStyle: 'italic',
    fontFamily: '"Lora", serif',
    opacity: 0.8,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }),
  actions: {
    display: 'flex',
    gap: '0.3rem',
    flexShrink: 0,
    paddingLeft: '0.5rem',
  },
  actionBtn: (dark) => ({
    padding: '0.25rem 0.5rem',
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    color: '#c9a84c',
    transition: 'background 0.2s',
  }),
}