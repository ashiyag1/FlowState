import { useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function TopicFilterBar({ topics, active, onChange }) {
  const { dark } = useTheme()
  const scrollRef = useRef(null)

  return (
    <div style={styles.wrapper}>
      <div ref={scrollRef} style={styles.bar}>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            style={{
              ...styles.pill,
              background: active === t
                ? (dark ? 'rgba(201,168,76,0.2)' : '#c9a84c')
                : 'transparent',
              color: active === t
                ? (dark ? '#e8d9b5' : '#fff')
                : (dark ? '#a09070' : '#5c3d1e'),
              borderColor: active === t
                ? (dark ? 'rgba(201,168,76,0.3)' : '#8b6914')
                : (dark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.15)'),
              boxShadow: active === t
                ? (dark ? '0 2px 8px rgba(201,168,76,0.08)' : '0 2px 8px rgba(139,105,20,0.15)')
                : 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    margin: '0.4rem 0 0.15rem',
    flexShrink: 0,
  },
  bar: {
    display: 'flex',
    gap: '0.4rem',
    overflowX: 'auto',
    padding: '0.2rem 0',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  pill: {
    padding: '0.3rem 0.85rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.72rem',
    fontFamily: '"Lora", serif',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    border: '1px solid',
    flexShrink: 0,
  },
}