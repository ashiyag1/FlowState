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
  const [streakLog, setStreakLog] = useLocalState('streak_log', {})
  const [openedBooks, setOpenedBooks] = useLocalState('opened_books', [])
  const [bookProgress, setBookProgress] = useLocalState('book_progress', {})

  const toggleSavedWisdom = useCallback((id) => {
    setSavedWisdom(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [setSavedWisdom])

  const markStreakToday = useCallback(() => {
    const td = getToday()
    setStreakLog(prev => ({ ...prev, [td]: true }))
  }, [setStreakLog])

  const getStreakDays = useCallback(() => {
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const result = []
    const td = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(td)
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      result.push({
        label: dayLabels[d.getDay()],
        done: !!streakLog[iso],
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
