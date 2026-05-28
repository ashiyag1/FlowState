import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenLine, Trash2, ChevronDown, ChevronUp,
  Heart, Waves, Sun, Moon, Flower2, Cloud,
  X, BookOpen, CalendarDays, Flame, Play, Pause, Volume2, Sparkles, BookText, Feather
} from 'lucide-react'
import { Store, today, fmtDate, uid } from '../utils'
import { useNotif } from '../components/system/NotificationPopup'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { useAuth } from '../context/AuthContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import { getHinduDetails, getScientificInsights } from '../utils/hinduCalendar'
import { getEmotionalReflection } from '../utils/emotionalMemory'
import { computeArchetype } from '../utils/soulArchetype'
import LotusFlower from '../icons/LotusFlower'
import DiyaLamp from '../icons/DiyaLamp'
import PageLayout from '../components/ui/PageLayout'
import journalBg from '../assets/pages/journal_bg.webp'

const MOODS = [
  { label: 'Grateful',  moodIcon: Heart,   bg: 'bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/20 dark:hover:bg-rose-900/30',   text: 'text-rose-700 dark:text-rose-300',   glow: 'rgba(244,114,182,0.12)',  tint: '#f472b6' },
  { label: 'Calm',      moodIcon: Waves,   bg: 'bg-sky-100/70 hover:bg-sky-200/80 dark:bg-sky-950/20 dark:hover:bg-sky-900/30',    text: 'text-sky-700 dark:text-sky-300',    glow: 'rgba(96,165,250,0.10)',  tint: '#60a5fa' },
  { label: 'Energized', moodIcon: Sun,     bg: 'bg-amber-100/70 hover:bg-amber-200/80 dark:bg-amber-950/20 dark:hover:bg-amber-900/30', bgActive: 'from-amber-300 to-yellow-400', text: 'text-amber-700 dark:text-amber-300', glow: 'rgba(251,191,36,0.12)',  tint: '#fbbf24' },
  { label: 'Reflective',moodIcon: Moon,    bg: 'bg-purple-100/70 hover:bg-purple-200/80 dark:bg-purple-950/20 dark:hover:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', glow: 'rgba(167,139,250,0.10)', tint: '#a78bfa' },
  { label: 'Happy',     moodIcon: Flower2, bg: 'bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', glow: 'rgba(52,211,153,0.10)', tint: '#34d399' },
  { label: 'Tired',     moodIcon: Cloud,   bg: 'bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-950/20 dark:hover:bg-slate-900/30',  text: 'text-slate-700 dark:text-slate-300',  glow: 'rgba(156,163,175,0.08)', tint: '#9ca3af' },
]

const CATEGORIZED_PROMPTS = [
  {
    category: '🌅 Gratitude',
    prompts: [
      { text: "What would make today even better?", template: "I would feel even better today if: \n\nWhat I can focus on next: \n" },
      { text: "What are three micro-moments of beauty you noticed today?", template: "Three Micro-Moments of Beauty today:\n1. \n2. \n3. \n" },
      { text: "Who is someone you felt thankful for today, and why?", template: "Today I felt thankful for: [Name]\nBecause: \n" }
    ]
  },
  {
    category: '🌿 Introspection',
    prompts: [
      { text: "What did your inner voice try to whisper to you today?", template: "Today, my inner voice was saying: \n\nWhen I sit in stillness, I realize I need:\n" },
      { text: "What is a lesson you learned from a difficult moment today?", template: "A challenging moment today: \n\nWhat it revealed about my reactions or patterns:\n" }
    ]
  },
  {
    category: '🌙 Twilight Unwind',
    prompts: [
      { text: "What worries or mental clutter are you ready to release tonight?", template: "Tonight, I release the worry about: \n\nMy mind is now ready for deep rest.\n" },
      { text: "How can you show yourself kindness for anything left unfinished?", template: "Things left undone today:\n\nMy gentle reminder to myself: It is okay to rest now.\n" }
    ]
  }
]

