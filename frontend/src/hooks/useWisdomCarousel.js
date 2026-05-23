import { useState, useEffect, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────
   useWisdomCarousel

   Manages slide index and auto-advance interval for the
   WisdomCarousel section. Was previously inline state +
   useEffect inside Home.jsx.

   Args:
     total  — number of slides (e.g. SLIDES.length)
     delay  — ms between auto-advances (default: 5500)

   Returns:
     slide   — current slide index (number)
     goNext  — advance one slide forward
     goPrev  — go one slide back
     goTo    — jump to a specific index (used by dot buttons)

   Usage:
     import { useWisdomCarousel } from '../hooks/useWisdomCarousel'
     const { slide, goNext, goPrev, goTo } = useWisdomCarousel(SLIDES.length)
───────────────────────────────────────────────────────────── */
export function useWisdomCarousel(total, delay = 5500) {
  const [slide, setSlide] = useState(0)

  // Wrap in useCallback so the interval doesn't re-register
  // every render when goNext is used as a dependency
  const goNext = useCallback(() => {
    setSlide(s => (s + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setSlide(s => (s - 1 + total) % total)
  }, [total])

  const goTo = useCallback((index) => {
    setSlide(index)
  }, [])

  // Auto-advance — resets whenever the user manually navigates
  useEffect(() => {
    const timer = setInterval(goNext, delay)
    return () => clearInterval(timer)
  }, [goNext, delay])

  return { slide, goNext, goPrev, goTo }
}
