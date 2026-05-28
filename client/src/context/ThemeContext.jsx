import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ThemeCtx = createContext({ dark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      // Always default to light — dark only if visitor explicitly chose it before
      const stored = localStorage.getItem('theme')
      return stored === 'dark'
    } catch { return false }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark(d => !d), [])

  return <ThemeCtx.Provider value={{ dark, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