const AMBIENT_SOUNDS = [
  { preset: 'sitarBgm', label: 'Sitar BGM', icon: '🪕' },
  { preset: 'flute', label: 'Bansuri Flute', icon: '🎵' },
  { preset: 'meditation', label: 'Temple Bells', icon: '🔔' },
  { preset: 'omSound', label: 'Om Chant', icon: '🕉️' },
  { preset: 'rain', label: 'Forest Rain', icon: '🌧️' }
]

function MoonIllustration({ phasePercent }) {
  const isFull = phasePercent >= 46 && phasePercent <= 54
  const isNew = phasePercent <= 4 || phasePercent >= 96
  const isWaxing = phasePercent > 4 && phasePercent < 46

  return (
    <svg width="64" height="64" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }} className="mx-auto my-2">
      <circle cx="50" cy="50" r="40" fill="#1b1208" stroke="#c9933a" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="38" fill="url(#moonGlow)" opacity="0.1" />
      {isFull ? (
        <circle cx="50" cy="50" r="38" fill="#fcfcf7" />
      ) : isNew ? (
        <circle cx="50" cy="50" r="38" fill="#140f0a" />
      ) : (
        <path
          d={
            isWaxing 
              ? "M 50 12 A 38 38 0 0 1 50 88 A 38 38 0 0 0 50 12" 
              : "M 50 12 A 38 38 0 0 0 50 88 A 38 38 0 0 1 50 12"
          }
          fill="#fcfcf7"
        />
      )}
      <circle cx="35" cy="35" r="3.5" fill="#8a5a2b" opacity="0.08" />
      <circle cx="65" cy="45" r="5" fill="#8a5a2b" opacity="0.08" />
      <circle cx="48" cy="65" r="4" fill="#8a5a2b" opacity="0.06" />
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#c9933a" />
        </radialGradient>
      </defs>
    </svg>
  )
}

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function Journal() {
  const { isAuthenticated, token } = useAuth()
  const navigate = useNavigate()
  const { dark } = useTheme()
  const notif = useNotif()
  const td = today()
  const { journal: entries, addEntry: addWellnessEntry, deleteEntry: deleteWellnessEntry, habitDone } = useWellness()
  const { trackEvent } = useAchievements()
  const reflection = useMemo(() => getEmotionalReflection(entries, habitDone), [entries, habitDone])
  const { startWisdomAmbience, stopWisdomAmbience, isMuted } = useSoundEffects()

  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [inkSplash, setInkSplash] = useState(false)
  const [activePreset, setActivePreset] = useState(null)
  
  // Prompt states
  const [catIndex, setCatIndex] = useState(0)
  const [promptIndex, setPromptIndex] = useState(0)

  // Pranayama Breathing states
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathState, setBreathState] = useState('idle') 
  const [breathTimer, setBreathTimer] = useState(4)

  // Tooltip interactive states
  const [hoveredDay, setHoveredDay] = useState(null)
  const [hoveredCell, setHoveredCell] = useState(null)

  // Client-side timezone-safe Mood Trends calculation
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
      // Day moods (last entry of the day wins)
      dayMoods[e.date] = e.mood || null
      
      // Heatmap
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

    // 7-day window (local timezone safe!)
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

  const textareaRef = useRef(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }

  // Box Breathing Loop
  useEffect(() => {
    let interval = null
    if (isBreathing) {
      if (breathState === 'idle') {
        setBreathState('inhale')
        setBreathTimer(4)
      }
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathState((curr) => {
              switch (curr) {
                case 'inhale': return 'holdIn'
                case 'holdIn': return 'exhale'
                case 'exhale': return 'holdOut'
                case 'holdOut': return 'inhale'
                default: return 'inhale'
              }
            })
            return 4
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setBreathState('idle')
      setBreathTimer(4)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isBreathing, breathState])

  // Stop sound loops on exit
  useEffect(() => {
    return () => {
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  const toggleSound = (preset) => {
    if (activePreset === preset) {
      stopWisdomAmbience()
      setActivePreset(null)
    } else {
      startWisdomAmbience(preset)
      setActivePreset(preset)
    }
  }

  const addEntry = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!text.trim()) return
    const entry = {
      id: uid(),
      date: td,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
      mood,
    }
    addWellnessEntry(entry)
    trackEvent('journal_added')
    setText(''); setMood('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setInkSplash(true)
    setTimeout(() => setInkSplash(false), 800)
    notif('Reflections sealed & saved ✦', 'success')
  }

  const deleteEntry = (id) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    deleteWellnessEntry(id)
    notif('Entry removed', 'default')
  }

  const grouped = entries.reduce((acc, e) => {
    const k = e.date || td
    if (!acc[k]) acc[k] = []
    acc[k].push(e)
    return acc
  }, {})

  const cycles = useMemo(() => {
    const dateSet = new Set(entries.map(e => e.date))
    let count = 0
    const d = new Date()
    let currentStr = getLocalYYYYMMDD(d)
    
    // Check today, then yesterday, then the day before (up to 1 rest day initially)
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
          // Check if it's just a 1-day gap (Rest Day)
          const tempD = new Date(d)
          tempD.setDate(tempD.getDate() - 1)
          const tempStr = getLocalYYYYMMDD(tempD)
          if (dateSet.has(tempStr)) {
            // Found an entry the day before the gap. Count the gap as a forgiven rest day.
            d.setDate(d.getDate() - 1)
            currentStr = getLocalYYYYMMDD(d)
          } else {
            break // 2-day gap breaks the cycle
          }
        }
      }
    }
    return count
  }, [entries])

  const totalEntries = entries.length
  const uniqueDays = Object.keys(grouped).length
  const hasEntries = totalEntries > 0

  const currentMood = MOODS.find(m => m.label === mood)
  const moodGlow = currentMood?.glow || 'transparent'

  // Dynamic Date Formatting matching mockup: e.g. "23 May • 11:42 PM"
  const formattedDate = useMemo(() => {
    const day = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${day} • ${time}`
  }, [])

  const timeDetails = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return { label: 'Morning', icon: '🍃', weather: 'Fresh morning' }
    if (h < 17) return { label: 'Afternoon', icon: '☀️', weather: 'Sunlit afternoon' }
    if (h < 22) return { label: 'Evening', icon: '🪶', weather: 'Quiet evening' }
    return { label: 'Night', icon: '🌙', weather: 'Peaceful night' }
  }, [])

  // Local Hindu Tithi details
  const todayHindu = getHinduDetails(td)

  const activeCategory = CATEGORIZED_PROMPTS[catIndex]
  const activePrompt = activeCategory.prompts[promptIndex % activeCategory.prompts.length]

  return (
    <PageLayout className="relative">
      
      {/* Journal Background with dark overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${journalBg})` }}
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-32">
        
        {/* ── THE BOOK CONTAINER (100% Mockup-Accurate) ── */}
        <div className="relative mt-4 notebook-container">
          
          {/* Hanging Gold Tassel Left Margin */}
          <div className="book-tassel-cord hidden md:block">
            <div className="book-tassel-pendant">🪷</div>
            <div className="book-tassel-fringe" />
          </div>

          {/* Bookmark flap Right Margin */}
          <div className="book-bookmark-flap hidden md:flex">
            <LotusFlower size={12} />
          </div>

          {/* Book Spine Center Highlight (Embossed Shadows) */}
          <div className="notebook-body relative rounded-2xl bg-gradient-to-r from-[#2d1e0f] to-[#1a1208] p-1 border border-gold/30 shadow-2xl flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT PAGE */}
            <div className="flex-1 p-6 md:p-8 bg-[#f6efe2] dark:bg-[#1a1510] border-r border-[#c9a84c20] shadow-[inset_-8px_0_16px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[460px]">
              
              {/* Header section */}
              <div>
                <div className="flex items-center gap-2 text-[#8a5a2b] dark:text-gold-lt">
                  <span className="text-sm">{timeDetails.icon}</span>
                  <h3 className="font-display text-lg tracking-wide uppercase font-semibold">
                    {timeDetails.label} Reflection
                  </h3>
                </div>
                
                <p className="text-xs text-[#5c3b17]/60 dark:text-ivory/50 mt-1 font-light font-mono">
                  {formattedDate}
                </p>
                
                <span className="inline-block mt-3 text-[10px] bg-gold/15 dark:bg-gold/10 text-[#8a5a2b] dark:text-gold-lt font-sans font-bold px-3 py-1 rounded-full border border-gold/20">
                  ✨ {cycles || 0} nights of reflection
                </span>
              </div>

              {/* Today's Energy Card */}
              <div className="my-6 p-4 rounded-xl border border-gold/25 bg-white/50 dark:bg-black/30 text-center shadow-inner relative">
                <p className="text-[9px] uppercase tracking-widest text-[#8a5a2b] dark:text-gold-lt font-bold mb-1">
                  Tonight's Energy
                </p>
                
                {/* Dynamically drawing Moon Phase SVG */}
                <MoonIllustration phasePercent={todayHindu.phasePercent} />

                <h4 className="font-display text-xs font-bold text-ink dark:text-ivory">
                  {todayHindu.paksha.split(' ')[0]} Phase ({todayHindu.moonSymbol})
                </h4>
                
                <div className="w-12 h-[1px] bg-gold/30 mx-auto my-2" />
                
                <p className="text-[10px] text-[#5c3b17]/70 dark:text-ivory/60 italic">
                  {timeDetails.weather}
                </p>
              </div>

              {/* Wisdom Quote at bottom */}
              <div className="border-t border-[#c9a84c20] pt-4 text-center">
                <p className="text-xs text-[#5c3b17]/80 dark:text-ivory/70 italic leading-relaxed font-light">
                  "{entries.length > 0 ? "Stillness does not mean absence of movement, but harmony in it." : "The quiet hours cradle your innermost truths."}"
                </p>
                <span className="text-[9px] uppercase tracking-wider text-gold font-bold mt-1.5 block">
                  — Sri Sri
                </span>
              </div>

            </div>

            {/* SPINE SEPARATOR GUTTER FOR DESKTOP */}
            <div className="hidden md:block w-[12px] bg-gradient-to-r from-black/20 via-[#1f140a] to-black/20 shadow-inner shrink-0" />

            {/* RIGHT PAGE */}
            <div className="flex-1 p-6 md:p-8 bg-[#fbf6ee] dark:bg-[#1f1913] shadow-[inset_8px_0_16px_rgba(0,0,0,0.06)] flex flex-col justify-between relative min-h-[460px]">
              
              {/* Inner Parchment glow container */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: mood ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  background: mood
                    ? `radial-gradient(circle at 75% 50%, ${moodGlow} 0%, transparent 80%)`
                    : 'transparent',
                }}
              />

              {/* Title & Help details */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-xs text-gold flex items-center gap-1.5 uppercase font-bold tracking-widest">
                    ✦ Today's Reflection
                  </h4>
                  
                  {/* Category Cycle button for Inspiration */}
                  <button
                    onClick={() => {
                      setCatIndex((c) => (c + 1) % CATEGORIZED_PROMPTS.length)
                      setPromptIndex(0)
                    }}
                    className="text-[9px] text-[#8a5a2b] dark:text-gold-lt bg-gold/10 hover:bg-gold/20 py-0.5 px-2 rounded-full border border-gold/20 transition-all font-semibold"
                  >
                    Inspire Me ✦
                  </button>
                </div>
                
                <h2 className="font-display text-lg md:text-xl text-[#2d1f0e] dark:text-ivory mt-1 leading-snug">
                  {activePrompt.text}
                </h2>
                <p className="text-[10px] text-[#5c3b17]/50 dark:text-ivory/50 mt-1 font-light font-mono">
                  Tune into your heart. There is no right or wrong here.
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl border border-gold/15 bg-white/25 dark:bg-black/20 text-left">
                  <p className="text-[11px] font-serif italic text-sandalwood dark:text-gold-lt leading-relaxed">
                    "{reflection.message}"
                  </p>
                </div>

                {/* Mood selector pills */}
                <div className="flex flex-wrap gap-1.5 mt-3.5 pb-2">
                  {MOODS.map(m => {
                    const Icon = m.moodIcon
                    const selected = mood === m.label
                    return (
                      <button
                        key={m.label}
                        onClick={() => {
                          setMood(selected ? '' : m.label)
                          // Inject template automatically if text area is empty
                          if (!text.trim()) {
                            injectTemplate(activePrompt.template)
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all border ${
                          selected
                            ? 'bg-gradient-to-br from-gold to-[#c9933a] text-white shadow-md border-transparent scale-[1.03]'
                            : `${m.bg} ${m.text} border-gold/10 hover:scale-[1.02]`
                        }`}
                      >
                        <Icon size={11} className={selected ? 'text-white' : 'opacity-70'} />
                        <span>{m.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Lined Text Editor Area */}
              <div className="relative z-10 flex-1 flex flex-col mt-4">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={e => { setText(e.target.value); autoResize() }}
                  placeholder="Let your thoughts stream gently onto these pages..."
                  maxLength={1000}
                  className="w-full flex-1 min-h-[220px] bg-transparent text-ink dark:text-ivory text-xs md:text-sm font-body leading-loose placeholder:text-gold/25 placeholder:italic resize-none focus:outline-none parchment-lines"
                />
                
                {text && (
                  <button
                    onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto' }}
                    className="absolute top-0 right-0 p-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 text-ink/40 dark:text-ivory/40 transition-all"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Save Seal Block & Character Counter */}
              <div className="relative z-10 flex items-center justify-between border-t border-gold/15 pt-3 mt-4">
                <span className="flex items-center gap-1 text-[9px] text-[#8a5a2b] dark:text-gold-lt/70 italic font-mono font-medium">
                  <Feather size={10} />
                  {text.length}/1000 characters
                </span>

                {/* Purple Wax Seal Button */}
                <div className="relative">
                  <AnimatePresence>
                    {inkSplash && (
                      <motion.div
                        key="ink-splash"
                        initial={{ scale: 0.2, opacity: 0.7 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-gold/50 pointer-events-none"
                        style={{ filter: 'blur(5px)' }}
                      />
                    )}
                  </AnimatePresence>

                  <div 
                    onClick={addEntry}
                    className={`wax-seal-wood-container ${!text.trim() && 'opacity-30 cursor-not-allowed'}`}
                  >
                    <div className="wax-seal-purple-seal">
                      <LotusFlower size={20} />
                    </div>
                    <div className="wax-seal-wood-text">
                      <span className="wax-seal-wood-text-title">Preserve Reflection</span>
                      <span className="wax-seal-wood-text-subtitle">Seal this thought</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ── LOWER UTILITY BAR (Sounds, Breathing, past entries) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          {/* PRANAYAMA BOX BREATHING */}
          <div className="journal-glass p-5 border border-gold/25 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display text-sm text-ivory flex items-center gap-2 font-semibold">
                  <Sparkles size={14} className="text-gold" /> Pranayama Unwind
                </h3>
                <p className="text-[10px] text-ivory/50 font-light">
                  A dynamic box breathing practice to slow circadian rhythms.
                </p>
              </div>
              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all border ${
                  isBreathing
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-gold/15 text-gold-lt border-gold/30 hover:bg-gold/25'
                }`}
              >
                {isBreathing ? 'Stop' : 'Begin'}
              </button>
            </div>

            <div className="h-28 flex items-center justify-center rounded-xl bg-black/20 border border-white/5">
              {isBreathing ? (
                <div className="text-center">
                  <motion.div
                    key={breathState}
                    animate={
                      breathState === 'inhale' ? { scale: [1, 1.3] } :
                      breathState === 'holdIn' ? { scale: 1.3 } :
                      breathState === 'exhale' ? { scale: [1.3, 1] } : { scale: 1 }
                    }
                    transition={{ duration: breathState.startsWith('hold') ? 0 : 4, ease: 'easeInOut' }}
                    className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto"
                  >
                    <LotusFlower size={16} className="text-gold" />
                  </motion.div>
                  <p className="text-xs font-display text-ivory mt-2 tracking-wider font-semibold">
                    {breathState === 'inhale' && 'Inhale (Puraka)'}
                    {breathState === 'holdIn' && 'Hold (Antar Kumbhaka)'}
                    {breathState === 'exhale' && 'Exhale (Rechaka)'}
                    {breathState === 'holdOut' && 'Hold (Bahya Kumbhaka)'}
                  </p>
                  <p className="text-[9px] text-gold-lt/60 mt-0.5 font-mono">{breathTimer} seconds</p>
                </div>
              ) : (
                <p className="text-xs text-ivory/40 italic px-6 text-center font-light leading-relaxed">
                  "Exhaling releases toxins. Holding balances pressure. Inhaling draws raw Prana."
                </p>
              )}
            </div>
          </div>

          {/* SACRED SOUNDS */}
          <div className="journal-glass p-5 border border-gold/25">
            <div className="mb-3">
              <h3 className="font-display text-sm text-ivory flex items-center gap-2 font-semibold">
                <Volume2 size={15} className="text-gold" /> Sacred Ambience
              </h3>
              <p className="text-[10px] text-ivory/50 font-light">
                Listen to comforting acoustic vibrations.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {AMBIENT_SOUNDS.map((sound) => {
                const isPlaying = activePreset === sound.preset && !isMuted
                return (
                  <button
                    key={sound.preset}
                    onClick={() => toggleSound(sound.preset)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-[11px] ${
                      isPlaying
                        ? 'bg-gold/20 border-gold text-ivory font-bold'
                        : 'bg-white/[0.03] border-white/5 text-ivory/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{sound.icon}</span>
                    <span className="truncate flex-1">{sound.label}</span>
                    {isPlaying && (
                      <div className="flex items-end gap-[1px] h-2.5">
                        <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_0.8s_infinite]" style={{ height: '60%' }} />
                        <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_1.2s_infinite]" style={{ height: '100%', animationDelay: '0.2s' }} />
                        <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_1.0s_infinite]" style={{ height: '40%', animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* ── MOOD ANALYTICS SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col gap-5"
        >
          {/* Cycle celebration banner */}
          {cycles >= 3 && (
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="journal-glass p-4 border border-gold/30 flex items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)'
              }} />
              <motion.span
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: 28 }}
              >🌕</motion.span>
              <div>
                <p className="font-display text-sm text-ivory font-bold">
                  {cycles}-Day Reflection Phase
                </p>
                <p className="text-[11px] text-ivory/60 font-light mt-0.5">
                  {cycles >= 7 ? 'A full phase completed. The mind remembers what you nurture.' :
                   cycles >= 5 ? 'Beautiful rhythm — your inner world is listening.' :
                   'Even the moon has phases. Thank you for showing up.'}
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <p className="text-[9px] text-gold/60 uppercase tracking-widest font-bold">Current Cycle</p>
                <p className="font-display text-2xl text-gold font-bold">{cycles}</p>
              </div>
            </motion.div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 📊 7-Day Mood Pulse */}
            {(() => {
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
              
              const days = clientMoodTrends.sevenDayMoods
              const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
              
              return (
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
              )
            })()}

            {/* 🗓️ 28-Day Mood Map */}
            {(() => {
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

              const cells = []
              for (let i = 27; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const ds = getLocalYYYYMMDD(d)
                const entry = clientMoodTrends.heatmap[ds]
                cells.push({ date: ds, mood: entry?.mood || null, allMoods: entry?.allMoods || [], count: entry?.count || 0 })
              }
              
              return (
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
                            {/* Subtle core for the orb */}
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
                    {Object.entries(MOOD_COLORS).map(([mood, color]) => (
                      <div key={mood} className="flex items-center gap-1">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.8 }} />
                        <span className="text-[8px] text-ivory/50">{mood}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Emotional Pattern Insight */}
          {clientMoodTrends && clientMoodTrends.topMood && (() => {
            const { archetype } = computeArchetype(entries)
            const insightMap = {
              Reflective: 'You tend to sit with your thoughts more than most. That\'s not overthinking — that\'s depth.',
              Tired: 'Your body is speaking. Rest isn\'t giving up — it\'s the most radical act of self-love.',
              Calm: 'Stillness is your superpower. You carry peace that others are still searching for.',
              Energized: 'Your energy is contagious. Channel it — you\'re capable of more than you realise.',
              Grateful: 'Gratitude is rare. You\'ve trained your brain to notice what most people overlook.',
              Happy: 'You let yourself feel joy — and that takes more courage than most admit.',
            }
            const insight = insightMap[clientMoodTrends.topMood]
            if (!insight) return null
            return (
              <div className="journal-glass p-5 border border-gold/20 flex items-start gap-4">
                <span style={{ fontSize: 22, flexShrink: 0 }}>{archetype.emoji}</span>
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
            )
          })()}
        </motion.div>

        {/* ── PAST JOURNAL ENTRIES LIST ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display text-lg text-ivory flex items-center gap-2">
              📖 Past Pages of your Journal
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
          </div>

          {!hasEntries ? (
            <div className="text-center py-10 journal-glass border border-gold/15">
              <LotusFlower size={36} className="text-gold/25 mx-auto mb-2" />
              <p className="text-xs text-ivory/60 italic">Your sacred journal is waiting for its first page.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {Object.entries(grouped).map(([date, dayEntries]) =>
                  dayEntries.map((e) => {
                    const moodObj = MOODS.find(m => m.label === e.mood)
                    const isExpanded = expanded === e.id
                    const preview = e.text.length > 120 ? e.text.slice(0, 120) + '…' : e.text
                    const Icon = moodObj?.moodIcon

                    return (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        layout
                        className="group journal-glass-card p-4 relative overflow-hidden border-l-[3px]"
                        style={{
                          borderLeftColor: moodObj ? moodObj.tint : 'rgba(201,168,76,0.35)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <span className={`w-5 h-5 rounded-full ${moodObj.bg} ${moodObj.text} flex items-center justify-center text-[9px] shrink-0`}>
                                <Icon size={10} />
                              </span>
                            )}
                            <div>
                              <span className="text-[10px] font-semibold text-gold-lt tracking-wide uppercase">
                                {date === td ? 'Today' : fmtDate(date)}
                              </span>
                              <span className="text-[9px] text-ivory/40 ml-2 font-mono">
                                {e.time || ''}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setExpanded(isExpanded ? null : e.id)}
                              className="p-1 rounded-full hover:bg-white/10 text-ivory/50 hover:text-gold transition-all"
                            >
                              {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                            <button
                              onClick={() => deleteEntry(e.id)}
                              className="p-1 rounded-full hover:bg-white/10 text-ivory/50 hover:text-rose-400 transition-all"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-ivory/85 leading-relaxed font-light whitespace-pre-wrap font-mono">
                          {isExpanded ? e.text : preview}
                        </p>
                        
                        {e.text.length > 120 && (
                          <button
                            onClick={() => setExpanded(isExpanded ? null : e.id)}
                            className="text-[9px] text-gold hover:underline mt-2 font-semibold opacity-70 hover:opacity-100"
                          >
                            {isExpanded ? 'Show less' : 'Read full page'}
                          </button>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

      </div>
    </PageLayout>
  )
}
