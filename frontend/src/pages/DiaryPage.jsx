import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Trash2, Edit3, Check, X as XIcon, Heart, Waves, Sun, Moon, Flower2, Cloud, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { useNotif } from '../components/system/NotificationPopup'
import PageLayout from '../components/ui/PageLayout'
import LotusFlower from '../icons/LotusFlower'
import { fmtDate } from '../utils'
import journalBg from '../assets/pages/journal_bg.webp'

const MOODS = [
  { label: 'Grateful',  moodIcon: Heart,   bg: 'bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/20 dark:hover:bg-rose-900/30',   text: 'text-rose-700 dark:text-rose-300',   glow: 'rgba(244,114,182,0.12)',  tint: '#f472b6' },
  { label: 'Calm',      moodIcon: Waves,   bg: 'bg-sky-100/70 hover:bg-sky-200/80 dark:bg-sky-950/20 dark:hover:bg-sky-900/30',    text: 'text-sky-700 dark:text-sky-300',    glow: 'rgba(96,165,250,0.10)',  tint: '#60a5fa' },
  { label: 'Energized', moodIcon: Sun,     bg: 'bg-amber-100/70 hover:bg-amber-200/80 dark:bg-amber-950/20 dark:hover:bg-amber-900/30', bgActive: 'from-amber-300 to-yellow-400', text: 'text-amber-700 dark:text-amber-300', glow: 'rgba(251,191,36,0.12)',  tint: '#fbbf24' },
  { label: 'Reflective',moodIcon: Moon,    bg: 'bg-purple-100/70 hover:bg-purple-200/80 dark:bg-purple-950/20 dark:hover:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', glow: 'rgba(167,139,250,0.10)', tint: '#a78bfa' },
  { label: 'Happy',     moodIcon: Flower2, bg: 'bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', glow: 'rgba(52,211,153,0.10)', tint: '#34d399' },
  { label: 'Tired',     moodIcon: Cloud,   bg: 'bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-950/20 dark:hover:bg-slate-900/30',  text: 'text-slate-700 dark:text-slate-300',  glow: 'rgba(156,163,175,0.08)', tint: '#9ca3af' },
]

