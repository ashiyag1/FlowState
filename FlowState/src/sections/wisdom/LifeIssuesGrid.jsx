import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import IssueCard from '../../components/wisdom/IssueCard.jsx'
import IssueDetailModal from '../../components/wisdom/IssueDetailModal.jsx'

export default function LifeIssuesGrid({ issues }) {
  const { dark } = useTheme()
  const scrollRef = useRef(null)
  const [selectedIssue, setSelectedIssue] = useState(null)
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
  }, [issues])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 380, behavior: 'smooth' })
  }

  return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <h2 style={styles.sectionTitle(dark)}>What would you like help with?</h2>
      </div>

      <div style={styles.carousel}>
        {canScrollLeft && (
          <button style={{ ...styles.arrow, left: '-8px' }} onClick={() => scroll(-1)} aria-label="Previous">‹</button>
        )}

        <div style={styles.trackWrap}>
          <div ref={scrollRef} style={styles.track}>
            {issues.map(issue => (
              <div key={issue.id} style={styles.slot}>
                <IssueCard
                  issue={issue}
                  dark={dark}
                  onClick={() => setSelectedIssue(issue)}
                />
              </div>
            ))}
            <div style={{ flexShrink: 0, width: '6px' }} />
          </div>
        </div>

        {canScrollRight && (
          <button style={{ ...styles.arrow, right: '-8px' }} onClick={() => scroll(1)} aria-label="Next">›</button>
        )}
      </div>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </section>
  )
}

const styles = {
  section: {
    flex: 1,
    minHeight: 0,
  },
  headerRow: {
    marginBottom: '0.55rem',
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
  },
  trackWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  track: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '0.3rem 0.25rem 0.35rem',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  slot: {
    flexShrink: 0,
    width: '390px',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 5,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #c9a84c, #8b6914)',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 6px rgba(139,105,20,0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
}
