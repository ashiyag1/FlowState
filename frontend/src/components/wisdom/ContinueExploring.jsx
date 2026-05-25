import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

export default function ContinueExploring({ onBookOpen }) {
  const { openedBooks, removeOpenedBook } = useWisdom()
  const { dark } = useTheme()

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const handleResume = (item) => {
    const fullBook = TOPIC_BOOKS.find(b => b.id === item.id)
    if (fullBook && onBookOpen) onBookOpen(fullBook, item.lastPage ?? 0)
  }

  if (!openedBooks.length) {
    return (
      <div style={{
        borderRadius: 16, padding: '14px 12px',
        background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)'}`,
      }}>
        <h3 style={{
          fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
          fontFamily: "'Cinzel', serif", color: dark ? '#C9933A' : '#8B5E2F', marginBottom: 6,
        }}>
          Continue Reading
        </h3>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0',
        }}>
          <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>📖</span>
          <p style={{
            fontSize: '10px', fontStyle: 'italic', textAlign: 'center', margin: 0,
            color: dark ? 'rgba(201,176,128,0.4)' : 'rgba(139,94,47,0.4)',
          }}>
            Open a book to start reading
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      borderRadius: 16, padding: '14px 12px',
      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
      border: `1px solid ${dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)'}`,
    }}>
      <h3 style={{
        fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
        fontFamily: "'Cinzel', serif", color: dark ? '#C9933A' : '#8B5E2F', marginBottom: 8,
      }}>
        Continue Reading
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {openedBooks.slice(0, 4).map(item => {
          const fullBook = TOPIC_BOOKS.find(b => b.id === item.id)
          const totalPages = fullBook?.pages?.length || 1
          const currentPage = (item.lastPage ?? 0) + 1
          const progress = Math.round((currentPage / totalPages) * 100)

          return (
            <div key={item.id}
              onClick={() => handleResume(item)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 8px', borderRadius: 10,
                cursor: 'pointer', transition: 'all 0.15s ease',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.06)'
                e.currentTarget.style.borderColor = dark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dark ? 'rgba(201,147,58,0.08)' : 'rgba(201,147,58,0.1)',
                fontSize: '1rem',
              }}>
                {item.emoji || '📖'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '10px', fontWeight: 700,
                  color: dark ? '#fcf6e8' : '#3d2e1a',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {item.title}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4, marginTop: 2,
                }}>
                  <span style={{
                    fontSize: '8px', fontWeight: 500,
                    color: dark ? 'rgba(201,176,128,0.45)' : 'rgba(139,94,47,0.45)',
                  }}>
                    p.{currentPage}
                  </span>
                  <span style={{
                    fontSize: '7px', fontWeight: 600,
                    color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(201,147,58,0.5)',
                  }}>
                    · {progress}%
                  </span>
                  {item.openedAt && (
                    <span style={{
                      fontSize: '7px', marginLeft: 'auto',
                      color: dark ? 'rgba(201,176,128,0.3)' : 'rgba(139,94,47,0.3)',
                    }}>
                      {timeAgo(item.openedAt)}
                    </span>
                  )}
                </div>
                {/* mini progress bar */}
                {progress > 0 && progress < 100 && (
                  <div style={{
                    marginTop: 3, height: 2, borderRadius: 1,
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 1, width: `${progress}%`,
                      background: progress >= 80
                        ? 'linear-gradient(90deg, #C9933A, #1A7A4E)'
                        : 'linear-gradient(90deg, #E8622A, #C9933A)',
                    }} />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeOpenedBook(item.id) }}
                style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '8px', border: 'none', cursor: 'pointer',
                  color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  background: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'; e.currentTarget.style.background = 'transparent' }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
