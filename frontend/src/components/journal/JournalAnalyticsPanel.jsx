import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computeArchetype } from '../../utils/soulArchetype'

const MOODS = [
  { label: 'Grateful',  glow: 'rgba(244,114,182,0.12)',  tint: '#f472b6' },
  { label: 'Calm',      glow: 'rgba(96,165,250,0.10)',  tint: '#60a5fa' },
  { label: 'Energized', glow: 'rgba(251,191,36,0.12)',  tint: '#fbbf24' },
  { label: 'Reflective',glow: 'rgba(167,139,250,0.10)', tint: '#a78bfa' },
  { label: 'Happy',     glow: 'rgba(52,211,153,0.10)', tint: '#34d399' },
  { label: 'Tired',     glow: 'rgba(156,163,175,0.08)', tint: '#9ca3af' },
]

const MOOD_COLORS = {
  Grateful: '#f472b6', Calm: '#60a5fa', Energized: '#fbbf24',
  Reflective: '#a78bfa', Happy: '#34d399', Tired: '#9ca3af'
}

const MOOD_GRADIENTS = {
  Grateful: 'linear-gradient(180deg, #f472b6, #ec4899)',
  Calm: 'linear-gradient(180deg, #60a5fa, #3b82f6)',
  Energized: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
  Reflective: 'linear-gradient(180deg, #a78bfa, #8b5cf6)',
  Happy: 'linear-gradient(180deg, #34d399, #10b981)',
  Tired: 'linear-gradient(180deg, #9ca3af, #6b7280)'
}

