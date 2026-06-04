import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import lotusImg from '../../../assets/dashboard/lotus.png'

const ICONS = ['🏃','🧘','💧','📖','🌿','🍎','🏋️','✍️','🎨','🎵','🌅','🚴','🧠','💊','🥗','🛌','🧹','🌸','☀️','🦋','🎯','🏊','🍵','🛁','🌙','💪','📝','🌱','🦷','🕉️','🙏','🪷','🔥','⭐','📚','🎧']
const HABIT_COLORS = ['#E8622A','#C9933A','#D4607A','#1A7A4E','#1B4FA8','#7B68AE','#1A8A7A','#E86060']

const RITUAL_IDEAS = [
  { category: '🧘 Popular Rituals', items: [
    { name: 'Surya Namaskar', icon: '🧘' },
    { name: 'Meditation', icon: '🌿' },
    { name: 'Studies / Focus', icon: '📚' },
    { name: 'Hydration', icon: '💧' },
    { name: 'Journaling', icon: '✍️' },
    { name: 'Reading', icon: '📖' },
  ]}
]

export function ActiveSadhanasCard({
  dark,
  habits,
  selectedIso,
  selectedDayDone,
  allDoneToday,
  todayStr,
  onToggleHabit,
  onDeleteHabit,
  onAddHabit,
  getStreak,
  bestStreak
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [selColor, setSelColor] = useState(HABIT_COLORS[0])
  const [cycleLength, setCycleLength] = useState(7)
  const [relaxDay, setRelaxDay] = useState('Sunday')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return
    onAddHabit({
      name: name.trim(),
      icon,
      color: selColor,
      cycleLength,
      relaxDay,
      streakFreezes: 3
    })
    setName('')
    setIcon(ICONS[0])
    setSelColor(HABIT_COLORS[0])
    setCycleLength(7)
    setRelaxDay('Sunday')
    setShowAddForm(false)
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 } }
      }}
      style={{
        background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
        border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
        borderRadius: '24px',
        padding: '1.25rem',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <div className="flex items-center justify-between mb-3 border-b border-gold/10 pb-2">
        <span
          className="font-display text-xs flex items-center gap-1.5 uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border"
          style={{
            color: dark ? '#ff9e7a' : '#E8622A',
            backgroundColor: dark ? 'rgba(232, 98, 42, 0.15)' : 'rgba(232, 98, 42, 0.1)',
            borderColor: dark ? 'rgba(232, 98, 42, 0.3)' : 'rgba(232, 98, 42, 0.25)',
          }}
        >
          🕯️ My Active Sadhanas
        </span>
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="text-[10px] text-gold border border-gold/30 hover:bg-gold/15 py-1 px-3 rounded-full transition-all font-semibold"
          style={{ color: dark ? '#ffeab8' : '#8B6914', borderColor: dark ? 'rgba(201,168,76,0.3)' : 'rgba(139,105,20,0.3)' }}
        >
          Add ritual
        </button>
      </div>

      <p className="text-[10.5px] italic mt-0 mb-3 opacity-80 leading-relaxed font-sans" style={{ color: dark ? '#ffb394' : '#C44E1C' }}>
        Tapas (discipline) is a warm, steady fire. Just take one small step today.
      </p>

      {/* Today's Streak Mini-Bar */}
      <div
        className="flex items-center justify-between gap-4 px-3 py-2 rounded-xl mb-3"
        style={{
          background: dark ? 'rgba(201, 168, 76, 0.03)' : 'rgba(200, 169, 110, 0.03)',
          border: dark ? '1px solid rgba(201, 168, 76, 0.08)' : '1px solid #e8d5b0',
        }}
      >
        <div className="flex items-center gap-2">
          <motion.img
            src={lotusImg}
            alt="Streak Lotus"
            initial={{ scale: 0.2, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{
              type: 'spring',
              stiffness: 160,
              damping: 10
            }}
            style={{
              width: '28px',
              height: '28px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(232, 98, 42, 0.15))'
            }}
          />
          <span className="font-display text-2xl font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>{bestStreak}</span>
          <span className="text-[9px] uppercase tracking-wider text-ink-soft/60 dark:text-ivory/60 leading-none">day streak</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 justify-end">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[3px] w-4 rounded-full"
                style={{
                  backgroundColor: idx < (bestStreak % 8 || (bestStreak > 0 ? 7 : 0))
                    ? '#C9933A'
                    : (dark ? 'rgba(255,255,255,0.08)' : '#e8d5b0')
                }}
              />
            ))}
          </div>
          <span className="text-[9px] text-ink-soft/40 dark:text-ivory/40 italic whitespace-nowrap hidden sm:inline">
            Every streak starts somewhere
          </span>
        </div>
      </div>

      {/* DAILY QUEST CHEST ANIMATION */}
      <AnimatePresence>
        {allDoneToday && selectedIso === todayStr && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-600/20 via-gold/10 to-saffron/20 p-4 rounded-2xl border border-gold/30 mb-3 overflow-hidden relative"
          >
            <div className="text-3xl relative z-10 mb-1">🏺</div>
            <h3 className="text-xs font-bold text-[#c9933a] tracking-widest uppercase font-display">
              Ancient Vessel Unlocked
            </h3>
            <span className="text-[10px] text-ink dark:text-white mt-1">+10 Prana Earned</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rituals list items */}
      <div className="flex flex-col gap-1.5">
        {habits.length === 0 ? (
          <p className="text-[11px] text-ink-soft/40 dark:text-ivory/40 italic text-center py-4">No rituals added yet.</p>
        ) : (
          habits.map((h) => {
            const done = !!selectedDayDone[h.id]
            const streak = getStreak(h.id)
            const isPastOrToday = selectedIso <= todayStr

            return (
              <motion.div
                key={h.id}
                whileHover={{ scale: 1.005 }}
                onClick={() => { if (isPastOrToday) onToggleHabit(h.id, selectedIso) }}
                className="flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all"
                style={{
                  background: done
                    ? (dark ? 'rgba(201, 168, 76, 0.08)' : 'rgba(200, 169, 110, 0.08)')
                    : (dark ? 'rgba(255,255,255,0.02)' : '#fff8f0'),
                  borderColor: done
                    ? 'rgba(201, 168, 76, 0.35)'
                    : (dark ? 'rgba(255,255,255,0.05)' : '#e8d5b0'),
                  opacity: isPastOrToday ? 1 : 0.4,
                }}
              >
                {/* Checkbox circle with colored dot */}
                <div className="relative shrink-0 w-6 h-6 flex items-center justify-center">
                  <div
                    className="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                    style={{
                      borderColor: done ? h.color : (dark ? 'rgba(255,255,255,0.2)' : '#e8d5b0'),
                      background: done ? `${h.color}22` : 'transparent',
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: h.color,
                        opacity: done ? 1 : 0.4,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm shrink-0">{h.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-medium text-ink dark:text-ivory/95 truncate" style={{ color: dark ? '#fcf6e8' : '#2c1a00' }}>
                    {h.name}
                  </div>
                  <div className="text-[9px] text-ink-soft/50 dark:text-ivory/40">
                    {h.relaxDay ? (h.relaxDay !== 'None' ? `${h.relaxDay} relax day` : `${h.cycleLength} day cycle`) : `${h.cycleLength} day cycle`}
                  </div>
                </div>

                {/* Streak number */}
                <div className="flex items-center gap-1.5">
                  {streak > 0 && (
                    <motion.img
                      src={lotusImg}
                      alt="Streak Lotus"
                      initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      whileHover={{ scale: 1.25, rotate: 10 }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 12
                      }}
                      style={{
                        width: '15px',
                        height: '15px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 1px 3px rgba(200, 169, 110, 0.2))'
                      }}
                    />
                  )}
                  <span className="text-[10px] font-bold text-[#8B6914] dark:text-[#ffeab8]">{streak}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm("Delete this ritual?")) {
                      onDeleteHabit(e, h.id)
                    }
                  }}
                  aria-label="Delete ritual"
                  className="p-2 rounded-md text-ink-soft/40 dark:text-ivory/40 hover:text-rose-500 hover:bg-white/10 shrink-0"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )
          })
        )}
      </div>

      {/* INLINE ADD FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              background: dark ? 'rgba(20, 15, 10, 0.25)' : '#fffaf3',
              border: dark ? '1px solid rgba(201, 168, 76, 0.15)' : '1px solid #e8d5b0',
              borderRadius: '16px',
              padding: '1rem',
              overflow: 'hidden',
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
              <span className="font-display text-[11px] font-semibold uppercase tracking-wider text-[#8B6914] dark:text-[#e8d5b5]">
                New Sadhana
              </span>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gold hover:text-rose-400 font-bold text-xs"
              >
                ×
              </button>
            </div>

            <div>
              <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Ritual Name</label>
              <input
                type="text"
                value={name}
                placeholder="e.g. Surya Namaskar, Meditation..."
                maxLength={35}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-3 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Color Accent</label>
              <div className="flex gap-1.5 flex-wrap py-0.5">
                {HABIT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelColor(c)}
                    className="w-5 h-5 rounded-full border transition-all"
                    style={{
                      backgroundColor: c,
                      borderColor: selColor === c ? (dark ? '#fff' : '#2c1a00') : 'transparent',
                      transform: selColor === c ? 'scale(1.1)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Cycle Length</label>
                <select
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-2 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold"
                >
                  <option value={7}>7 Days (Weekly)</option>
                  <option value={15}>15 Days (Paksha)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Relax Day</label>
                <select
                  value={relaxDay}
                  onChange={(e) => setRelaxDay(e.target.value)}
                  className="w-full rounded-xl border border-gold/20 bg-[#fffaf3] dark:bg-[#1a140f] px-2 py-1.5 text-xs text-ink dark:text-ivory outline-none focus:border-gold"
                >
                  <option value="None">None</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1.5">✨ Pick a Suggested Ritual</label>
              <div className="flex flex-wrap gap-1 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl max-h-[80px] overflow-y-auto">
                {RITUAL_IDEAS[0].items.map(item => (
                  <button
                    key={item.name}
                    onClick={() => { setName(item.name); setIcon(item.icon) }}
                    className="text-[9px] px-2 py-0.5 rounded-lg border border-gold/10 hover:border-gold/30 hover:bg-gold/5 bg-white/[0.02] text-ink dark:text-ivory/80 transition-all whitespace-nowrap"
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-gold uppercase tracking-wider font-bold mb-1">Choose Icon</label>
              <div className="flex flex-wrap gap-1 bg-black/5 dark:bg-black/20 p-1.5 rounded-xl max-h-[55px] overflow-y-auto">
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    onClick={() => setIcon(ic)}
                    className={`w-5.5 h-5.5 rounded flex items-center justify-center text-xs transition-all ${
                      ic === icon ? 'bg-gold/20 scale-110' : 'bg-transparent hover:bg-white/5'
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
              className="w-full py-2 bg-gradient-to-r from-saffron to-gold text-white font-semibold text-xs tracking-wider rounded-xl disabled:opacity-30 transition-all hover:shadow-md active:scale-98"
            >
              Add to my sadhanas
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default ActiveSadhanasCard
