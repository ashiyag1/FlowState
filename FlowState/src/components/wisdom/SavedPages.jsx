import { useState } from 'react'
import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

const STICKY_ROTATIONS = ['-2deg', '1deg', '-1deg', '2deg', '-1.5deg', '1.5deg']

export default function SavedPages({ onBookOpen }) {
  const { savedPages, removeSavedPage, getPageNotes } = useWisdom()
  const { dark } = useTheme()
  const [showNotes, setShowNotes] = useState({})

  if (!savedPages.length) {
    return (
      <div style={styles.card(dark)}>
        <h3 style={styles.title(dark)}>Saved Pages</h3>
        <p style={styles.empty(dark)}>Bookmark pages while reading</p>
      </div>
    )
  }

  const handleOpen = (item) => {
    const fullBook = TOPIC_BOOKS.find(b => b.id === item.bookId)
    if (fullBook && onBookOpen) {
      onBookOpen(fullBook, item.pageIdx)
    }
  }

  const toggleNotes = (key, e) => {
    e.stopPropagation()
    setShowNotes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const keyFor = (item) => `${item.bookId}-${item.pageIdx}`

  return (
    <div style={styles.card(dark)}>
      <h3 style={styles.title(dark)}>Saved Pages</h3>
      <div style={styles.list}>
        {savedPages.slice(0, 10).map((item) => {
          const key = keyFor(item)
          const notes = getPageNotes(item.bookId, item.pageIdx)
          const isOpen = showNotes[key]
          return (
            <div key={key}>
              <div style={styles.item(dark)} onClick={() => handleOpen(item)}>
                <div style={styles.thumb}>{item.bookEmoji || '📖'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.pageTitle(dark)}>{item.heading}</div>
                  <div style={styles.bookSub(dark)}>
                    {item.bookTitle}
                    <span style={styles.progress}> · p.{item.pageIdx + 1}</span>
                  </div>
                </div>
                {notes.length > 0 && (
                  <button
                    style={styles.showNotesBtn(dark, isOpen)}
                    onClick={(e) => toggleNotes(key, e)}
                    title={isOpen ? 'Hide notes' : `Show ${notes.length} note${notes.length > 1 ? 's' : ''}`}
                  >{notes.length}</button>
                )}
                <button
                  style={styles.removeBtn(dark)}
                  onClick={(e) => { e.stopPropagation(); removeSavedPage(item.bookId, item.pageIdx) }}
                  title="Remove"
                >✕</button>
              </div>
              {isOpen && notes.length > 0 && (
                <div style={styles.stickyRow}>
                  {notes.map((n, ni) => (
                    <div
                      key={n.id}
                      style={{
                        ...styles.stickyNote,
                        background: n.color + 'E0',
                        transform: `rotate(${STICKY_ROTATIONS[ni % STICKY_ROTATIONS.length]})`,
                      }}
                    >
                      <span style={styles.stickyNoteText}>{n.text}</span>
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

const styles = {
  card: (dark) => ({
    padding: '0.7rem',
    background: dark ? 'rgba(40,30,15,0.2)' : 'rgba(255,255,255,0.35)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.08)',
    borderRadius: '10px',
  }),
  title: (dark) => ({
    margin: '0 0 0.35rem',
    fontSize: '0.8rem',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    color: dark ? '#c9b080' : '#6a5a40',
  }),
  empty: (dark) => ({
    fontSize: '0.7rem',
    color: dark ? '#6a5a40' : '#a09070',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
    padding: '0.2rem 0',
  }),
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: (dark) => ({
    display: 'flex',
    gap: '0.3rem',
    padding: '0.35rem 0',
    alignItems: 'center',
    borderBottom: dark ? '1px solid rgba(201,168,76,0.04)' : '1px solid rgba(201,168,76,0.06)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  }),
  thumb: {
    fontSize: '0.9rem',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageTitle: (dark) => ({
    fontSize: '0.7rem',
    fontWeight: 600,
    color: dark ? '#c9b080' : '#5c3d1e',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  bookSub: (dark) => ({
    fontSize: '0.6rem',
    color: dark ? '#6a5a40' : '#a09070',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  progress: {
    fontSize: '0.55rem',
    color: '#c9a84c',
    opacity: 0.7,
  },
  showNotesBtn: (dark, isOpen) => ({
    background: isOpen ? '#c9a84c' : (dark ? '#3a2a10' : '#f0e8d0'),
    border: isOpen ? 'none' : (dark ? '1px solid #4a3a20' : '1px solid #d4c5a0'),
    borderRadius: '8px',
    fontSize: '0.5rem',
    fontWeight: 700,
    color: isOpen ? '#fff' : (dark ? '#c9b080' : '#8b6914'),
    padding: '1px 4px',
    cursor: 'pointer',
    lineHeight: 1.3,
    minWidth: '16px',
    textAlign: 'center',
    flexShrink: 0,
  }),
  removeBtn: (dark) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.55rem',
    color: dark ? '#4a3a20' : '#c0b8a0',
    padding: '0.15rem',
    flexShrink: 0,
  }),
  stickyRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '4px 2px 4px 28px',
  },
  stickyNote: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '4px 7px',
    borderRadius: '2px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
    fontSize: '0.6rem',
    lineHeight: 1.4,
    fontStyle: 'italic',
    fontFamily: '"Caveat", "Segoe Script", cursive',
    maxWidth: '95%',
  },
  stickyNoteText: {
    flex: 1,
    color: '#2a1e10',
    wordBreak: 'break-word',
  },
}