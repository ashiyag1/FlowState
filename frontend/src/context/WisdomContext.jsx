import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { Store, today as getToday } from '../utils'
import { useAuth } from './AuthContext'

const WisdomContext = createContext(null)

export function WisdomProvider({ children }) {
  const { user, isAuthenticated, token } = useAuth()

  const [userName, setUserNameRaw] = useState('Seeker')
  const [userSub, setUserSubRaw] = useState('Keep growing')

  const [savedWisdom, setSavedWisdomRaw] = useState([])
  const [savedPages, setSavedPagesRaw] = useState([])
  const [pageNotes, setPageNotesRaw] = useState({})
  const [streakLog, setStreakLogRaw] = useState({})
  const [openedBooks, setOpenedBooksRaw] = useState([])
  const [bookProgress, setBookProgressRaw] = useState({})

  const stateRef = useRef({
    savedWisdom: [], savedPages: [], pageNotes: {}, streakLog: {}, openedBooks: [], bookProgress: {}
  })

  // Load state on auth changes
  const prevAuthRef = useRef(isAuthenticated)
  useEffect(() => {
    const wasAuth = prevAuthRef.current
    prevAuthRef.current = isAuthenticated

    if (isAuthenticated && user) {
      setUserNameRaw(user.name || 'Seeker')
      const w = user.wisdom || {}
      setSavedWisdomRaw(w.savedWisdom || [])
      setSavedPagesRaw(w.savedPages || [])
      setPageNotesRaw(w.pageNotes || {})
      setStreakLogRaw(w.streakLog || {})
      setOpenedBooksRaw(w.openedBooks || [])
      setBookProgressRaw(w.bookProgress || {})
      
      stateRef.current = {
        savedWisdom: w.savedWisdom || [],
        savedPages: w.savedPages || [],
        pageNotes: w.pageNotes || {},
        streakLog: w.streakLog || {},
        openedBooks: w.openedBooks || [],
        bookProgress: w.bookProgress || {}
      }
    } else if (wasAuth && !isAuthenticated) {
      // Clear on logout
      setUserNameRaw('Seeker')
      setSavedWisdomRaw([])
      setSavedPagesRaw([])
      setPageNotesRaw({})
      setStreakLogRaw({})
      setOpenedBooksRaw([])
      setBookProgressRaw({})
      stateRef.current = { savedWisdom: [], savedPages: [], pageNotes: {}, streakLog: {}, openedBooks: [], bookProgress: {} }
    } else if (!isAuthenticated) {
      // Guest
      setUserNameRaw(Store.get('fwa_guest_name', 'Seeker'))
      setSavedWisdomRaw(Store.get('wisdom_saved', []))
      setSavedPagesRaw(Store.get('wisdom_saved_pages', []))
      setPageNotesRaw(Store.get('wisdom_page_notes', {}))
      setStreakLogRaw(Store.get('wisdom_streak_log', {}))
      setOpenedBooksRaw(Store.get('wisdom_opened_books', []))
      setBookProgressRaw(Store.get('wisdom_book_progress', {}))
      
      stateRef.current = {
        savedWisdom: Store.get('wisdom_saved', []),
        savedPages: Store.get('wisdom_saved_pages', []),
        pageNotes: Store.get('wisdom_page_notes', {}),
        streakLog: Store.get('wisdom_streak_log', {}),
        openedBooks: Store.get('wisdom_opened_books', []),
        bookProgress: Store.get('wisdom_book_progress', {})
      }
    }
  }, [isAuthenticated, user])

  // Sync function
  const syncWisdomToServer = useCallback(async (fullWisdomObj) => {
    if (isAuthenticated && token) {
      try {
        await fetch('/api/v1/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ wisdom: fullWisdomObj })
        })
      } catch (e) { console.error('Wisdom sync failed', e) }
    }
  }, [isAuthenticated, token])

  // Custom setter factories
  const createSetter = (stateKey, storageKey, setRaw) => {
    return (val) => {
      setRaw(prev => {
        const next = typeof val === 'function' ? val(prev) : val
        stateRef.current[stateKey] = next
        
        if (isAuthenticated) {
          syncWisdomToServer(stateRef.current)
        } else {
          Store.set('wisdom_' + storageKey, next)
        }
        return next
      })
    }
  }

  const setSavedWisdom = useCallback(createSetter('savedWisdom', 'saved', setSavedWisdomRaw), [isAuthenticated, syncWisdomToServer])
  const setSavedPages = useCallback(createSetter('savedPages', 'saved_pages', setSavedPagesRaw), [isAuthenticated, syncWisdomToServer])
  const setPageNotes = useCallback(createSetter('pageNotes', 'page_notes', setPageNotesRaw), [isAuthenticated, syncWisdomToServer])
  const setStreakLog = useCallback(createSetter('streakLog', 'streak_log', setStreakLogRaw), [isAuthenticated, syncWisdomToServer])
  const setOpenedBooks = useCallback(createSetter('openedBooks', 'opened_books', setOpenedBooksRaw), [isAuthenticated, syncWisdomToServer])
  const setBookProgress = useCallback(createSetter('bookProgress', 'book_progress', setBookProgressRaw), [isAuthenticated, syncWisdomToServer])
  const setUserName = setUserNameRaw // handled by auth
  const setUserSub = setUserSubRaw   // unused externally

  // -- Below are exactly the same callbacks as before --

  const toggleSavedWisdom = useCallback((id) => {
    setSavedWisdom(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [setSavedWisdom])

  const savePage = useCallback((pageInfo) => {
    setSavedPages(prev => {
      const exists = prev.find(p => p.bookId === pageInfo.bookId && p.pageIdx === pageInfo.pageIdx)
      if (exists) return prev
      return [{ ...pageInfo, savedAt: Date.now() }, ...prev].slice(0, 50)
    })
  }, [setSavedPages])

  const removeSavedPage = useCallback((bookId, pageIdx) => {
    setSavedPages(prev => prev.filter(p => !(p.bookId === bookId && p.pageIdx === pageIdx)))
  }, [setSavedPages])

  const isPageSaved = useCallback((bookId, pageIdx) => {
    return savedPages.some(p => p.bookId === bookId && p.pageIdx === pageIdx)
  }, [savedPages])

  const addNote = useCallback((bookId, pageIdx, text, color) => {
    const key = `${bookId}-${pageIdx}`
    setPageNotes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now(), text, color }],
    }))
  }, [setPageNotes])

  const removeNote = useCallback((bookId, pageIdx, noteId) => {
    const key = `${bookId}-${pageIdx}`
    setPageNotes(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(n => n.id !== noteId),
    }))
  }, [setPageNotes])

  const getPageNotes = useCallback((bookId, pageIdx) => {
    const key = `${bookId}-${pageIdx}`
    return pageNotes[key] || []
  }, [pageNotes])

  const markStreakToday = useCallback(() => {
    const td = getToday()
    setStreakLog(prev => ({ ...prev, [td]: true }))
  }, [setStreakLog])

  const getStreakDays = useCallback(() => {
    const dayLabels = ['Su', 'M', 'T', 'W', 'T', 'F', 'Sa']

    const result = []
    const td = new Date()
    const dayOfWeek = td.getDay()
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    for (let i = mondayOffset; i >= 0; i--) {
      const d = new Date(td)
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      result.push({
        label: dayLabels[d.getDay()],
        done: !!streakLog[iso],
      })
    }
    const remaining = 7 - result.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(td)
      d.setDate(d.getDate() + i)
      result.push({
        label: dayLabels[d.getDay()],
        done: false,
        future: true,
      })
    }
    return result
  }, [streakLog])

  const getStreakCount = useCallback(() => {
    let count = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const iso = d.toISOString().slice(0, 10)
      if (streakLog[iso]) { count++; d.setDate(d.getDate() - 1) }
      else { if (i === 0) { d.setDate(d.getDate() - 1); continue } break }
    }
    return count
  }, [streakLog])

  const openBook = useCallback((book, page = 0) => {
    setOpenedBooks(prev => {
      const filtered = prev.filter(b => b.id !== book.id)
      return [{
        id: book.id, title: book.title, scripture: book.scripture,
        emoji: book.emoji, openedAt: Date.now(), lastPage: page,
      }, ...filtered].slice(0, 10)
    })
  }, [setOpenedBooks])

  const updateBookProgress = useCallback((bookId, page) => {
    setBookProgress(prev => ({ ...prev, [bookId]: page }))
    setOpenedBooks(prev => prev.map(b =>
      b.id === bookId ? { ...b, lastPage: page } : b
    ))
  }, [setBookProgress, setOpenedBooks])

  const getBookProgress = useCallback((bookId) => {
    return bookProgress[bookId] ?? 0
  }, [bookProgress])

  const removeOpenedBook = useCallback((id) => {
    setOpenedBooks(prev => prev.filter(b => b.id !== id))
  }, [setOpenedBooks])

  return (
    <WisdomContext.Provider value={{
      userName, setUserName,
      userSub, setUserSub,
      savedWisdom, toggleSavedWisdom,
      savedPages, savePage, removeSavedPage, isPageSaved,
      addNote, removeNote, getPageNotes,
      streakLog, markStreakToday,
      getStreakDays, getStreakCount,
      openedBooks, openBook, removeOpenedBook,
      updateBookProgress, getBookProgress,
    }}>
      {children}
    </WisdomContext.Provider>
  )
}

export const useWisdom = () => {
  const ctx = useContext(WisdomContext)
  if (!ctx) throw new Error('useWisdom must be inside WisdomProvider')
  return ctx
}
