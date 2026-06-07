import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useWisdom } from '../context/WisdomContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import { useHomeData } from '../hooks/useHomeData'
import WisdomScrollSection from '../components/dashboard/WisdomScrollSection'
import wisdomBg from '../assets/pages/wisdom_bg.webp'
import HeroHeader from '../sections/wisdom/HeroHeader'
import WisdomAmbientSound from '../components/wisdom/WisdomAmbientSound'
import TopicFilterBar from '../sections/wisdom/TopicFilterBar'
import ExploreByTopic from '../sections/wisdom/ExploreByTopic'
import LifeIssuesGrid from '../sections/wisdom/LifeIssuesGrid'
import WeeklyChallenge from '../sections/wisdom/WeeklyChallenge'
import Sidebar from '../sections/wisdom/SideBar'
import BookDetailModal from '../components/wisdom/BookDetailModal.jsx'
import WisdomSparkles from '../components/wisdom/WisdomSparkles.jsx'
import {
  FILTER_TOPICS, TOPIC_BOOKS, LIFE_ISSUES,
} from '../data/wisdomData'

// Mandala SVG — memoised so it never causes rerender flicker
function MandalaWatermark({ dark }) {
  return (
    <>
      <div
        aria-hidden
        className="fixed pointer-events-none select-none"
        style={{
          top: '50%', left: '50%',
          width: '70vmin', height: '70vmin',
          opacity: dark ? 0.022 : 0.035,
          zIndex: 0,
          animation: 'mw-spin 90s linear infinite',
          transform: 'translate(-50%,-50%)',
        }}
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="#c9a84c" strokeWidth="0.6" className="w-full h-full">
          <circle cx="100" cy="100" r="95" />
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="28" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 360) / 16, r = (a * Math.PI) / 180
            return <line key={i} x1={100 + Math.cos(r)*28} y1={100 + Math.sin(r)*28} x2={100 + Math.cos(r)*95} y2={100 + Math.sin(r)*95} />
          })}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} transform={`rotate(${i*45} 100 100)`}>
              <ellipse cx="100" cy="54" rx="7" ry="18" />
              <ellipse cx="100" cy="146" rx="7" ry="18" />
            </g>
          ))}
        </svg>
      </div>
      <style>{`@keyframes mw-spin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}`}</style>
    </>
  )
}