export default function DiaryPage() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const notif = useNotif()
  const { journal: entries, deleteEntry: deleteWellnessEntry, updateEntry } = useWellness()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [xpToast, setXpToast] = useState(null)

  const filteredEntries = useMemo(() => {
    const list = [...entries].reverse() // Newest first
    if (!searchQuery.trim()) return list
    return list.filter(e => 
      e.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (e.mood && e.mood.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [entries, searchQuery])

  const deleteEntry = (id) => {
    deleteWellnessEntry(id)
    notif('Page torn from journal ✦', 'success')
  }

  const startEdit = (e) => {
    setEditingId(e.id)
    setEditText(e.text)
  }

  const saveEdit = (id) => {
    if (!editText.trim()) return
    updateEntry(id, editText)
    setEditingId(null)
    notif('Entry updated ✦', 'success')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <PageLayout className="relative">
      {/* Background with dark overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${journalBg})` }}
        />
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>

      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-saffron/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 md:pt-20 pb-36 md:pb-32">
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

        {/* Page Titles & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-saffron flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-8 h-px bg-saffron/50" />
              Chintan archives
              <span className="w-8 h-px bg-saffron/50 md:hidden" />
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ivory leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              My Diary Pages
            </h1>
            <p className="text-[11px] md:text-xs text-ivory/50 mt-2 font-light">
              Reflections of your journey, written day by day.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative flex items-center bg-white/5 dark:bg-white/[0.02] border border-gold/20 focus-within:border-gold/40 rounded-full px-4 py-2 w-full md:w-72 transition-all shadow-md">
            <Search size={14} className="text-gold/60 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-ivory placeholder:text-ivory/30 w-full font-serif"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-ivory/40 hover:text-rose-400 border-none bg-transparent cursor-pointer ml-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Entries List */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 journal-glass border border-gold/15"
              >
                <LotusFlower size={42} className="text-gold/25 mx-auto mb-3" />
                <p className="text-sm text-ivory/60 italic font-serif">
                  {searchQuery ? 'No pages match your search.' : 'Your diary has no pages written yet.'}
                </p>
              </motion.div>
            ) : (
              filteredEntries.map((e) => {
                const moodObj = MOODS.find(m => m.label === e.mood)
                const Icon = moodObj?.moodIcon
                
                return (
                  <motion.div
                    key={e.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-[#fbf6ee] dark:bg-[#1e1711] border border-gold/15 shadow-xl rounded-2xl p-5 pl-12 sm:pl-16 md:pl-20 parchment-lines overflow-hidden group"
                  >
                    {/* Vertical Red Margin Line */}
                    <div className="absolute top-0 bottom-0 left-9 sm:left-12 md:left-14 w-[1px] bg-red-200/40 dark:bg-red-900/30 pointer-events-none" />

                    {/* Mood Icon placed to the left of the margin line */}
                    <div className="absolute left-2 sm:left-3 md:left-4 top-6 flex flex-col items-center">
                      {Icon ? (
                        <span className={`w-7 h-7 rounded-full ${moodObj.bg} ${moodObj.text} flex items-center justify-center text-xs shadow-inner`} title={e.mood}>
                          <Icon size={12} />
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-gold/10 text-gold/40 flex items-center justify-center text-xs border border-gold/10">
                          🧘
                        </span>
                      )}
                    </div>

                    {/* Content on the right of the margin line */}
                    <div className="relative z-10">
                      {/* Entry Header */}
                      <div className="flex items-start justify-between gap-4 mb-2 pb-1 border-b border-[#c9a87c]/10">
                        <div>
                          <span className="font-display text-sm font-semibold text-[#3d2e1a] dark:text-gold-lt tracking-wide">
                            {fmtDate(e.date)}
                          </span>
                          <span className="text-[9px] text-[#5c3d17]/40 dark:text-ivory/40 ml-2 font-mono">
                            {e.time || ''}
                          </span>
                        </div>

                        {/* Controls (Edit / Delete) */}
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {editingId === e.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(e.id)}
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-emerald-600 dark:text-emerald-400 transition-all border-none bg-transparent cursor-pointer"
                                title="Save edit"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-rose-600 dark:text-rose-400 transition-all border-none bg-transparent cursor-pointer"
                                title="Cancel edit"
                              >
                                <XIcon size={12} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(e)}
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#5c3b17]/60 dark:text-ivory/50 hover:text-gold dark:hover:text-gold transition-all border-none bg-transparent cursor-pointer"
                                title="Edit page"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => deleteEntry(e.id)}
                                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#5c3b17]/60 dark:text-ivory/50 hover:text-rose-600 dark:hover:text-rose-400 transition-all border-none bg-transparent cursor-pointer"
                                title="Tear page"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Entry Body Text */}
                      {editingId === e.id ? (
                        <textarea
                          value={editText}
                          onChange={ev => setEditText(ev.target.value)}
                          rows={6}
                          className="w-full bg-[#fbf6ee] dark:bg-[#1e1711] border border-gold/20 rounded-xl p-3 text-xs text-[#2c1a00] dark:text-ivory focus:outline-none focus:border-gold/50 font-serif leading-relaxed resize-none"
                          style={{ lineHeight: '32px', minHeight: '192px' }}
                          autoFocus
                        />
                      ) : (
                        <p 
                          className="text-xs md:text-sm text-[#2d1f0e] dark:text-ivory/90 leading-relaxed font-serif italic"
                          style={{ 
                            lineHeight: '32px', 
                            wordBreak: 'break-word',
                            textShadow: '0 0 1px rgba(201,168,76,0.05)'
                          }}
                        >
                          {e.text}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  )
}
