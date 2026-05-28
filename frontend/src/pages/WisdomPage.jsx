import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useWisdom } from '../context/WisdomContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import wisdomBg from '../assets/pages/wisdom_bg.webp'
import HeroHeader from '../sections/wisdom/HeroHeader'
import TopicFilterBar from '../sections/wisdom/TopicFilterBar'
import TodaysWisdom from '../components/wisdom/TodaysWisdom.jsx'
import ExploreByTopic from '../sections/wisdom/ExploreByTopic'
import LifeIssuesGrid from '../sections/wisdom/LifeIssuesGrid'
import QuoteBanner from '../sections/wisdom/QuoteBanner'
import Sidebar from '../sections/wisdom/SideBar'
import BookDetailModal from '../components/wisdom/BookDetailModal.jsx'
import WisdomAmbientSound from '../components/wisdom/WisdomAmbientSound.jsx'
import WisdomSparkles from '../components/wisdom/WisdomSparkles.jsx'
import {
  FILTER_TOPICS, TOPIC_BOOKS, LIFE_ISSUES, TODAY_WISDOM,
} from '../data/wisdomData'

function WisdomContent() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTopic, setActiveTopic] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [pendingBook, setPendingBook] = useState(null)
  const { dark } = useTheme()
  const { markStreakToday, openBook, getBookProgress } = useWisdom()
  const { trackEvent } = useAchievements()
  const [bookInitialPage, setBookInitialPage] = useState(0)

  useEffect(() => { 
    markStreakToday()
    trackEvent('wisdom_read')
  }, [markStreakToday, trackEvent])

  // Filter books by active topic and search query
  const filteredBooks = TOPIC_BOOKS.filter(book => {
    const matchesTopic = activeTopic === 'All' || book.title.toLowerCase().includes(activeTopic.toLowerCase());
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (book.pages && book.pages.some(p => 
        p.heading.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.text.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    return matchesTopic && matchesSearch;
  })

  // Filter issues by search query
  const filteredIssues = LIFE_ISSUES.filter(issue => {
    return !searchQuery ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.approach.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.steps && issue.steps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase())));
  })

  const handleBookOpen = (book, page) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const resumeFrom = page ?? getBookProgress(book.id)
    openBook(book, resumeFrom)
    setBookInitialPage(resumeFrom)
    setSelectedBook(book)
  }

  return (
    <div style={styles.page(dark)}>
      <div style={styles.backdropOverlay(dark)} />
      <WisdomSparkles />
      <WisdomAmbientSound />
      <div style={styles.container}>
        <HeroHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <TopicFilterBar
          topics={FILTER_TOPICS}
          active={activeTopic}
          onChange={setActiveTopic}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 mt-4 pb-8">
          <div className="lg:col-span-3 flex flex-col gap-9 overflow-hidden min-w-0">
            <TodaysWisdom wisdom={TODAY_WISDOM} />
            
            {filteredBooks.length > 0 ? (
              <ExploreByTopic
                books={filteredBooks}
                onBookOpen={handleBookOpen}
              />
            ) : (
              <div className="text-center py-10 bg-white/5 dark:bg-white/[0.02] border border-gold/10 rounded-2xl">
                <span className="text-2xl block mb-2">📚</span>
                <p className="text-sm text-mist-dark dark:text-sand-lt/70">No books match your search.</p>
              </div>
            )}

            {filteredIssues.length > 0 ? (
              <LifeIssuesGrid issues={filteredIssues} />
            ) : (
              <div className="text-center py-10 bg-white/5 dark:bg-white/[0.02] border border-gold/10 rounded-2xl">
                <span className="text-2xl block mb-2">🌿</span>
                <p className="text-sm text-mist-dark dark:text-sand-lt/70">No issues match your search.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto w-full pb-8 pr-1 scrollbar-thin">
            <Sidebar onBookOpen={handleBookOpen} />
          </aside>
        </div>
      </div>

      <QuoteBanner />

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          initialPage={bookInitialPage}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  )
}

const LAYOUT = {
  pageGap: '2rem',
  sectionGap: '2.25rem',
}

export default function WisdomPage() {
  return <WisdomContent />
}

const styles = {
  backdropOverlay: (dark) => ({
    position: 'absolute',
    inset: 0,
    background: dark
      ? 'rgba(18,12,4,0.3)'
      : 'rgba(255,252,245,0.3)',
    pointerEvents: 'none',
  }),
  page: (dark) => ({
    minHeight: '100vh',
    paddingTop: '4.75rem',
    background: dark
      ? 'linear-gradient(175deg, #120c04 0%, #1a1208 40%, #221a0e 100%)'
      : 'linear-gradient(175deg, #FEFCF5 0%, #FDF6E3 40%, #F5EDD8 100%)',
    backgroundImage: dark
      ? `linear-gradient(175deg, rgba(18,12,4,0.7) 0%, rgba(26,18,8,0.6) 40%, rgba(34,26,14,0.7) 100%), url(${wisdomBg})`
      : `url(${wisdomBg}), linear-gradient(175deg, rgba(254,252,245,0.8) 0%, rgba(253,246,227,0.75) 40%, rgba(245,237,216,0.8) 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: dark ? 'normal' : 'multiply',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  }),
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '1.5rem 1.5rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 240px',
    gap: '2rem',
    flex: 1,
    minHeight: 0,
    marginTop: '1rem',
    paddingBottom: '2rem',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.25rem',
    overflow: 'hidden',
    minWidth: 0,
  },
  sidebar: {
    position: 'sticky',
    top: '1.5rem',
    alignSelf: 'start',
    maxHeight: 'calc(100vh - 10rem)',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
}