const MOOD_EMOJIS = {
  Grateful: '❤️', Calm: '🌊', Energized: '☀️',
  Reflective: '🌙', Happy: '🌸', Tired: '☁️'
}

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function JournalAnalyticsPanel({ entries = [], cycles = 0 }) {
  const [hoveredDay, setHoveredDay] = useState(null)
  const [hoveredCell, setHoveredCell] = useState(null)

  const clientMoodTrends = useMemo(() => {
    const moodCounts = {}
    const dayMoods = {}
    const heatmap = {}
    const entriesList = entries || []

    for (const e of entriesList) {
      if (!e.date) continue
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
      }
      dayMoods[e.date] = e.mood || null
      
      if (!heatmap[e.date]) {
        heatmap[e.date] = { count: 0, mood: null, allMoods: [] }
      }
      heatmap[e.date].count++
      if (e.mood) {
        heatmap[e.date].mood = e.mood
        if (!heatmap[e.date].allMoods.includes(e.mood)) {
          heatmap[e.date].allMoods.push(e.mood)
        }
      }
    }

    const sevenDayMoods = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = getLocalYYYYMMDD(d)
      sevenDayMoods.push({ date: ds, mood: dayMoods[ds] || null })
    }

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    return {
      moodCounts,
      dayMoods,
      heatmap,
      sevenDayMoods,
      topMood,
      totalEntries: entriesList.length
    }
  }, [entries])

  const days = clientMoodTrends.sevenDayMoods
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const cells = useMemo(() => {
    const list = []
    for (let i = 27; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = getLocalYYYYMMDD(d)
      const entry = clientMoodTrends.heatmap[ds]
      list.push({ date: ds, mood: entry?.mood || null, allMoods: entry?.allMoods || [], count: entry?.count || 0 })
    }
    return list
  }, [clientMoodTrends.heatmap])

  const { archetype } = useMemo(() => computeArchetype(entries), [entries])

  const insight = useMemo(() => {
    if (!clientMoodTrends.topMood) return null
    const insightMap = {
      Reflective: "You tend to sit with your thoughts more than most. That's not overthinking — that's depth.",
      Tired: "Your body is speaking. Rest isn't giving up — it's the most radical act of self-love.",
      Calm: "Stillness is your superpower. You carry peace that others are still searching for.",
      Energized: "Your energy is contagious. Channel it — you're capable of more than you realise.",
      Grateful: "Gratitude is rare. You've trained your brain to notice what most people overlook.",
      Happy: "You let yourself feel joy — and that takes more courage than most admit.",
    }
    return insightMap[clientMoodTrends.topMood] || null
  }, [clientMoodTrends.topMood])

  if (!entries || entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 flex flex-col gap-5 text-center p-8 journal-glass border border-gold/20"
      >
        <div className="text-gold mb-2 text-2xl">🌱</div>
        <h3 className="font-display text-sm text-ivory font-semibold mb-1">
          Your Journey Begins
        </h3>
        <p className="text-[11px] text-ivory/60 font-light max-w-sm mx-auto">
          Write your first entry to start tracking your emotional patterns and discover your soul archetype.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 flex flex-col gap-5"
    >

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 📊 7-Day Mood Pulse */}
        <div className="journal-glass p-5 border border-gold/20 relative flex flex-col justify-between min-h-[220px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm text-ivory flex items-center gap-2 font-semibold">
              📊 7-Day Mood Pulse
            </h3>
            {clientMoodTrends.topMood && (
              <span className="text-[9px] text-gold-lt/60 uppercase tracking-wider font-bold">
                Most felt: {clientMoodTrends.topMood}
              </span>
            )}
          </div>
          
          <div className="flex items-end justify-between gap-1 h-24 px-2 relative">
            {days.map((d, i) => {
              const color = d.mood ? (MOOD_COLORS[d.mood] || '#c9933a') : 'rgba(255, 255, 255, 0.08)'
              const gradient = d.mood ? MOOD_GRADIENTS[d.mood] : 'rgba(255, 255, 255, 0.08)'
              const height = d.mood ? Math.max(30, 45 + (Object.keys(MOOD_COLORS).indexOf(d.mood) * 8)) : 12
              
              const [year, month, day] = d.date.split('-').map(Number)
              const dateObj = new Date(year, month - 1, day)
              const label = dayLabels[dateObj.getDay()]
              const emoji = d.mood ? MOOD_EMOJIS[d.mood] : '🧘'
              const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              
              return (
                <div 
                  key={i} 
                  className="flex flex-col items-center gap-1.5 flex-1 relative cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const containerRect = e.currentTarget.parentElement.getBoundingClientRect()
                    const x = rect.left - containerRect.left + (rect.width / 2)
                    setHoveredDay({
                      x,
                      dateLabel,
                      mood: d.mood,
                      emoji,
                      color
                    })
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height }}
                    whileHover={{ scaleY: 1.05 }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeOut' }}
                    style={{ 
                      background: gradient, 
                      borderRadius: '999px', 
                      width: '12px', 
                      minHeight: 12,
                      boxShadow: d.mood ? `0 0 12px ${color}40` : 'none',
                    }}
                  />
                  <span className="text-[8px] text-ivory/40 font-mono mt-1">{label}</span>
                  {d.mood && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ fontSize: 10, color, opacity: 0.9 }}
                    >
                      {emoji}
                    </motion.span>
                  )}
                </div>
              )
            })}
            
            {/* Tooltip for 7-Day Pulse */}
            <AnimatePresence>
              {hoveredDay && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    bottom: '85px',
                    left: hoveredDay.x,
                    transform: 'translateX(-50%)',
                    zIndex: 50,
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: 'rgba(26, 18, 8, 0.95)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    minWidth: '100px'
                  }}
                >
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" }}>
                    {hoveredDay.dateLabel}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: hoveredDay.color || '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>{hoveredDay.emoji}</span>
                    <span>{hoveredDay.mood || 'Quiet Day'}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 🗓️ 28-Day Mood Map */}
        <div className="journal-glass p-5 border border-gold/20 relative flex flex-col justify-between min-h-[220px]">
          <div>
            <h3 className="font-display text-sm text-ivory font-semibold mb-4 flex items-center gap-2">
              🗓️ 28-Day Mood Map
              <span className="text-[9px] text-ivory/40 font-sans font-normal normal-case">hover for details</span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, position: 'relative' }}>
              {cells.map((c, i) => {
                const hasMoods = c.allMoods && c.allMoods.length > 0;
                const color = hasMoods ? (MOOD_COLORS[c.allMoods[c.allMoods.length - 1]] || '#c9933a') : 'rgba(255, 255, 255, 0.05)'
                
                let gradient = 'rgba(255, 255, 255, 0.05)'
                if (hasMoods) {
                  if (c.allMoods.length === 1) {
                    gradient = MOOD_GRADIENTS[c.allMoods[0]] || MOOD_COLORS[c.allMoods[0]]
                  } else {
                    const colors = c.allMoods.map(m => MOOD_COLORS[m] || '#c9933a')
                    gradient = `linear-gradient(135deg, ${colors.join(', ')})`
                  }
                }

                const emoji = c.mood ? MOOD_EMOJIS[c.mood] : '🧘'
                
                const [year, month, day] = c.date.split('-').map(Number)
                const dateObj = new Date(year, month - 1, day)
                const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.4, zIndex: 10 }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const containerRect = e.currentTarget.parentElement.getBoundingClientRect()
                      const x = rect.left - containerRect.left + (rect.width / 2)
                      const y = rect.top - containerRect.top
                      setHoveredCell({
                        x,
                        y,
                        dateLabel,
                        mood: hasMoods ? c.allMoods.join(' & ') : null,
                        count: c.count,
                        emoji,
                        color
                      })
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '50%',
                      background: gradient,
                      border: c.count > 0 ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: c.count > 0 ? `0 0 12px ${color}80, inset 0 0 8px rgba(255,255,255,0.5)` : 'none',
                      opacity: c.count > 0 ? 1 : 0.15,
                      cursor: c.count > 0 ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                  >
                    {c.count > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '30%', height: '30%',
                        background: '#fff',
                        borderRadius: '50%',
                        filter: 'blur(1px)'
                      }} />
                    )}
                  </motion.div>
                )
              })}
              
              {/* Tooltip for Heatmap */}
              <AnimatePresence>
                {hoveredCell && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      top: hoveredCell.y,
                      left: hoveredCell.x,
                      transform: 'translateX(-50%)',
                      zIndex: 50,
                      padding: '6px 10px',
                      borderRadius: '10px',
                      background: 'rgba(26, 18, 8, 0.95)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      pointerEvents: 'none',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}
                  >
                    <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
                      {hoveredCell.dateLabel}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: hoveredCell.color || '#fff', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <span>{hoveredCell.emoji}</span>
                      <span>{hoveredCell.mood || 'Quiet Day'}</span>
                    </div>
                    {hoveredCell.count > 1 && (
                      <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                        {hoveredCell.count} entries
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-3 border-t border-gold/10 pt-2">
            {Object.entries(MOOD_COLORS).map(([mName, color]) => (
              <div key={mName} className="flex items-center gap-1">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.8 }} />
                <span className="text-[8px] text-ivory/50">{mName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emotional Pattern Insight */}
      {clientMoodTrends.topMood && insight && (
        <div className="journal-glass p-5 border border-gold/20 flex items-start gap-4">
          <span style={{ fontSize: 22, flexShrink: 0 }}>{archetype?.emoji || '🧘'}</span>
          <div>
            <p className="text-[9px] text-gold/60 uppercase tracking-widest font-bold font-sans mb-1.5">
              Emotional Pattern · {clientMoodTrends.topMood} Soul
            </p>
            <p className="text-xs text-ivory/80 font-serif italic leading-relaxed">
              "{insight}"
            </p>
            <p className="text-[9px] text-ivory/40 mt-2 font-mono">
              Based on {clientMoodTrends.totalEntries} journal entries
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default JournalAnalyticsPanel
