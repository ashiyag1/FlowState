import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'

export default function WisdomStreak() {
  const { getStreakDays, getStreakCount } = useWisdom()
  const { dark } = useTheme()
  const streakDays = getStreakDays()
  const count = getStreakCount()

  return (
    <div style={styles.card(dark)}>
      <div style={styles.headerRow}>
        <span style={styles.fire}>🔥</span>
        <div>
          <div style={styles.count(dark)}>{count}</div>
          <div style={styles.label(dark)}>day streak</div>
        </div>
      </div>
      <div style={styles.dots}>
        {streakDays.map((day, i) => (
          <div key={i} style={styles.dotWrap}>
            <div
              style={{
                ...styles.dot(dark),
                ...(day.done ? styles.dotActive : {}),
              }}
            >
              {day.done && <span style={styles.check}>✓</span>}
            </div>
            <div style={styles.dayLabel(dark)}>{day.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: (dark) => ({
    padding: '0.7rem',
    background: dark ? 'rgba(40,30,15,0.2)' : 'rgba(255,255,255,0.35)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.08)',
    borderRadius: '10px',
  }),
  headerRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.6rem',
  },
  fire: { fontSize: '1rem' },
  count: (dark) => ({
    fontSize: '0.85rem',
    fontWeight: 700,
    color: dark ? '#e8d9b5' : '#5c3d1e',
    lineHeight: 1.1,
  }),
  label: (dark) => ({
    fontSize: '0.6rem',
    color: dark ? '#7a6a50' : '#8a7a60',
    lineHeight: 1.1,
  }),
  dots: {
    display: 'flex',
    gap: '0.3rem',
    justifyContent: 'space-between',
  },
  dotWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  dot: (dark) => ({
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: dark ? '#2a1e10' : '#f0ece0',
    border: dark ? '1.5px solid #4a3a20' : '1.5px solid #e0d8c8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: dark ? '#e8d9b5' : '#5c3d1e',
  }),
  check: {
    fontSize: '0.5rem',
  },
  dotActive: {
    background: '#c9a84c',
    border: '1.5px solid #8b6914',
    color: '#fff',
  },
  dayLabel: (dark) => ({
    fontSize: '0.55rem',
    color: dark ? '#5a4a30' : '#a09070',
  }),
}