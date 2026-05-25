import { useState } from 'react'
import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

const STICKY_ROTATIONS = ['-1.5deg', '1deg', '-1deg', '1.5deg']

export default function SavedPages({ onBookOpen }) {
  const { savedPages, removeSavedPage, getPageNotes } = useWisdom()
  const { dark } = useTheme()
  const [showNotes, setShowNotes] = useState({})

  const handleOpen = (item) => {
    const fullBook = TOPIC_BOOKS.find(b => b.id === item.bookId)
    if (fullBook && onBookOpen) onBookOpen(fullBook, item.pageIdx)
  }

  const toggleNotes = (key, e) => {
    e.stopPropagation()
    setShowNotes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const keyFor = (item) => `${item.bookId}-${item.pageIdx}`

  if (!savedPages.length) {
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
          Saved Verses
        </h3>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0',
        }}>
          <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>🔖</span>
          <p style={{
            fontSize: '10px', fontStyle: 'italic', textAlign: 'center', margin: 0,
            color: dark ? 'rgba(201,176,128,0.4)' : 'rgba(139,94,47,0.4)',
          }}>
            Bookmark pages while reading
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
        Saved Verses
        <span style={{
          fontSize: '8px', fontWeight: 600, marginLeft: 6,
          color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(139,94,47,0.35)',
          textTransform: 'none', letterSpacing: 'normal',
        }}>
          ({savedPages.length})
        </span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {savedPages.slice(0, 10).map((item, idx, arr) => {
          const key = keyFor(item)
          const notes = getPageNotes(item.bookId, item.pageIdx)
          const isOpen = showNotes[key]
          const isLast = idx === arr.length - 1

          return (
            <div key={key} style={{
              borderBottom: isLast ? 'none' : `1px solid ${dark ? 'rgba(201,168,76,0.06)' : 'rgba(201,168,76,0.1)'}`,
              paddingBottom: notes.length && isOpen ? 6 : 2,
              marginBottom: notes.length && isOpen ? 0 : 0,
            }}>
              <div
                onClick={() => handleOpen(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 6px', borderRadius: 10,
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
                  fontSize: '0.9rem',
                }}>
                  {item.bookEmoji || '📖'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '10px', fontWeight: 700,
                    color: dark ? '#fcf6e8' : '#3d2e1a',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.heading}
                  </div>
                  <div style={{
                    fontSize: '8px', fontWeight: 500, marginTop: 1,
                    color: dark ? 'rgba(201,176,128,0.45)' : 'rgba(139,94,47,0.45)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.bookTitle} <span style={{ color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(201,147,58,0.5)' }}>· p.{item.pageIdx + 1}</span>
                  </div>
                </div>

                {notes.length > 0 && (
                  <button
                    onClick={(e) => toggleNotes(key, e)}
                    style={{
                      padding: '2px 6px', borderRadius: 6, fontSize: '7px', fontWeight: 700,
                      border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                      background: isOpen
                        ? 'linear-gradient(135deg, #C9933A, #E8B96A)'
                        : (dark ? 'rgba(201,147,58,0.1)' : 'rgba(201,147,58,0.12)'),
                      color: isOpen ? '#fff' : (dark ? '#C9933A' : '#8B5E2F'),
                      transition: 'all 0.15s ease',
                    }}
                  >
                    📝 {notes.length}
                  </button>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); removeSavedPage(item.bookId, item.pageIdx) }}
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

              {isOpen && notes.length > 0 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  paddingLeft: 36, paddingRight: 4, paddingTop: 4,
                }}>
                  {notes.map((n, ni) => (
                    <div key={n.id} style={{
                      padding: '6px 8px', borderRadius: 8,
                      background: n.color
                        ? (dark ? `${n.color}30` : `${n.color}D9`)
                        : (dark ? 'rgba(255,249,219,0.15)' : '#fff9db'),
                      border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                      transform: `rotate(${STICKY_ROTATIONS[ni % STICKY_ROTATIONS.length]})`,
                      fontSize: '9px', lineHeight: 1.4, fontWeight: 500,
                      color: dark ? '#fcf6e8' : '#3d2e1a',
                      fontFamily: "'Caveat', 'Lora', cursive, sans-serif",
                    }}>
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
