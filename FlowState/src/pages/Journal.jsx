import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenLine, Trash2, ChevronDown, ChevronUp,
  Heart, Waves, Sun, Moon, Flower2, Cloud,
  Sparkles, X, BookOpen, CalendarDays
} from 'lucide-react'
import { Store, today, fmtDate, uid } from '../utils'
import { useNotif } from '../components/NotificationPopup'
import LotusFlower from '../icons/LotusFlower'
import DiyaLamp from '../icons/DiyaLamp'
import journalBg from '../assets/pages/journal_bg.png'

const MOODS = [
  { label: 'Grateful',  moodIcon: Heart,   pastel: 'from-rose-100/70 to-pink-100/70',   active: 'from-rose-300 to-pink-400',   shadow: 'shadow-rose-200/40' },
  { label: 'Calm',      moodIcon: Waves,   pastel: 'from-sky-100/70 to-blue-100/70',    active: 'from-sky-300 to-blue-400',    shadow: 'shadow-sky-200/40' },
  { label: 'Energized', moodIcon: Sun,     pastel: 'from-amber-100/70 to-yellow-100/70', active: 'from-amber-300 to-yellow-400', shadow: 'shadow-amber-200/40' },
  { label: 'Reflective',moodIcon: Moon,    pastel: 'from-violet-100/70 to-purple-100/70',active: 'from-violet-300 to-purple-400',shadow: 'shadow-violet-200/40' },
  { label: 'Happy',     moodIcon: Flower2, pastel: 'from-emerald-100/70 to-green-100/70',active: 'from-emerald-300 to-green-400',shadow: 'shadow-emerald-200/40' },
  { label: 'Tired',     moodIcon: Cloud,   pastel: 'from-slate-100/70 to-gray-100/70',   active: 'from-slate-300 to-gray-400',  shadow: 'shadow-slate-200/40' },
]

const PROMPTS = [
  "What are three things you're grateful for today?",
  "What intention do you want to carry into tomorrow?",
  "What's one small win you want to acknowledge?",
  "How did your body feel today?",
  "What would make today even better?",
  "What are you learning about yourself lately?",
  "What moment made your heart feel light today?",
  "What are you ready to let go of?",
  "What does your inner voice long to express?",
]

