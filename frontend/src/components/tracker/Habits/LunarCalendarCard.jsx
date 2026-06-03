import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function getLunarSubtitle(hindu) {
  if (!hindu) return '';
  const isShukla = hindu.paksha && hindu.paksha.includes('Shukla');
  const pakshaStr = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
  
  let tithiStr = '';
  if (hindu.tithiNum === 15) {
    tithiStr = isShukla ? 'Purnima' : 'Amavasya';
  } else {
    tithiStr = `Tithi ${hindu.tithiNum}`;
  }
  
  let phaseStr = '';
  if (isShukla) {
    if (hindu.tithiNum === 15) {
      phaseStr = 'Full Moon';
    } else if (hindu.tithiNum >= 11) {
      phaseStr = 'Purnima approaching';
    } else {
      phaseStr = 'Waxing';
    }
  } else {
    if (hindu.tithiNum === 15) {
      phaseStr = 'New Moon';
    } else if (hindu.tithiNum >= 11) {
      phaseStr = 'Amavasya approaching';
    } else {
      phaseStr = 'Waning';
    }
  }
  
  return `${pakshaStr} · ${tithiStr} · ${phaseStr}`;
}

export function LunarCalendarCard({
  dark,
  selectedIso,
  selectedHindu,
  calDate,
  selectedDay,
  habits,
  habitDone,
  onSetCalDate,
  onSetSelectedDay
}) {
  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay()
  const todayStr = new Date().toISOString().slice(0, 10)

  const isoForDay = (d) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const monthStats = dayNums.reduce((acc, day) => {
    const iso = isoForDay(day)
    if (iso > todayStr) return acc
    const dayDone = habitDone[iso] || {}
    const count = habits.filter(h => dayDone[h.id]).length
    if (count > 0) acc.activeDays += 1
    if (habits.length > 0 && count === habits.length) acc.perfectDays += 1
    acc.totalDone += count
    return acc
  }, { activeDays: 0, perfectDays: 0, totalDone: 0 })

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.04 } }
      }}
      style={{
        background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
        border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
        borderRadius: '24px',
        padding: '0.85rem 1rem',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
      }}
      className="flex flex-col gap-2.5"
    >
      {/* Date Header */}
      <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
        <div>
          <h2 className="font-display text-xs font-semibold flex items-center gap-1.5" style={{ color: dark ? '#ffeab8' : '#8B6914', margin: 0 }}>
            {new Date(selectedIso).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            <span className="text-gold/80">{selectedHindu.moonSymbol}</span>
          </h2>
          <p className="text-[9px] font-medium mt-0.5 mb-0" style={{ color: dark ? '#c8a96e' : '#8B6914' }}>
            {getLunarSubtitle(selectedHindu)}
          </p>
        </div>
        {/* Navigation arrows for Month */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const n = new Date(calDate)
              n.setMonth(n.getMonth() - 1)
              onSetCalDate(n)
              onSetSelectedDay(1)
            }}
            className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
          >
            <ChevronLeft size={10} />
          </button>
          <button
            onClick={() => {
              const n = new Date(calDate)
              n.setMonth(n.getMonth() + 1)
              onSetCalDate(n)
              onSetSelectedDay(1)
            }}
            className="p-1 rounded-lg border border-gold/15 hover:bg-gold/10 text-gold-lt transition-all"
          >
            <ChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1 border-b border-gold/10 pb-2 text-center max-w-[280px] mx-auto w-full">
        {[
          { label: 'Active days', value: monthStats.activeDays },
          { label: 'Perfect days', value: monthStats.perfectDays },
          { label: 'Ritual sparks', value: monthStats.totalDone },
        ].map((stat) => (
          <div
            key={stat.label}
            className="py-0.5 px-1"
            style={{
              background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.3)',
              border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid #e8d5b0',
              borderRadius: '8px',
            }}
          >
            <div className="font-display text-xs font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914', lineHeight: 1.1 }}>
              {stat.value}
            </div>
            <div className="text-[7px] uppercase tracking-wider text-gold/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 7-Column Calendar Grid */}
      <div className="max-w-[280px] mx-auto w-full">
        <div className="grid grid-cols-7 gap-1 text-center font-display text-[8px] font-bold text-gold/40 uppercase tracking-wider mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 justify-items-center">
          {/* Pre-offset blank days */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-7 h-7" />
          ))}

          {/* Days of the month */}
          {dayNums.map(d => {
            const iso = isoForDay(d)
            const isToday = iso === todayStr
            const isSelected = selectedDay === d
            const dayDone = habitDone[iso] || {}
            const doneOnDayCount = habits.filter(h => dayDone[h.id]).length
            const isFuture = iso > todayStr
            const hasHabits = habits.length > 0
            const isPerfect = hasHabits && doneOnDayCount === habits.length
            const isPartial = hasHabits && doneOnDayCount > 0 && doneOnDayCount < habits.length
            const hasProgress = isPerfect || isPartial
            const completionPct = hasHabits ? Math.round((doneOnDayCount / habits.length) * 100) : 0

            let cellBg = 'transparent'
            let textStyle = { color: dark ? '#fcf6e8' : '#2c1a00' }

            if (hasProgress && !isFuture) {
              if (completionPct <= 30) {
                cellBg = dark ? '#0e4429' : '#9be9a8';
                textStyle = { color: dark ? '#85e89d' : '#1b5e20' };
              } else if (completionPct <= 60) {
                cellBg = dark ? '#006d32' : '#40c463';
                textStyle = { color: '#ffffff' };
              } else if (completionPct < 100) {
                cellBg = dark ? '#26a641' : '#30a14e';
                textStyle = { color: '#ffffff' };
              } else if (completionPct === 100) {
                cellBg = dark ? '#39d353' : '#216e39';
                textStyle = { color: dark ? '#0e4429' : '#ffffff' };
              }
            }

            let cellBorder = 'transparent'
            let borderThickness = '1px'
            if (isToday) {
              cellBorder = dark ? 'rgba(201,168,76,0.5)' : '#e8d5b0';
              if (cellBg === 'transparent') {
                cellBg = dark ? 'rgba(201,168,76,0.1)' : 'rgba(200,169,110,0.1)';
              }
            }
            if (isSelected) {
              cellBorder = dark ? '#ffeab8' : '#8B6914';
              borderThickness = '2px';
              if (cellBg === 'transparent') {
                cellBg = dark ? 'rgba(201,168,76,0.25)' : 'rgba(200, 169, 110, 0.2)';
              }
            }

            return (
              <motion.div
                key={d}
                whileHover={{ scale: 1.05 }}
                onClick={() => onSetSelectedDay(d)}
                className="rounded-full cursor-pointer flex flex-col items-center justify-center w-7 h-7 relative text-[9px] transition-all"
                style={{
                  background: cellBg,
                  border: cellBorder !== 'transparent' ? `${borderThickness} solid ${cellBorder}` : 'none',
                  opacity: isFuture ? 0.35 : 1,
                }}
              >
                <span className="font-semibold" style={textStyle}>
                  {d}
                </span>
                {/* Dot under number */}
                {hasProgress && !isFuture && !isSelected && (
                  <span
                    className="w-0.5 h-0.5 rounded-full absolute bottom-1"
                    style={{ backgroundColor: isPerfect ? (dark ? '#39d353' : '#216e39') : '#c9933a' }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
export default LunarCalendarCard