function WisdomContent() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [activeTopic, setActiveTopic] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const { dark } = useTheme()
  const { openBook, getBookProgress } = useWisdom()
  const [bookInitialPage, setBookInitialPage] = useState(0)

  const {
    currentSankalpa,
    wisdomRead,
    handleReadWisdom,
    secLabelStyle
  } = useHomeData()

  const filteredBooks = TOPIC_BOOKS.filter(book => {
    // BUG 16 FIX: Match against book.topics array first, then fall back to title/scripture text
    const matchesTopic = activeTopic === 'All' || 
      (Array.isArray(book.topics) && book.topics.some(t => t.toLowerCase() === activeTopic.toLowerCase())) ||
      (book.title && book.title.toLowerCase().includes(activeTopic.toLowerCase())) ||
      (book.scripture && book.scripture.toLowerCase().includes(activeTopic.toLowerCase()))
    const matchesSearch = !searchQuery ||
      (book.title && book.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.scripture && book.scripture.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.pages && book.pages.some(p =>
        (p.heading && p.heading.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.text && p.text.toLowerCase().includes(searchQuery.toLowerCase()))
      ))
    return matchesTopic && matchesSearch
  })

  const filteredIssues = LIFE_ISSUES.filter(issue =>
    !searchQuery ||
    (issue.title && issue.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (issue.summary && issue.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (issue.tag && issue.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (issue.approach && issue.approach.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (issue.steps && issue.steps.some(s => s && s.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  const handleBookOpen = (book, page) => {
    if (!isAuthenticated) { navigate('/login'); return }
    const resumeFrom = page ?? getBookProgress(book.id)
    openBook(book, resumeFrom)
    setBookInitialPage(resumeFrom)
    setSelectedBook(book)
  }

  return (
    <div style={pageStyle(dark)}>
      {/* Background layers */}
      <div style={overlayStyle(dark)} aria-hidden />
      <MandalaWatermark dark={dark} />
      <WisdomSparkles />
      {/* ═══ MAIN SCROLLABLE CONTENT ═══ */}
      <div style={containerStyle}>

        {/* ── HERO HEADER ───────────────────── */}
        <HeroHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />



        {/* ── WEEKLY CHALLENGE — prominent card ─ */}
        <WeeklyChallenge />

        {/* ── TOPIC FILTER BAR ──────────────── */}
        <TopicFilterBar topics={FILTER_TOPICS} active={activeTopic} onChange={setActiveTopic} />

        {/* ── MAIN CONTENT + SIDEBAR ────────── */}
        <div style={columnsStyle} className="wisdom-columns-grid">

          {/* LEFT: main feed */}
          <main style={mainStyle}>

            {filteredBooks.length > 0 ? (
              <ExploreByTopic books={filteredBooks} onBookOpen={handleBookOpen} />
            ) : (
              <EmptyState emoji="📚" msg="No scriptures match your search." />
            )}

            {filteredIssues.length > 0 ? (
              <LifeIssuesGrid issues={filteredIssues} />
            ) : (
              <EmptyState emoji="🌿" msg="No life guides match your search." />
            )}

            {/* Bottom spacer */}
            <div style={{ height: '3rem' }} />
          </main>

          {/* RIGHT: sticky sidebar */}
          <aside style={sidebarStyle} className="wisdom-sidebar-sticky">
            <Sidebar onBookOpen={handleBookOpen} />
          </aside>

        </div>
      </div>

      {/* Book modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          initialPage={bookInitialPage}
          onClose={() => setSelectedBook(null)}
        />
      )}
      <WisdomAmbientSound />
    </div>
  )
}

function EmptyState({ emoji, msg }) {
  return (
    <div className="text-center py-10 bg-white/5 dark:bg-white/[0.02] border border-gold/10 rounded-2xl">
      <span className="text-2xl block mb-2">{emoji}</span>
      <p className="text-sm text-mist-dark dark:text-sand-lt/70">{msg}</p>
    </div>
  )
}

export default function WisdomPage() {
  return <WisdomContent />
}

// ── Styles ─────────────────────────────────────────────

const pageStyle = (dark) => ({
  minHeight: '100vh',
  paddingTop: '4.75rem',
  backgroundColor: dark ? '#1a1208' : '#FDF6E3',
  backgroundImage: dark
    ? `linear-gradient(175deg,rgba(18,12,4,0.7) 0%,rgba(26,18,8,0.6) 40%,rgba(34,26,14,0.7) 100%), url(${wisdomBg})`
    : `url(${wisdomBg}), linear-gradient(175deg,rgba(254,252,245,0.8) 0%,rgba(253,246,227,0.75) 40%,rgba(245,237,216,0.8) 100%)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: dark ? 'normal' : 'multiply',
  position: 'relative',
})

const overlayStyle = (dark) => ({
  position: 'fixed',
  inset: 0,
  background: dark ? 'rgba(18,12,4,0.25)' : 'rgba(255,252,245,0.2)',
  pointerEvents: 'none',
  zIndex: 0,
})

const containerStyle = {
  maxWidth: '1240px',
  width: '100%',
  margin: '0 auto',
  // Horizontal padding + vertical top/bottom padding
  padding: '1.75rem 1.5rem 0',
  position: 'relative',
  zIndex: 1,
}

const columnsStyle = {
  display: 'grid',
  // 3fr main + 256px sidebar. On small screens the @media override in index.css handles stacking.
  gridTemplateColumns: 'minmax(0,1fr) 256px',
  gap: '1.75rem',
  alignItems: 'start',
  marginTop: '0.5rem',
}

const mainStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  minWidth: 0,   // prevents grid blowout — keeps content inside its column
}

const sidebarStyle = {
  paddingBottom: '2rem',
}