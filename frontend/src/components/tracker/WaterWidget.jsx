import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Droplets } from 'lucide-react'
import { useWellness } from '../../context/WellnessContext'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { pct as calcPct } from '../../utils'
import WaterProgress from './WaterProgress'

const BOTTLES = [
  { label: 'Sip',     ml: 100,  emoji: '🥛' },
  { label: 'Glass',   ml: 200,  emoji: '🥃' },
  { label: 'Medium',  ml: 500,  emoji: '🍶' },
  { label: '1 Litre', ml: 1000, emoji: '🌊' },
]

export default function WaterWidget() {
  const { waterGoal, setWaterGoal, todayTotal, addWater } = useWellness()
  const { playHydrationSound } = useSoundEffects()
  const [customMl, setCustomMl] = useState('')
  
  const total = todayTotal
  const waterPct = Math.round(calcPct(total, waterGoal))

  const handleAddWater = (ml, label) => {
    const wasBelowGoal = total < waterGoal
    addWater(ml, label)
    if (wasBelowGoal && total + ml >= waterGoal) playHydrationSound()
  }

  return (
    <div className="card p-6 mb-8 w-full">
      <div className="flex justify-between items-center mb-4 border-b border-gold/10 pb-3">
        <div className="flex items-center gap-2">
          <Droplets size={20} className="text-[#57B8D6]" />
          <h3 className="font-display text-xl text-ink dark:text-sand-lt">The Nourishment</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-soft/60 uppercase tracking-wider font-bold">Goal: {waterGoal}ml</span>
          <div className="flex bg-white/5 border border-gold/20 rounded-md">
            <button onClick={() => setWaterGoal(Math.max(500, waterGoal - 500))} className="p-1 hover:bg-[#57B8D6]/20 transition-all text-[#57B8D6]">
              <Minus size={12} />
            </button>
            <button onClick={() => setWaterGoal(Math.min(5000, waterGoal + 500))} className="p-1 border-l border-gold/20 hover:bg-[#57B8D6]/20 transition-all text-[#57B8D6]">
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <WaterProgress pct={waterPct} ml={total} goal={waterGoal} />
        </div>
        
        <div className="flex-1 w-full">
          <p className="eyebrow mb-3">⚡ Quick Hydration</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {BOTTLES.map(b => (
              <motion.button key={b.ml}
                whileTap={{ scale: 0.92 }} whileHover={{ y: -3, scale: 1.03 }}
                onClick={() => handleAddWater(b.ml, b.label)}
                className="flex flex-col items-center gap-1 rounded-xl p-3 cursor-pointer
                  border border-ocean-pale dark:border-[#57B8D6]/20 bg-white/60 dark:bg-white/[0.03]
                  hover:border-[#57B8D6]/50 hover:bg-[#57B8D6]/10
                  transition-all duration-200">
                <span className="text-2xl mb-1">{b.emoji}</span>
                <span className="text-xs font-bold text-center leading-tight text-mist-dark dark:text-[#57B8D6]/80">{b.label}</span>
                <span className="text-xs font-bold text-[#57B8D6]">{b.ml}ml</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 bg-white/5 border border-gold/10 rounded-xl p-1.5 pl-3">
            <span className="text-xs">💧</span>
            <input 
              type="number" 
              placeholder="Custom amount (ml)..." 
              value={customMl} 
              onChange={(e) => setCustomMl(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-ink dark:text-ivory w-full px-1"
            />
            <button 
              onClick={() => {
                if(customMl && !isNaN(customMl) && Number(customMl) > 0) {
                  handleAddWater(Number(customMl), 'Custom')
                  setCustomMl('')
                }
              }}
              className="text-xs bg-[#57B8D6] text-white px-3 py-1.5 rounded-lg hover:bg-[#46a0bc] transition-colors shadow-sm font-bold tracking-wide"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
