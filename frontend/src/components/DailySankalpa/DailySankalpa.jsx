import { useState, useEffect } from 'react'
import SankalpaInput from './SankalpaInput'
import SankalpaDisplay from './SankalpaDisplay'

export default function DailySankalpa() {
  
  const [sankalpa, setSankalpa] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [dateSet, setDateSet] = useState(null)
  const [mounted, setMounted] = useState(false)

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('daily_sankalpa')
    if (stored) {
      try {
        const { text, isCompleted: completed, dateSet: storedDate } = JSON.parse(stored)
        const today = getTodayDate()
        
        // Reset if it's a new day
        if (storedDate !== today) {
          setSankalpa(null)
          setIsCompleted(false)
          setInputValue('')
          setDateSet(null)
        } else {
          setSankalpa(text)
          setIsCompleted(completed)
          setDateSet(storedDate)
        }
      } catch (e) {
        console.error('Failed to parse Daily Sankalpa from localStorage:', e)
        localStorage.removeItem('daily_sankalpa')
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!mounted) return
    
    if (sankalpa) {
      localStorage.setItem('daily_sankalpa', JSON.stringify({
        text: sankalpa,
        isCompleted,
        dateSet: dateSet || getTodayDate(),
      }))
    } else {
      localStorage.removeItem('daily_sankalpa')
    }
  }, [sankalpa, isCompleted, dateSet, mounted])

  const handleCommit = (text) => {
    setSankalpa(text)
    setDateSet(getTodayDate())
    setIsCompleted(false)
    setInputValue('')
  }

  const handleFulfill = () => {
    setIsCompleted(true)
  }

  if (!mounted) return null

  return (
    <div style={{ width: '100%', padding: '2rem 1.2rem' }}>
      {!sankalpa ? (
        <SankalpaInput 
          inputValue={inputValue}
          setInputValue={setInputValue}
          onCommit={handleCommit}
        />
      ) : (
        <SankalpaDisplay 
          sankalpa={sankalpa}
          isCompleted={isCompleted}
          onFulfill={handleFulfill}
        />
      )}
    </div>
  )
}
