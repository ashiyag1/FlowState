export default function IssueCard({ issue, dark, onClick }) {
  return (
    <div style={styles.card(dark)} onClick={onClick}>
      <div style={styles.left}>
        <span style={{
          ...styles.tag,
          background: issue.color + '22',
          color: issue.color,
        }}>
          {issue.tag}
        </span>
        <span style={styles.title(dark)}>{issue.title}</span>
      </div>
      <p style={styles.desc(dark)}>{issue.summary}</p>
      <div style={styles.right}>
        <span style={styles.approach(issue)}>{issue.approach}</span>
        <span style={styles.arrow}>→</span>
      </div>
    </div>
  )
}

const styles = {
  card: (dark) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    background: dark ? 'rgba(40,30,15,0.25)' : 'rgba(255,255,255,0.5)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.12)',
    borderRadius: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '72px',
    boxSizing: 'border-box',
  }),
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    minWidth: 0,
    width: '110px',
    flexShrink: 0,
  },
  tag: {
    fontSize: '0.5rem',
    padding: '0.1rem 0.35rem',
    borderRadius: '5px',
    fontWeight: 600,
    alignSelf: 'flex-start',
    letterSpacing: '0.02em',
  },
  title: (dark) => ({
    fontSize: '0.85rem',
    fontWeight: 600,
    color: dark ? '#e8d9b5' : '#3a2a10',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.25,
  }),
  desc: (dark) => ({
    fontSize: '0.74rem',
    color: dark ? '#a09070' : '#7a6a50',
    margin: 0,
    lineHeight: 1.35,
    flex: 1,
    minWidth: 0,
  }),
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexShrink: 0,
  },
  approach: (issue) => ({
    fontSize: '0.55rem',
    padding: '0.14rem 0.4rem',
    borderRadius: '5px',
    background: issue.color + '18',
    color: issue.color,
    fontWeight: 600,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  }),
  arrow: {
    fontSize: '0.8rem',
    color: '#c9a84c',
    opacity: 0.5,
  },
}