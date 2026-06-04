import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, ChevronDown, ChevronUp,
  Heart, Waves, Sun, Moon, Flower2, Cloud, Sparkles
} from 'lucide-react'
import { today, fmtDate, uid } from '../utils'
import { useNotif } from '../components/system/NotificationPopup'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { useAuth } from '../context/AuthContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import { getHinduDetails } from '../utils/hinduCalendar'
import { getEmotionalReflection } from '../utils/emotionalMemory'
import LotusFlower from '../icons/LotusFlower'
import PageLayout from '../components/ui/PageLayout'
import journalBg from '../assets/pages/journal_bg.webp'

// Import subcomponents
import JournalLeftPageInfo from '../components/journal/JournalLeftPageInfo'
import ParchmentJournalCard from '../components/journal/ParchmentJournalCard'
import JournalRitualsPanel from '../components/journal/JournalRitualsPanel'
import JournalAnalyticsPanel from '../components/journal/JournalAnalyticsPanel'

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

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function Journal() {
  const { isAuthenticated } = useAuth()
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
  const [xpToast, setXpToast] = useState(null)
  
  // Prompt states
  const [catIndex, setCatIndex] = useState(0)
  const [promptIndex, setPromptIndex] = useState(0)

  // Pranayama Breathing states
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathState, setBreathState] = useState('idle') 
  const [breathTimer, setBreathTimer] = useState(4)

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
    setInkSplash(true)
    setTimeout(() => setInkSplash(false), 800)
    setXpToast('+25 XP')
    setTimeout(() => setXpToast(null), 1500)
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

  const totalEntries = entries.length
  const hasEntries = totalEntries > 0

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
            <JournalLeftPageInfo
              timeDetails={timeDetails}
              formattedDate={formattedDate}
              cycles={cycles}
              todayHindu={todayHindu}
              entries={entries}
            />

            {/* SPINE SEPARATOR GUTTER FOR DESKTOP */}
            <div className="hidden md:block w-[12px] bg-gradient-to-r from-black/20 via-[#1f140a] to-black/20 shadow-inner shrink-0" />

            {/* RIGHT PAGE */}
            <ParchmentJournalCard
              dark={dark}
              text={text}
              setText={setText}
              mood={mood}
              setMood={setMood}
              reflection={reflection}
              activePrompt={activePrompt}
              onSaveEntry={addEntry}
              onCyclePrompt={() => {
                const nextPrompt = promptIndex + 1;
                if (nextPrompt >= CATEGORIZED_PROMPTS[catIndex].prompts.length) {
                  setCatIndex((c) => (c + 1) % CATEGORIZED_PROMPTS.length);
                  setPromptIndex(0);
                } else {
                  setPromptIndex(nextPrompt);
                }
              }}
              inkSplash={inkSplash}
              xpToast={xpToast}
            />

          </div>

        </div>

        {/* ── LOWER UTILITY BAR (Sounds, Breathing, past entries) ── */}
        <JournalRitualsPanel
          isBreathing={isBreathing}
          setIsBreathing={setIsBreathing}
          breathState={breathState}
          breathTimer={breathTimer}
          activePreset={activePreset}
          toggleSound={toggleSound}
          isMuted={isMuted}
        />

        {/* ── MOOD ANALYTICS SECTION ── */}
        <JournalAnalyticsPanel
          entries={entries}
          cycles={cycles}
        />

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

      {/* XP Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            key="xp-toast"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', bottom: '30%', left: '50%', transform: 'translateX(-50%)',
              zIndex: 9999,
              background: 'linear-gradient(135deg, #c9933a, #e8a62a)',
              color: '#1a0f00',
              padding: '10px 24px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 8px 32px rgba(201,147,58,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'none',
            }}
          >
            <Sparkles size={16} />
            {xpToast}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
