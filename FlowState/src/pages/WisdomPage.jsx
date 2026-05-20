import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { WisdomProvider, useWisdom } from '../context/WisdomContext'
import wisdomBg from '../assets/pages/wisdom_bg.png'
import HeroHeader from '../sections/wisdom/HeroHeader'
import TopicFilterBar from '../sections/wisdom/TopicFilterBar'
import TodaysWisdom from '../components/wisdom/TodaysWisdom.jsx'
import ExploreByTopic from '../sections/wisdom/ExploreByTopic'
import LifeIssuesGrid from '../sections/wisdom/LifeIssuesGrid'
import QuoteBanner from '../sections/wisdom/QuoteBanner'
import Sidebar from '../sections/wisdom/SideBar'
import BookDetailModal from '../components/wisdom/BookDetailModal.jsx'
import WisdomAmbientSound from '../components/wisdom/WisdomAmbientSound.jsx'
import {
  FILTER_TOPICS, TOPIC_BOOKS, LIFE_ISSUES, TODAY_WISDOM,
} from '../data/wisdomData'

function WisdomContent() {
  const [activeTopic, setActiveTopic] = useState('All')
  const [selectedBook, setSelectedBook] = useState(null)
  const { dark } = useTheme()
  const { markStreakToday, openBook, getBookProgress } = useWisdom()
  const [bookInitialPage, setBookInitialPage] = useState(0)

  useEffect(() => { markStreakToday() }, [markStreakToday])

  const filteredBooks =
    activeTopic === 'All'
      ? TOPIC_BOOKS
      : TOPIC_BOOKS.filter(book =>
          book.title.toLowerCase().includes(activeTopic.toLowerCase())
        )

  const handleBookOpen = (book, page) => {
    const resumeFrom = page ?? getBookProgress(book.id)
    openBook(book, resumeFrom)
    setBookInitialPage(resumeFrom)
    setSelectedBook(book)
  }

  return (
    <div style={styles.page(dark)}>
      <div style={styles.backdropOverlay(dark)} />
      <WisdomAmbientSound />
      <div style={styles.container}>
        <HeroHeader />

        <TopicFilterBar
          topics={FILTER_TOPICS}
          active={activeTopic}
          onChange={setActiveTopic}
        />

        <div style={styles.columns}>
          <div style={styles.main}>
            <TodaysWisdom wisdom={TODAY_WISDOM} />
            <ExploreByTopic
              books={filteredBooks.length ? filteredBooks : TOPIC_BOOKS}
              onBookOpen={handleBookOpen}
            />
            <LifeIssuesGrid issues={LIFE_ISSUES} />
          </div>

          <aside style={styles.sidebar}>
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
  return (
    <WisdomProvider>
      <WisdomContent />
    </WisdomProvider>
  )
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