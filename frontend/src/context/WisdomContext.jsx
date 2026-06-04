import { createContext, useContext, useState, useCallback } from 'react'
import { Store, today as getToday } from '../utils'

const WisdomContext = createContext(null)

function useLocalState(key, initial) {
  const [state, setRaw] = useState(() => Store.get('wisdom_' + key, initial))
  const setState = useCallback((val) => {
    setRaw(prev => {
      const next = typeof val === 'function' ? val(prev) : val
      Store.set('wisdom_' + key, next)
      return next
    })
  }, [key])
  return [state, setState]
}

export function WisdomProvider({ children }) {
  const [userName, setUserName] = useLocalState('user_name', 'Ashiya')
  const [userSub, setUserSub] = useLocalState('user_sub', 'Keep growing')
  const [savedWisdom, setSavedWisdom] = useLocalState('saved', [])
  const [savedPages, setSavedPages] = useLocalState('saved_pages', [])
  const [pageNotes, setPageNotes] = useLocalState('page_notes', {})
  const [streakLog, setStreakLog] = useLocalState('streak_log', {})
  const [openedBooks, setOpenedBooks] = useLocalState('opened_books', [])
  const [bookProgress, setBookProgress] = useLocalState('book_progress', {})

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
    // BUG I FIX: Use distinct labels — was ['S','M','T','W','T','F','S'] where Sat+Sun both showed 'S'
    const dayLabels = ['Su', 'M', 'T', 'W', 'T', 'F', 'Sa']

    const result = []
    const td = new Date()
    const dayOfWeek = td.getDay()
    // Monday = 1, Sunday = 0  → offset to Monday as start
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
    // remaining days of the week after today
    const remaining = 7 - result.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(td)
      d.setDate(d.getDate() + i)
      const iso = d.toISOString().slice(0, 10)
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
