import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, Sparkles, Flame, Check, X, BookOpen, Info, Award } from 'lucide-react'
import { useWellness } from '../context/WellnessContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import HabitCheckbox from '../components/HabitCheckbox'
import StreakFlame from '../components/StreakFlame'
import ShimmerBar from '../components/ShimmerBar'
import habitsBg from '../assets/pages/habits_bg.webp'
import { getHinduDetails, getScientificInsights } from '../utils/hinduCalendar'
import { fmtDate } from '../utils'

const ICONS = ['🏃','🧘','💧','📖','🌿','🍎','🏋️','✍️','🎨','🎵','🌅','🚴','🧠','💊','🥗','🛌','🧹','🌸','☀️','🦋','🎯','🏊','🍵','🛁','🌙','💪','📝','🌱','🦷','🕉️','🙏','🪷','🔥','⭐','📚','🎧']
const HABIT_COLORS = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE','#1A8A7A','#E86060']

function fadeUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
  }
}

export default function Habits() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { habits, addHabit, deleteHabit, habitDone, toggleHabit, getStreak } = useWellness()
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()

  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [selColor, setSelColor] = useState(HABIT_COLORS[0])
  const [calDate, setCalDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Selected Day on monthly calendar (defaults to today's date)
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())

  const todayStr = new Date().toISOString().slice(0, 10)
  const td = todayStr
  const todayDone = habitDone[td] || {}
  const doneCount = habits.filter(h => todayDone[h.id]).length

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!name.trim()) return
    addHabit({ name: name.trim(), icon, color: selColor })
    setName('')
    setIcon(ICONS[0])
    setSelColor(HABIT_COLORS[0])
    setShowAddForm(false)
  }

  const handleToggleHabit = (id, dateKey = td) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const alreadyDone = !!(habitDone[dateKey] || {})[id]
    toggleHabit(id, dateKey)
    if (!alreadyDone) playHabitSound()
  }

  const handleDeleteHabit = (e, id) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    deleteHabit(id)
  }

  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const isoForDay = (d) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const weekday = (d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(isoForDay(d)).getDay()]

  const bestStreak = Math.max(0, ...habits.map(h => getStreak(h.id)))
  const allDoneToday = habits.length > 0 && doneCount === habits.length
  const pctToday = habits.length ? Math.round(doneCount / habits.length * 100) : 0
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()

  // Selected Day Calculations
  const selectedIso = isoForDay(selectedDay)
  const selectedHindu = getHinduDetails(selectedIso)
  const scientificInsights = getScientificInsights()
  const selectedDayDone = habitDone[selectedIso] || {}

  return (
    <PageLayout>
      {/* Background Cover */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${habitsBg}) center/cover no-repeat fixed`,
        filter: dark ? 'brightness(0.38) saturate(1.0)' : 'brightness(0.85) saturate(1.1)',
        opacity: dark ? 0.9 : 0.7,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '4.5rem 1.2rem 4rem'
      }}>
        
        {/* HERO TITLE */}
        <motion.div initial="hidden" animate="show" variants={fadeUp(0)} className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1 inline-block text-gold text-lg"
          >
            🪷
          </motion.div>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.58rem', letterSpacing: '0.3em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.2rem'
          }}>
            ✦ Sadhana Tracker ✦
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2.5rem',
            fontWeight: 400, color: dark ? '#f0e6d0' : '#2D1F0E', lineHeight: 1.1, margin: '0'
          }}>
            Daily Rituals
          </h1>
        </motion.div>

        {/* MAIN DASHBOARD CONTAINER: Fits on one screen side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL (7 Columns): Add Ritual above Monthly Calendar */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* COLLAPSIBLE ADD NEW RITUAL CARD — placed above calendar */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.05)} className="journal-glass p-4 border border-gold/20">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs text-gold flex items-center gap-1.5 uppercase font-bold tracking-wide">
                  ✨ Sacred Sadhana Builder
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-[10px] text-gold-lt border border-gold/30 hover:bg-gold/15 py-1 px-3 rounded-full transition-all font-semibold"
                >
                  {showAddForm ? 'Cancel' : '+ New Ritual'}
                </button>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-gold/10 flex flex-col gap-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Name</label>
                        <input
                          type="text"
                          value={name}
                          placeholder="e.g. Surya Namaskar"
                          maxLength={35}
                          onChange={e => setName(e.target.value)}
                          className="w-full rounded-xl border border-gold/20 bg-white/5 px-3 py-2 text-xs text-ivory outline-none focus:border-gold"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Color Accent</label>
                        <div className="flex gap-1.5 flex-wrap py-1">
                          {HABIT_COLORS.map(c => (
                            <button
                              key={c}
                              onClick={() => setSelColor(c)}
                              className="w-5 h-5 rounded-md border transition-all"
                              style={{
                                backgroundColor: c,
                                borderColor: selColor === c ? 'white' : 'transparent',
                                transform: selColor === c ? 'scale(1.1)' : 'none'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Choose Icon</label>
                      <div className="flex flex-wrap gap-1 bg-black/20 p-2 rounded-xl max-h-[50px] overflow-y-auto">
                        {ICONS.map(ic => (
                          <button
                            key={ic}
                            onClick={() => setIcon(ic)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-all ${
                              ic === icon ? 'bg-gold/20' : 'bg-transparent hover:bg-white/5'
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={!name.trim()}
                      className="w-full py-2 bg-gradient-to-r from-saffron to-gold text-white font-semibold text-xs tracking-wider rounded-xl disabled:opacity-30 transition-all hover:shadow-lg active:scale-98"
                    >
                      + Add New Sadhana
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* MONTHLY CALENDAR GRID CARD */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.1)} className="journal-glass p-5 border border-gold/25 flex-1 flex flex-col">
              
              {/* Calendar Header with Navigators */}
              <div className="flex items-center justify-between mb-4 border-b border-gold/15 pb-3">
                <div>
                  <h2 className="font-display text-lg text-ivory flex items-center gap-2">
                    {calDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h2>
                  <p className="text-[10px] text-ivory/50 font-light mt-0.5">
                    Integrated Gregorian & Hindu Lunar Dates
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1.5 rounded-lg border border-gold/20 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setCalDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n })
                      setSelectedDay(1)
                    }}
                    className="p-1.5 rounded-lg border border-gold/20 hover:bg-gold/10 text-gold-lt transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* 7-Column Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 flex-1">
                {/* Weekday labels */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-display text-[10px] font-bold text-gold uppercase tracking-wider py-1 border-b border-gold/10">
                    {day}
                  </div>
                ))}

                {/* Pre-offset blank days */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-black/5 dark:bg-black/20 rounded-xl aspect-[1.1] border border-dashed border-white/[0.02]" />
                ))}

                {/* Days of the month */}
                {dayNums.map(d => {
                  const iso = isoForDay(d)
                  const isToday = iso === todayStr
                  const isSelected = selectedDay === d
                  const hindu = getHinduDetails(iso)
                  
                  const dayDone = habitDone[iso] || {}

                  return (
                    <motion.div
                      key={d}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedDay(d)}
                      className={`rounded-xl p-2 cursor-pointer transition-all border flex flex-col justify-between aspect-[1.1] ${
                        isSelected
                          ? 'bg-gold/15 border-gold shadow-md shadow-gold/5'
                          : isToday
                            ? 'bg-saffron/10 border-saffron/30 hover:bg-saffron/15'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-gold/20'
                      }`}
                    >
                      {/* Cell Header: Gregorian Day & Tithi abbreviation */}
                      <div className="flex justify-between items-start">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isToday ? 'bg-saffron text-white' : isSelected ? 'bg-gold text-ink' : 'text-ivory'
                        }`}>
                          {d}
                        </span>
                        
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-gold block leading-none" title={hindu.tithiFull}>
                            {hindu.moonSymbol}{hindu.tithiNum}
                          </span>
                        </div>
                      </div>

                      {/* Cell Habits: checkable tiny icons */}
                      <div className="flex flex-wrap gap-[3px] my-1">
                        {habits.map(h => {
                          const done = !!dayDone[h.id]
                          const isPastOrToday = iso <= todayStr
                          return (
                            <span
                              key={h.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isPastOrToday) handleToggleHabit(h.id, iso)
                              }}
                              title={`${h.name}: ${done ? 'Done' : 'Click to toggle'}`}
                              className={`w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] transition-all border ${
                                done
                                  ? 'border-white text-white'
                                  : 'border-gold/10 text-white/20'
                              }`}
                              style={{
                                backgroundColor: done ? h.color : 'rgba(255,255,255,0.03)',
                                cursor: isPastOrToday ? 'pointer' : 'not-allowed',
                                opacity: isPastOrToday ? 1 : 0.15,
                              }}
                            >
                              {done ? '✓' : h.icon}
                            </span>
                          )
                        })}
                      </div>

                      {/* Cell Footer: Small Nakshatra */}
                      <div className="text-[7px] text-ivory/40 truncate leading-none text-right">
                        {hindu.nakshatra}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Dynamic Progress indicator */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-ivory/50">
                <span>Active Rituals: {habits.length}</span>
                <span className="font-mono">{calDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT PANEL (5 Columns): Selected Day Panchang & Scientific Explanations */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* SELECTED DAY PANCHANG & CHECKLIST CARD */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.08)} className="journal-glass p-5 border border-gold/25">
              <span className="text-[9px] tracking-widest text-saffron uppercase font-bold">
                Daily Astral Alignment
              </span>
              <h3 className="font-display text-lg text-ivory font-semibold mt-0.5 pb-2 border-b border-gold/15">
                {new Date(selectedIso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>

              {/* Tithi, Paksha, Nakshatra details */}
              <div className="grid grid-cols-2 gap-3 my-3 bg-black/10 p-3 rounded-2xl border border-white/5 text-[11px] text-ivory/80">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gold block">Lunar Tithi</span>
                  <strong className="text-ivory mt-0.5 block">{selectedHindu.tithiEmoji} {selectedHindu.tithiName}</strong>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gold block">Fortnight (Paksha)</span>
                  <strong className="text-ivory mt-0.5 block">{selectedHindu.paksha}</strong>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gold block">Constellation (Nakshatra)</span>
                  <strong className="text-ivory mt-0.5 block">✨ {selectedHindu.nakshatra}</strong>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-gold block">Moon Phase</span>
                  <strong className="text-ivory mt-0.5 block">{selectedHindu.moonSymbol} {selectedHindu.phasePercent}% Illum.</strong>
                </div>
              </div>

              {/* Daily Checklist for the Selected Date */}
              <div className="mt-4">
                <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-2">
                  Check-in Rituals ({selectedDayDone ? Object.keys(selectedDayDone).filter(k => selectedDayDone[k]).length : 0}/{habits.length})
                </span>
                
                {habits.length === 0 ? (
                  <p className="text-xs text-ivory/50 italic text-center py-4">No rituals added yet.</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {habits.map((h) => {
                      const done = !!selectedDayDone[h.id]
                      const streak = getStreak(h.id)
                      const isPastOrToday = selectedIso <= todayStr

                      return (
                        <div
                          key={h.id}
                          onClick={() => { if (isPastOrToday) handleToggleHabit(h.id, selectedIso) }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                            done
                              ? 'bg-gold/10 border-gold/30 text-ivory'
                              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                          }`}
                          style={{ opacity: isPastOrToday ? 1 : 0.4 }}
                        >
                          <HabitCheckbox done={done} color={h.color} />
                          <span className="text-sm shrink-0">{h.icon}</span>
                          <span className="flex-1 truncate font-display font-medium text-ivory/90">{h.name}</span>
                          <StreakFlame streak={streak} />
                          <button
                            onClick={(e) => handleDeleteHabit(e, h.id)}
                            className="p-1 rounded-md text-ivory/20 hover:text-rose-400 hover:bg-white/5 shrink-0"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* INTEGRATED SCIENTIFIC FACTS DRAWER (FIT IN ONE SCREEN) */}
            <motion.div initial="hidden" animate="show" variants={fadeUp(0.12)} className="journal-glass p-5 border border-gold/25 flex-1 flex flex-col overflow-hidden max-h-[380px]">
              <h3 className="font-display text-sm text-ivory flex items-center gap-1.5 border-b border-gold/10 pb-2 mb-3 shrink-0">
                <BookOpen size={13} className="text-gold" /> Astronomical Panchang Science
              </h3>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1">
                {scientificInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/10 border border-white/5 flex flex-col gap-1"
                  >
                    <h5 className="text-[11px] font-bold text-ivory flex items-center gap-1.5">
                      <span>{insight.icon}</span> {insight.title}
                    </h5>
                    <p className="text-[10px] text-ivory/60 leading-relaxed font-light font-mono">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </PageLayout>
  )
}
