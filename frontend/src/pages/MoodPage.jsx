import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import PageLayout from '../components/ui/PageLayout'
import JournalAnalyticsPanel from '../components/journal/JournalAnalyticsPanel'
import journalBg from '../assets/pages/journal_bg.webp'

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function MoodPage() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const { journal: entries } = useWellness()

  const cycles = useMemo(() => {
    const dateSet = new Set(entries.map(e => e.date))
    let count = 0
    const d = new Date()
    let currentStr = getLocalYYYYMMDD(d)
    
    if (!dateSet.has(currentStr)) {
      d.setDate(d.getDate() - 1)
      currentStr = getLocalYYYYMMDD(d)
      if (!dateSet.has(currentStr)) {
        d.setDate(d.getDate() - 1)
        currentStr = getLocalYYYYMMDD(d)
      }
    }
    
    if (dateSet.has(currentStr)) {
      while (true) {
        if (dateSet.has(currentStr)) {
          count++
          d.setDate(d.getDate() - 1)
          currentStr = getLocalYYYYMMDD(d)
        } else {
          const tempD = new Date(d)
          tempD.setDate(tempD.getDate() - 1)
          const tempStr = getLocalYYYYMMDD(tempD)
          if (dateSet.has(tempStr)) {
            d.setDate(d.getDate() - 1)
            currentStr = getLocalYYYYMMDD(d)
          } else {
            break
          }
        }
      }
    }
    return count
  }, [entries])

  const topMoodInfo = useMemo(() => {
    const counts = {}
    entries.forEach(e => {
      if (e.mood) counts[e.mood] = (counts[e.mood] || 0) + 1
    })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const top = sorted[0]?.[0] || null
    
    const emojis = {
      Grateful: '❤️', Calm: '🌊', Energized: '☀️',
      Reflective: '🌙', Happy: '🌸', Tired: '☁️'
    }
    
    return {
      mood: top || 'Peaceful',
      emoji: top ? (emojis[top] || '🧘') : '🧘'
    }
  }, [entries])

  return (
    <PageLayout className="relative">
      {/* Background with dark overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${journalBg})` }}
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
      </div>

      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-saffron/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 md:pt-20 pb-36 md:pb-32">
        {/* Header bar with Back button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/journal')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gold/20 hover:border-gold/45 text-xs font-semibold text-ivory/80 hover:text-ivory bg-white/5 dark:bg-white/[0.02] transition-colors cursor-pointer select-none"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <ArrowLeft size={13} className="text-gold" />
            Back to Journal
          </button>
          
          <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
        </div>

        {/* Page Titles */}
        <div className="mb-8 text-center md:text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-saffron flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="w-8 h-px bg-saffron/50" />
            Emotional Sanctuary
            <span className="w-8 h-px bg-saffron/50 md:hidden" />
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Mood Insights & <span className="text-gold">Analytics</span>
          </h1>
          <p className="text-[11px] md:text-xs text-ivory/50 mt-2 font-light max-w-md mx-auto md:mx-0">
            Observe the waves of your inner world over the past week and month.
          </p>
        </div>

        {/* Stats Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Reflections */}
          <div className="journal-glass p-4 border border-gold/15 flex items-center gap-4 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl shadow-md">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gold/60 font-sans font-bold">
                Total Pages
              </p>
              <p className="text-sm font-semibold text-[#3d2e1a] dark:text-ivory font-serif">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="journal-glass p-4 border border-gold/15 flex items-center gap-4 bg-gradient-to-br from-saffron/5 to-transparent rounded-2xl shadow-md">
            <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-2xl">
              🔥
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-saffron/75 font-sans font-bold">
                Daily Streak
              </p>
              <p className="text-sm font-semibold text-[#3d2e1a] dark:text-ivory font-serif">
                {cycles} {cycles === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>

          {/* Dominant Mood */}
          <div className="journal-glass p-4 border border-gold/15 flex items-center gap-4 bg-gradient-to-br from-[#9775FA]/5 to-transparent rounded-2xl shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
              {topMoodInfo.emoji}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gold-lt/60 font-sans font-bold">
                Dominant Mood
              </p>
              <p className="text-sm font-semibold text-[#3d2e1a] dark:text-ivory font-serif truncate">
                {topMoodInfo.mood}
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        <JournalAnalyticsPanel
          entries={entries}
          cycles={cycles}
        />
      </div>
    </PageLayout>
  )
}
