import { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function IssueDetailModal({ issue, onClose }) {
  const { dark } = useTheme()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal(dark)} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn(dark)} onClick={onClose}>✕</button>

        <div style={styles.header}>
          <div style={styles.iconWrap(dark, issue)}>
            <span style={styles.emoji}>🌿</span>
          </div>
          <div>
            <span style={{
              ...styles.tag,
              background: issue.color + '22',
              color: issue.color,
            }}>
              {issue.tag}
            </span>
            <h2 style={styles.title(dark)}>{issue.title}</h2>
            <p style={styles.summary(dark)}>{issue.summary}</p>
          </div>
        </div>

        <div style={styles.approachRow}>
          <span style={{
            ...styles.approachBadge,
            background: issue.color + '18',
            color: issue.color,
          }}>
            {issue.approach}
          </span>
        </div>

        <div style={styles.divider(dark)} />

        <h3 style={styles.stepsTitle}>What to do</h3>
        <div style={styles.stepsList}>
          {issue.steps.map((step, i) => (
            <div key={i} style={styles.step(dark)}>
              <span style={styles.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {issue.tip && (
          <div style={styles.tipBox(dark)}>
            <span style={styles.tipLabel}>💡 Pro tip</span>
            <p style={styles.tipText(dark)}>{issue.tip}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  },
  modal: (dark) => ({
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '85vh',
    overflowY: 'auto',
    borderRadius: '16px',
    padding: '1.75rem 1.5rem 1.5rem',
    background: dark
      ? 'linear-gradient(160deg, #1a1208, #221a0e)'
      : 'linear-gradient(160deg, #FFFCF3, #FDF6E3)',
    border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid rgba(201,168,76,0.15)',
    boxShadow: dark
      ? '0 20px 60px rgba(0,0,0,0.4)'
      : '0 20px 60px rgba(92,61,30,0.12)',
  }),
  closeBtn: (dark) => ({
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid rgba(201,168,76,0.15)',
    background: dark ? 'rgba(40,30,15,0.3)' : 'rgba(255,255,255,0.5)',
    color: dark ? '#a09070' : '#8a7a60',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
  }),
  header: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  iconWrap: (dark, issue) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: dark ? issue.color + '15' : issue.color + '12',
    flexShrink: 0,
  }),
  emoji: {
    fontSize: '1.3rem',
  },
  tag: {
    fontSize: '0.5rem',
    padding: '0.08rem 0.35rem',
    borderRadius: '6px',
    fontWeight: 500,
    display: 'inline-block',
    letterSpacing: '0.02em',
  },
  title: (dark) => ({
    margin: '0.2rem 0 0.1rem',
    fontSize: '1.2rem',
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 600,
    color: dark ? '#e8d9b5' : '#3a2a10',
    lineHeight: 1.2,
  }),
  summary: (dark) => ({
    margin: 0,
    fontSize: '0.78rem',
    fontFamily: '"Lora", serif',
    fontStyle: 'italic',
    color: dark ? '#a09070' : '#7a6a50',
  }),
  approachRow: {
    marginBottom: '0.35rem',
  },
  approachBadge: {
    fontSize: '0.55rem',
    padding: '0.12rem 0.4rem',
    borderRadius: '6px',
    fontWeight: 600,
    letterSpacing: '0.04em',
  },
  divider: (dark) => ({
    height: '1px',
    margin: '0.6rem 0',
    background: dark
      ? 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
  }),
  stepsTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.85rem',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    color: '#c9a84c',
    letterSpacing: '0.04em',
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  step: (dark) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '0.35rem 0',
    fontSize: '0.78rem',
    fontFamily: '"Lora", serif',
    color: dark ? '#c9b080' : '#5a3d20',
    lineHeight: 1.45,
    borderBottom: dark ? '1px solid rgba(201,168,76,0.03)' : '1px solid rgba(201,168,76,0.06)',
  }),
  stepNum: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#c9a84c',
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
  },
  tipBox: (dark) => ({
    marginTop: '0.75rem',
    padding: '0.65rem 0.75rem',
    borderRadius: '10px',
    background: dark ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.05)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.08)',
  }),
  tipLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#c9a84c',
    display: 'block',
    marginBottom: '0.2rem',
  },
  tipText: (dark) => ({
    margin: 0,
    fontSize: '0.75rem',
    fontFamily: '"Lora", serif',
    color: dark ? '#b0a078' : '#6a5a40',
    lineHeight: 1.4,
    fontStyle: 'italic',
  }),
}
