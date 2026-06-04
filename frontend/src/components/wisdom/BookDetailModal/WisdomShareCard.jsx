import React from 'react'

export const WisdomShareCard = React.forwardRef(({ book, cur }, ref) => {
  const s = {
    shareCard: {
      width: '400px',
      padding: '2rem',
      background: '#fcf6e8',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid #d4c5a0',
      fontFamily: '"Lora", "Georgia", serif',
    },
    shareCardInner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      textAlign: 'center',
    },
    shareCardEmoji: {
      fontSize: '3rem',
      lineHeight: 1,
    },
    shareCardHeading: {
      fontSize: '1.1rem',
      fontFamily: '"Cinzel", serif',
      color: '#5c3d1e',
      margin: 0,
    },
    shareCardText: {
      fontSize: '0.9rem',
      color: '#4a3a20',
      lineHeight: 1.7,
      margin: 0,
      whiteSpace: 'pre-line',
    },
    shareCardFooter: {
      marginTop: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
    },
    shareCardSource: {
      fontSize: '0.75rem',
      color: '#8b6914',
      fontStyle: 'italic',
    },
    shareCardTag: {
      fontSize: '0.6rem',
      color: '#c9a84c',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    }
  }

  return (
    <div ref={ref} style={s.shareCard}>
      <div style={s.shareCardInner}>
        <div style={s.shareCardEmoji}>{book.emoji || '📖'}</div>
        <h3 style={s.shareCardHeading}>{cur?.heading}</h3>
        <p style={s.shareCardText}>{cur?.text}</p>
        <div style={s.shareCardFooter}>
          <div style={s.shareCardSource}>— {book.title}, {book.scripture}</div>
          <div style={s.shareCardTag}>tarang-flowstate</div>
        </div>
      </div>
    </div>
  )
})