export default function Journal() {
  const notif = useNotif()
  const td = today()

  const [entries, setEntries] = useState(() => Store.get('journal_entries') || [])
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [prompt] = useState(PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length])
  const textareaRef = useRef(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const save = (e) => { setEntries(e); Store.set('journal_entries', e) }

  const addEntry = () => {
    if (!text.trim()) return
    const entry = {
      id: uid(),
      date: td,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
      mood,
    }
    save([entry, ...entries])
    setText(''); setMood('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    notif('Entry saved ✦', 'success')
  }

  const deleteEntry = (id) => { save(entries.filter(e => e.id !== id)); notif('Entry removed', 'default') }

  const grouped = entries.reduce((acc, e) => {
    const k = e.date || td
    if (!acc[k]) acc[k] = []
    acc[k].push(e)
    return acc
  }, {})

  const totalEntries = entries.length
  const uniqueDays = Object.keys(grouped).length
  const hasEntries = totalEntries > 0

  const sparkles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      x: 10 + (i * 17) % 80,
      y: 15 + (i * 13 + 7) % 70,
      delay: i * 1.2,
      duration: 3 + (i % 3) * 1.5,
    })), []
  )

  return (
    <div
      className="journal-page relative"
      style={{ backgroundImage: `url(${journalBg})` }}
    >
      {/* Vignette overlay for atmospheric depth and readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-ink/35 via-ink/5 to-ink/45 dark:from-black/55 dark:via-ink/8 dark:to-black/65 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Floating sacred motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden hidden lg:block">
        <motion.div
          className="absolute top-[12%] left-[6%] opacity-15 dark:opacity-10"
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LotusFlower size={52} />
        </motion.div>

        <motion.div
          className="absolute bottom-[15%] right-[5%] opacity-[0.18] dark:opacity-10"
          animate={{ y: [0, -8, 0], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DiyaLamp size={48} />
        </motion.div>

        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute text-gold/20 dark:text-gold/10"
            style={{ top: `${s.y}%`, left: `${s.x}%` }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.4, 1.2, 0.4] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          >
            <Sparkles size={12} />
          </motion.div>
        ))}

        <motion.div
          className="absolute top-[40%] right-[8%] opacity-10 dark:opacity-[0.06]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="none" stroke="#C9933A" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="20" fill="none" stroke="#C9933A" strokeWidth="0.4" />
            <circle cx="30" cy="30" r="12" fill="none" stroke="#C9933A" strokeWidth="0.3" />
            <line x1="30" y1="2" x2="30" y2="58" stroke="#C9933A" strokeWidth="0.3" opacity="0.5" />
            <line x1="2" y1="30" x2="58" y2="30" stroke="#C9933A" strokeWidth="0.3" opacity="0.5" />
            <line x1="10" y1="10" x2="50" y2="50" stroke="#C9933A" strokeWidth="0.2" opacity="0.3" />
            <line x1="50" y1="10" x2="10" y2="50" stroke="#C9933A" strokeWidth="0.2" opacity="0.3" />
          </svg>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center py-8 md:py-12"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-4 inline-block"
          >
            <LotusFlower size={22} faded />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-[2.8rem] text-ivory dark:text-ivory leading-tight tracking-tight drop-shadow-sm">
            Daily Journal
          </h1>

          <p className="mt-2 text-sm md:text-base text-ivory/70 dark:text-ivory/70 font-light italic max-w-xl mx-auto leading-relaxed">
            A peaceful inner sanctuary for your thoughts to bloom.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-l from-gold/40 to-transparent" />
            <span className="text-gold/50 text-base">✦</span>
            <span className="h-px w-12 bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
        </motion.div>

        {/* Main Journal Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="journal-glass p-6 md:p-10 mb-10 relative overflow-hidden"
        >
          {/* Ambient glow behind card */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

          {/* Prompt Section */}
          <div className="relative mb-6 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-amber-50/60 to-gold-50/60 dark:from-amber-900/15 dark:to-gold-900/15 border border-gold/15 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl journal-shimmer pointer-events-none" />
            <p className="relative text-[9px] font-semibold text-gold dark:text-gold-lt tracking-[0.25em] uppercase mb-1.5">
              ✦ Today's Reflection
            </p>
            <div className="relative pl-4 border-l-2 border-gold/30">
              <p className="text-sm md:text-base text-ink/80 dark:text-ivory/80 font-display italic leading-relaxed">
                {prompt}
              </p>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="mb-6">
            <p className="text-[9px] text-ink/45 dark:text-ivory/45 tracking-[0.2em] uppercase mb-3">
              Your emotional aura
            </p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => {
                const Icon = m.moodIcon
                const selected = mood === m.label
                return (
                  <motion.button
                    key={m.label}
                    onClick={() => setMood(selected ? '' : m.label)}
                    whileTap={{ scale: 0.93 }}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      selected
                        ? `bg-gradient-to-br ${m.active} text-white shadow-lg ${m.shadow} scale-105 ring-2 ring-white/50 dark:ring-white/20`
                        : `bg-gradient-to-br ${m.pastel} text-ink/60 dark:text-ivory/70 hover:shadow-md hover:scale-[1.03] border border-white/40 dark:border-white/10`
                    }`}
                  >
                    <Icon size={13} className={selected ? 'text-white' : 'text-ink/45 dark:text-ivory/60'} />
                    <span>{m.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Writing Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => { setText(e.target.value); autoResize() }}
              placeholder="Let your thoughts flow gently onto these pages…"
              rows={4}
              className="w-full rounded-2xl md:rounded-3xl border border-gold/15 bg-white/10 dark:bg-white/[0.03] backdrop-blur-sm px-5 py-4 md:px-7 md:py-5 text-ink dark:text-ivory text-sm md:text-base font-body leading-relaxed placeholder:text-gold/40 placeholder:italic placeholder:font-display placeholder:tracking-wide resize-none transition-all duration-300 focus:outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/20 focus:bg-white/20 dark:focus:bg-white/[0.06] min-h-[100px]"
            />
            {text && (
              <button
                onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto' }}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/40 dark:bg-white/10 text-ink/40 dark:text-ivory/40 hover:text-ink hover:bg-white/70 dark:hover:bg-white/20 transition-all"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Word count + Save Button */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] text-ivory/45 dark:text-ivory/40 italic">
              {text.trim() ? `${wordCount} ${wordCount === 1 ? 'word' : 'words'}` : ''}
            </span>
            <motion.button
              onClick={addEntry}
              disabled={!text.trim()}
              whileHover={text.trim() ? { scale: 1.03, y: -2 } : {}}
              whileTap={text.trim() ? { scale: 0.97 } : {}}
              className="relative px-8 py-3 rounded-full bg-gradient-to-r from-saffron to-gold text-white font-semibold shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              <PenLine size={15} />
              Save Entry
            </motion.button>
          </div>
        </motion.div>

        {/* Past Entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Stats bar */}
          {hasEntries && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-5 mb-6 px-1"
            >
              <div className="flex items-center gap-2 text-ivory/60 dark:text-ivory/50">
                <BookOpen size={13} />
                <span className="text-[11px]">{totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}</span>
              </div>
              <div className="flex items-center gap-2 text-ivory/60 dark:text-ivory/50">
                <CalendarDays size={13} />
                <span className="text-[11px]">{uniqueDays} {uniqueDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
            </motion.div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-display text-lg md:text-xl text-ivory dark:text-ivory">Your entries</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
          </div>

          {Object.keys(grouped).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12"
            >
              <div className="text-3xl mb-4 opacity-30">
                <LotusFlower size={40} faded />
              </div>
              <p className="text-sm text-ivory/50 dark:text-ivory/50 font-light italic mb-1">
                No entries yet. Your first words await.
              </p>
              <p className="text-[11px] text-ivory/35 dark:text-ivory/30 font-light italic">
                The pen is waiting — pour your heart onto the page above.
              </p>
            </motion.div>
          ) : (
            Object.entries(grouped).map(([date, dayEntries]) => (
              <div key={date} className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-semibold text-gold dark:text-gold-lt tracking-[0.2em] uppercase">
                    {date === td ? 'Today' : fmtDate(date)}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/25 to-transparent" />
                </div>
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {dayEntries.map(e => {
                      const moodObj = MOODS.find(m => m.label === e.mood)
                      const isExpanded = expanded === e.id
                      const preview = e.text.length > 120 ? e.text.slice(0, 120) + '…' : e.text
                      const Icon = moodObj?.moodIcon

                      return (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          layout
                          className="group journal-glass-card p-4 md:p-5"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              {Icon && (
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${moodObj.pastel} flex items-center justify-center shrink-0`}>
                                  <Icon size={12} className="text-ink/50 dark:text-ivory/60" />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-ink/40 dark:text-ivory/40">{e.time || ''}</span>
                                {e.mood && (
                                  <span className="text-[8px] text-gold dark:text-gold-lt uppercase tracking-[0.15em] opacity-70">{e.mood}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setExpanded(isExpanded ? null : e.id)}
                                className="p-1.5 rounded-full hover:bg-white/30 dark:hover:bg-white/[0.06] text-ink/25 dark:text-ivory/25 hover:text-gold transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                              </button>
                              <button
                                onClick={() => deleteEntry(e.id)}
                                className="p-1.5 rounded-full hover:bg-white/30 dark:hover:bg-white/[0.06] text-ink/25 dark:text-ivory/25 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-ink/80 dark:text-ivory/80 font-light leading-relaxed whitespace-pre-wrap">
                            {isExpanded ? e.text : preview}
                          </p>
                          {e.text.length > 120 && (
                            <button
                              onClick={() => setExpanded(isExpanded ? null : e.id)}
                              className="text-[11px] text-gold dark:text-gold-lt mt-1.5 hover:underline opacity-60 hover:opacity-100 transition-opacity"
                            >
                              {isExpanded ? 'Show less' : 'Continue reading'}
                            </button>
                          )}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
