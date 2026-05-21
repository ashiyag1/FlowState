import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

export default function SavedPages({ onBookOpen }) {
  const { savedPages, removeSavedPage } = useWisdom()
  const { dark } = useTheme()

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

  return (
    <div style={styles.card(dark)}>
      <h3 style={styles.title(dark)}>Saved Pages</h3>
      <div style={styles.list}>
        {savedPages.slice(0, 10).map((item, i) => (
          <div key={`${item.bookId}-${item.pageIdx}`} style={styles.item(dark)} onClick={() => handleOpen(item)}>
            <div style={styles.thumb}>{item.bookEmoji || '📖'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.pageTitle(dark)}>{item.heading}</div>
              <div style={styles.bookSub(dark)}>
                {item.bookTitle}
                <span style={styles.progress}> · p.{item.pageIdx + 1}</span>
              </div>
            </div>
            <button
              style={styles.removeBtn(dark)}
              onClick={(e) => { e.stopPropagation(); removeSavedPage(item.bookId, item.pageIdx) }}
              title="Remove"
            >✕</button>
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
    gap: '0.4rem',
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
  removeBtn: (dark) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.55rem',
    color: dark ? '#4a3a20' : '#c0b8a0',
    padding: '0.15rem',
    flexShrink: 0,
  }),
}
