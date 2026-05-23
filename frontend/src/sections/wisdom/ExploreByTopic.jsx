import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import BookCard from '../../components/wisdom/BookCard.jsx'

export default function ExploreByTopic({ books, onBookOpen }) {
  const scrollRef = useRef(null)
  const { dark } = useTheme()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows)
    updateArrows()
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [books])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  if (!books.length) return null

  return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <h2 style={styles.sectionTitle(dark)}>Explore by Topic</h2>
      </div>

      <div style={styles.carousel}>
        {canScrollLeft && (
          <button style={{ ...styles.arrow, left: '-8px' }} onClick={() => scroll(-1)} aria-label="Previous">
            ‹
          </button>
        )}

        <div style={styles.trackWrap}>
          <div ref={scrollRef} style={styles.track}>
            {books.map((b) => (
              <div key={b.id} style={styles.slot}>
                <BookCard book={b} onClick={() => onBookOpen?.(b)} />
              </div>
            ))}
            <div style={{ flexShrink: 0, width: '8px' }} />
          </div>
        </div>

        {canScrollRight && (
          <button style={{ ...styles.arrow, right: '-8px' }} onClick={() => scroll(1)} aria-label="Next">
            ›
          </button>
        )}
      </div>

      <div style={styles.shelfOuter}>
        <div style={styles.shelfTop} />
        <div style={styles.shelfBody} />
        <div style={styles.shelfShadow} />
      </div>
    </section>
  )
}

const styles = {
  section: {
    flexShrink: 0,
  },
  headerRow: {
    marginBottom: '0.35rem',
  },
  sectionTitle: (dark) => ({
    fontSize: '1rem',
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    color: dark ? '#e8d9b5' : '#5c3d1e',
    margin: 0,
    letterSpacing: '0.01em',
  }),
  carousel: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '0.25rem 0 0',
  },
  trackWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  track: {
    display: 'flex',
    gap: '18px',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '0.5rem 0.5rem 0',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  slot: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-end',
  },
  arrow: {
    position: 'absolute',
    top: '44%',
    transform: 'translateY(-50%)',
    zIndex: 5,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #c9a84c, #8b6914)',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(139,105,20,0.2)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  shelfOuter: {
    position: 'relative',
    margin: '0.35rem 0.5rem 0',
  },
  shelfTop: {
    height: '3px',
    background: 'linear-gradient(90deg, transparent 4%, #6b4a20 15%, #a07830 30%, #c9a050 50%, #a07830 70%, #6b4a20 85%, transparent 96%)',
    borderRadius: '2px 2px 0 0',
  },
  shelfBody: {
    height: '5px',
    background: 'linear-gradient(180deg, #7a5528, #4a3015)',
    borderRadius: '0 0 3px 3px',
  },
  shelfShadow: {
    height: '3px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.10), transparent)',
    borderRadius: '0 0 3px 3px',
    margin: '0 3px',
  },
}