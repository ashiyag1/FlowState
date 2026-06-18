import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, ChevronDown, ChevronUp, Edit3, Check, X as XIcon, ArrowLeft,
  Heart, Waves, Sun, Moon, Flower2, Cloud, BookOpen, Search
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWellness } from '../context/WellnessContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotif } from '../components/system/NotificationPopup'
import { today, fmtDate } from '../utils'
import PageLayout from '../components/ui/PageLayout'
import LotusFlower from '../icons/LotusFlower'

// Import changing background carousel images
import imageChai from '../assets/wiscarousel/chai.webp'
import imageJasmine from '../assets/wiscarousel/Disney Princess Aesthetic _ Jasmine.webp'
import imageHome from '../assets/wiscarousel/home_bg.webp'
import imageJaipur from '../assets/wiscarousel/jaipur1.webp'
import imageSitar from '../assets/wiscarousel/sitar.webp'
import imageSukoon from '../assets/wiscarousel/sukoon.webp'

const MOODS = [
  { label: 'Grateful',   moodIcon: Heart,   tint: '#f472b6', bg: 'bg-rose-100/70 dark:bg-rose-950/20',   text: 'text-rose-700 dark:text-rose-300' },
  { label: 'Calm',       moodIcon: Waves,   tint: '#60a5fa', bg: 'bg-sky-100/70 dark:bg-sky-950/20',     text: 'text-sky-700 dark:text-sky-300' },
  { label: 'Energized',  moodIcon: Sun,     tint: '#fbbf24', bg: 'bg-amber-100/70 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-300' },
  { label: 'Reflective', moodIcon: Moon,    tint: '#a78bfa', bg: 'bg-purple-100/70 dark:bg-purple-950/20', text: 'text-purple-700 dark:text-purple-300' },
  { label: 'Happy',      moodIcon: Flower2, tint: '#34d399', bg: 'bg-emerald-100/70 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-300' },
  { label: 'Tired',      moodIcon: Cloud,   tint: '#9ca3af', bg: 'bg-slate-100/70 dark:bg-slate-950/20',  text: 'text-slate-700 dark:text-slate-300' },
]

