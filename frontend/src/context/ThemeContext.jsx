import { createContext, useContext, useEffect, useState } from 'react'
import { Store } from '../utils'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => Store.get('theme') === 'dark')

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