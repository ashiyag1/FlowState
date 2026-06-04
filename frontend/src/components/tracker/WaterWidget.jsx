import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Droplets } from 'lucide-react'
import { useWellness } from '../../context/WellnessContext'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { useTheme } from '../../context/ThemeContext'
import { pct as calcPct } from '../../utils'

const BOTTLES = [
  { label: 'Sip',     ml: 100,  emoji: '🥛' },
  { label: 'Glass',   ml: 200,  emoji: '🥤' },
  { label: 'Medium',  ml: 500,  emoji: '🫙' },
  { label: '1 Litre', ml: 1000, emoji: '🍶' },
]

export default function WaterWidget() {
  const { waterGoal, setWaterGoal, todayTotal, addWater, getWaterStreak } = useWellness()
  const { playHydrationSound } = useSoundEffects()
  const { dark } = useTheme()
  const [customMl, setCustomMl] = useState('')
  
  const total = todayTotal
  const waterPct = Math.round(calcPct(total, waterGoal))
  const waterStreak = getWaterStreak ? getWaterStreak() : 0

  const handleAddWater = (ml, label) => {
    const wasBelowGoal = total < waterGoal
    addWater(ml, label)
    if (wasBelowGoal && total + ml >= waterGoal) playHydrationSound()
  }

  // Circular progress math
  const strokeWidth = 5
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, waterPct)) / 100) * circumference

  return (
    <div 
      className="transition-all duration-300"
      style={{
        background: dark ? 'rgba(20, 15, 10, 0.45)' : '#fdf6ec',
        border: dark ? '1px solid rgba(201, 168, 76, 0.16)' : '1px solid #e8d5b0',
        borderRadius: '24px',
        padding: '1.25rem',
        boxShadow: dark ? '0 12px 36px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b border-gold/10 pb-2">
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border"
          style={{ 
            backgroundColor: dark ? 'rgba(87, 184, 214, 0.15)' : 'rgba(87, 184, 214, 0.1)',
            borderColor: dark ? 'rgba(87, 184, 214, 0.3)' : 'rgba(87, 184, 214, 0.25)',
          }}
        >
          <Droplets size={14} className="text-[#57B8D6]" />
          <h3 
            className="font-display text-xs font-bold uppercase tracking-wider m-0"
            style={{ color: dark ? '#a5f3fc' : '#1e748f' }}
          >
            The nourishment
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gold uppercase tracking-wider font-bold">Goal: {waterGoal}ml</span>
          <div className="flex bg-white/5 border border-gold/20 rounded-md">
            <button onClick={() => setWaterGoal(Math.max(500, waterGoal - 500))} className="p-0.5 hover:bg-[#57B8D6]/20 transition-all text-[#57B8D6]">
              <Minus size={10} />
            </button>
            <button onClick={() => setWaterGoal(Math.min(5000, waterGoal + 500))} className="p-0.5 border-l border-gold/20 hover:bg-[#57B8D6]/20 transition-all text-[#57B8D6]">
              <Plus size={10} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[10.5px] italic mt-0 mb-3 opacity-80 leading-relaxed font-sans" style={{ color: dark ? '#a5f3fc' : '#1e748f' }}>
        Jala (water) brings fresh energy and life. Keep flowing, one sip at a time.
      </p>

      {/* Content */}
      <div className="flex flex-col gap-3">
        {/* Progress block */}
        <div className="flex items-center gap-4 py-1">
          {/* Circular Progress Ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-gold/10 dark:stroke-white/5"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                className="stroke-[#57B8D6] transition-all duration-500 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink dark:text-ivory">
              {waterPct}%
            </div>
          </div>

          <div className="flex-1 flex justify-between items-center pr-2">
            <div>
              <div className="font-display text-lg font-bold text-[#8B6914] dark:text-[#ffeab8] leading-tight">
                {total} ml
              </div>
              <div className="text-[10px] text-ink-soft/60 dark:text-ivory/60">
                of {waterGoal}ml goal
              </div>
            </div>
            
            {waterStreak > 0 && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm"
                style={{
                  backgroundColor: dark ? 'rgba(87, 184, 214, 0.15)' : 'rgba(87, 184, 214, 0.08)',
                  borderColor: dark ? 'rgba(87, 184, 214, 0.3)' : 'rgba(87, 184, 214, 0.25)',
                }}
              >
                <span className="text-[11px]">💧</span>
                <span 
                  className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: dark ? '#a5f3fc' : '#1e748f' }}
                >
                  {waterStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Add Row */}
        <div className="grid grid-cols-4 gap-1.5">
          {BOTTLES.map(b => (
            <motion.button 
              key={b.ml}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddWater(b.ml, b.label)}
              className="flex flex-col items-center justify-center rounded-xl py-1.5 px-1 transition-all duration-200"
              style={{
                background: dark ? 'rgba(28, 18, 8, 0.8)' : '#fff8f0',
                border: dark ? '0.5px solid rgba(201, 168, 76, 0.25)' : '0.5px solid #e8d5b0',
                color: dark ? '#f7eed7' : '#8B6914',
              }}
            >
              <span className="text-base mb-0.5">{b.emoji}</span>
              <span className="text-[9px] font-bold text-center leading-tight">{b.label}</span>
              <span className="text-[8px] opacity-75">{b.ml}ml</span>
            </motion.button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-gold/10 rounded-xl p-1 pl-2">
          <span className="text-xs">💧</span>
          <input 
            type="number" 
            placeholder="Custom amount (ml)..." 
            value={customMl} 
            onChange={(e) => setCustomMl(e.target.value)}
            className="bg-transparent border-none outline-none text-[10px] text-ink dark:text-ivory w-full px-1"
          />
          <button 
            onClick={() => {
              if(customMl && !isNaN(customMl) && Number(customMl) > 0) {
                handleAddWater(Number(customMl), 'Custom')
                setCustomMl('')
              }
            }}
            className="text-[10px] bg-[#57B8D6] hover:bg-[#46a0bc] text-white px-2.5 py-1 rounded-lg transition-colors font-bold"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