export default function PastPages() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const notif = useNotif()
  const { isAuthenticated } = useAuth()
  const { journal: entries, deleteEntry: deleteWellnessEntry, updateEntry } = useWellness()
  const td = today()

  const [expanded, setExpanded]   = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText]   = useState('')
  const [search, setSearch]       = useState('')
  const [moodFilter, setMoodFilter] = useState('')
  const BG_IMAGES = useMemo(() => [
    imageChai,
    imageJasmine,
    imageHome,
    imageJaipur,
    imageSitar,
    imageSukoon
  ], [])

  const bgIndex = useMemo(() => {
    const d = new Date()
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
    return seed % BG_IMAGES.length
  }, [BG_IMAGES.length])

  // Filter entries
  const filtered = useMemo(() => {
    let list = [...entries].sort((a, b) => {
      const da = `${a.date} ${a.time || '00:00'}`
      const db = `${b.date} ${b.time || '00:00'}`
      return db.localeCompare(da)
    })
    if (moodFilter) list = list.filter(e => e.mood === moodFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(e => e.text?.toLowerCase().includes(q) || e.date?.includes(q))
    }
    return list
  }, [entries, moodFilter, search])

  // Group by date
  const grouped = useMemo(() => {
    const acc = {}
    for (const e of filtered) {
      const k = e.date || td
      if (!acc[k]) acc[k] = []
      acc[k].push(e)
    }
    return acc
  }, [filtered, td])

  const startEdit = (e) => {
    setEditingId(e.id)
    setEditText(e.text)
    setExpanded(e.id)
  }

  const saveEdit = async (id) => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!editText.trim()) return
    await updateEntry(id, { text: editText.trim() })
    setEditingId(null)
    setEditText('')
    notif('Entry updated ✦', 'success')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleDelete = (id) => {
    if (!isAuthenticated) { navigate('/login'); return }
    deleteWellnessEntry(id)
    if (editingId === id) setEditingId(null)
    notif('Entry removed', 'default')
  }

  return (
    <PageLayout>
      {/* Dynamic background image carousel */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-ivory dark:bg-[#120904]">
        {/* Changing Background Image Carousel with Cross-Fade */}
        <AnimatePresence mode="sync">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${BG_IMAGES[bgIndex]})`,
              filter: dark ? 'brightness(0.85) contrast(1.05)' : 'none',
            }}
          />
        </AnimatePresence>

        {/* Soft vignette overlay (a bit of brown overlay) */}
        <div className="absolute inset-0 bg-[#3d2e1a]/30 dark:bg-[#2d1e0f]/55 pointer-events-none" />
      </div>

      <div
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: '860px', width: '96%', margin: '0 auto',
          padding: 'clamp(4.5rem, 8vw, 5rem) 1rem 4rem',
        }}
      >
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/journal')}
            className="p-2 rounded-full border border-gold/20 hover:border-gold/50 text-gold/60 hover:text-gold transition-all"
            style={{ background: dark ? 'rgba(201,147,58,0.08)' : 'rgba(201,147,58,0.06)' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.28em', color: '#E8622A', textTransform: 'uppercase', marginBottom: '3px', textShadow: '0 2px 8px rgba(255,255,255,0.4)' }}>
              ✦ CHINTAN · DIARY ✦
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 400, color: dark ? '#f0e6d0' : '#2D1F0E', margin: 0, textShadow: dark ? '0 2px 12px rgba(0,0,0,0.8)' : '0 2px 12px rgba(255,255,255,0.8)' }}>
              Your Diary Archives
            </h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={14} style={{ color: '#c8a96e', opacity: 0.7 }} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.65rem', color: '#c8a96e', opacity: 0.7 }}>
              {entries.length} {entries.length === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </motion.div>

        {/* ── FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c3b17]/60 dark:text-gold/60" />
            <input
              type="text"
              placeholder="Search your reflections…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl text-xs border bg-white/60 dark:bg-black/40 backdrop-blur-md text-[#2d1f0e] dark:text-white placeholder:text-[#5c3b17]/60 dark:placeholder:text-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all font-medium"
              style={{
                borderColor: dark ? 'rgba(212,168,42,0.3)' : 'rgba(212,168,42,0.4)',
                fontFamily: "'Lora', serif",
              }}
            />
          </div>

          {/* Mood filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setMoodFilter('')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all backdrop-blur-md shadow-sm ${
                !moodFilter
                  ? 'bg-gold/30 border-gold text-[#3d2e1a] dark:text-gold-lt'
                  : 'bg-white/40 dark:bg-black/40 border-gold/40 text-[#5c3b17] dark:text-gold hover:bg-white/60 dark:hover:bg-black/60 hover:border-gold/60'
              }`}
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.04em' }}
            >
              All
            </button>
            {MOODS.map(m => {
              const Icon = m.moodIcon
              return (
                <button
                  key={m.label}
                  onClick={() => setMoodFilter(moodFilter === m.label ? '' : m.label)}
                  className={`px-2.5 py-1.5 rounded-full text-[10px] border transition-all flex items-center gap-1 backdrop-blur-md shadow-sm font-bold ${
                    moodFilter === m.label
                      ? 'border-opacity-100'
                      : 'bg-white/40 dark:bg-black/40 border-gold/40 text-[#5c3b17] dark:text-gold hover:bg-white/60 dark:hover:bg-black/60 hover:border-gold/60'
                  }`}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor: moodFilter === m.label ? m.tint : undefined,
                    color: moodFilter === m.label ? (dark ? m.tint : '#3d2e1a') : undefined,
                    background: moodFilter === m.label ? `${m.tint}40` : undefined,
                  }}
                  title={m.label}
                >
                  <Icon size={10} strokeWidth={moodFilter === m.label ? 3 : 2} />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ── ENTRIES ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <LotusFlower size={40} className="text-gold/20 mx-auto mb-3" />
            <p className="text-sm text-ivory/50 italic" style={{ fontFamily: "'Lora', serif" }}>
              {search || moodFilter ? 'No entries match your filter.' : 'Your sacred journal is waiting for its first page.'}
            </p>
            {!search && !moodFilter && (
              <button
                onClick={() => navigate('/journal')}
                className="mt-4 text-xs text-gold/60 hover:text-gold underline underline-offset-2 transition-colors"
              >
                Write your first entry →
              </button>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            <AnimatePresence>
              {Object.entries(grouped)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, dayEntries]) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    layout
                  >
                    {/* Day label */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ fontFamily: "'Cinzel', serif", color: '#c8a96e' }}
                      >
                        {date === td ? '✦ Today' : fmtDate(date)}
                      </span>
                      <div className="flex-1 h-px" style={{ background: 'rgba(200,169,110,0.18)' }} />
                      <span className="text-[9px] text-gold/35" style={{ fontFamily: "'Cinzel', serif" }}>
                        {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>

                    {/* Entry cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AnimatePresence>
                        {dayEntries.map(e => {
                          const moodObj = MOODS.find(m => m.label === e.mood)
                          const Icon    = moodObj?.moodIcon
                          const isExpanded = expanded === e.id
                          const isEditing  = editingId === e.id
                          const preview    = e.text.length > 150 ? e.text.slice(0, 150) + '…' : e.text

                          return (
                            <motion.div
                              key={e.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              layout
                              className="group relative rounded-2xl border-l-[3px] overflow-hidden"
                              style={{
                                borderLeftColor: moodObj ? moodObj.tint : 'rgba(201,168,76,0.35)',
                                background: dark
                                  ? 'rgba(22,22,25,0.7)'
                                  : 'rgba(253,246,234,0.9)',
                                border: dark
                                  ? '1px solid rgba(201,168,76,0.12)'
                                  : '1px solid rgba(201,168,76,0.22)',
                                borderLeftWidth: '3px',
                                borderLeftColor: moodObj ? moodObj.tint : 'rgba(201,168,76,0.35)',
                                backdropFilter: 'blur(12px)',
                                padding: '14px 16px',
                              }}
                            >
                              {/* Card header */}
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {Icon && moodObj && (
                                    <span className={`w-5 h-5 rounded-full ${moodObj.bg} ${moodObj.text} flex items-center justify-center text-[9px] shrink-0`}>
                                      <Icon size={10} />
                                    </span>
                                  )}
                                  <div>
                                    <span className="text-[10px] font-semibold tracking-wide uppercase"
                                      style={{ color: '#c8a96e', fontFamily: "'Cinzel', serif" }}>
                                      {date === td ? 'Today' : fmtDate(date)}
                                    </span>
                                    {e.time && (
                                      <span className="text-[9px] ml-2 font-mono"
                                        style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                                        {e.time}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                                  {isEditing ? (
                                    <>
                                      <button
                                        onClick={() => saveEdit(e.id)}
                                        title="Save changes"
                                        className="p-1.5 rounded-full hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 transition-all"
                                      >
                                        <Check size={12} />
                                      </button>
                                      <button
                                        onClick={cancelEdit}
                                        title="Discard changes"
                                        className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400/70 hover:text-rose-400 transition-all"
                                      >
                                        <XIcon size={12} />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => startEdit(e)}
                                        title="Edit entry"
                                        className="p-1.5 rounded-full hover:bg-white/10 transition-all"
                                        style={{ color: dark ? 'rgba(200,169,110,0.5)' : 'rgba(100,80,30,0.5)' }}
                                      >
                                        <Edit3 size={12} />
                                      </button>
                                      <button
                                        onClick={() => setExpanded(isExpanded ? null : e.id)}
                                        title={isExpanded ? 'Collapse' : 'Expand'}
                                        className="p-1.5 rounded-full hover:bg-white/10 transition-all"
                                        style={{ color: dark ? 'rgba(200,169,110,0.5)' : 'rgba(100,80,30,0.5)' }}
                                      >
                                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                      </button>
                                      <button
                                        onClick={() => handleDelete(e.id)}
                                        title="Delete entry"
                                        className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400/40 hover:text-rose-400 transition-all"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Entry body — edit or read */}
                              {isEditing ? (
                                <textarea
                                  value={editText}
                                  onChange={ev => setEditText(ev.target.value)}
                                  rows={6}
                                  autoFocus
                                  className="w-full rounded-xl p-3 text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-mono"
                                  style={{
                                    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
                                    border: '1px solid rgba(212,168,42,0.25)',
                                    color: dark ? 'rgba(255,255,255,0.88)' : '#1a0f00',
                                    lineHeight: 1.75,
                                  }}
                                />
                              ) : (
                                <>
                                  <p
                                    className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
                                    style={{ color: dark ? 'rgba(255,255,255,0.78)' : '#2a1a06', lineHeight: 1.75 }}
                                  >
                                    {isExpanded ? e.text : preview}
                                  </p>
                                  {e.text.length > 150 && (
                                    <button
                                      onClick={() => setExpanded(isExpanded ? null : e.id)}
                                      className="mt-1.5 text-[9px] font-semibold hover:underline transition-colors"
                                      style={{ color: '#c8a96e', opacity: 0.7 }}
                                    >
                                      {isExpanded ? 'Show less' : 'Read full entry'}
                                    </button>
                                  )}
                                </>
                              )}
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
