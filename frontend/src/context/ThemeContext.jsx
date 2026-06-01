import { createContext, useContext, useEffect, useState } from 'react'
import { Store } from '../utils'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = Store.get('theme')
    if (saved !== null) return saved === 'dark'
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    Store.set('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)