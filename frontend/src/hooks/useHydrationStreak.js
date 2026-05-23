import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────
   useHydrationStreak
   
   Calculates how many consecutive days the user has hit
   their water goal, counting backwards from today.

   Was previously an inline useEffect inside Home.jsx.
   Extracted here so DashboardStats stays pure UI.

   Usage:
     import { useHydrationStreak } from '../hooks/useHydrationStreak'
     const streak = useHydrationStreak(todayTotal)

   Re-runs whenever todayTotal changes (e.g. user logs water).
───────────────────────────────────────────────────────────── */
export function useHydrationStreak(todayTotal) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    import('../utils').then(({ Store }) => {
      let count = 0
      const cursor = new Date()
      const log  = Store.get('water_log') || {}
      const goal = Store.get('water_goal') || 2500

      for (let i = 0; i < 365; i++) {
        const iso   = cursor.toISOString().slice(0, 10)
        const total = (log[iso] || []).reduce((sum, entry) => sum + entry.ml, 0)

        if (total >= goal) {
          count++
          cursor.setDate(cursor.getDate() - 1)
        } else {
          break
        }
      }

      setStreak(count)
    })
  }, [todayTotal])

  return streak
}
