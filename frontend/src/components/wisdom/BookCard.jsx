import { useState } from 'react'

export default function BookCard({ book, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)'
          : '0 4px 16px rgba(0,0,0,0.15)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {book.image ? (
        <img src={book.image} alt={book.title} style={styles.coverImg} />
      ) : (
        <div style={{ ...styles.fallback, background: book.bg }}>
          <span style={{ fontSize: 44 }}>{book.emoji}</span>
        </div>
      )}

      <div style={styles.overlay}>
        <div style={styles.gradient} />
        <div style={styles.content}>
          <span style={styles.scripture}>{book.scripture}</span>
          <span style={styles.title}>{book.title}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    width: '180px',
    height: '270px',
    flexShrink: 0,
    borderRadius: '8px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)',
  },
  coverImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallback: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  gradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.8) 100%)',
  },
  content: {
    position: 'relative',
    padding: '2.5rem 0.75rem 0.75rem',
  },
  scripture: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: '0.15rem',
  },
  title: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.25,
  },
}