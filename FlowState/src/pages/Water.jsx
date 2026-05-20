import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus } from 'lucide-react'
import { useWellness } from '../context/WellnessContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { pct as calcPct } from '../utils'
import PageLayout, { Container } from '../components/PageLayout'
import WaterProgress from '../components/Waterprogress'
import waterBg from '../assets/pages/water_bg.png'

const BOTTLES = [
  { label: 'Sip',     ml: 100,  emoji: '🥛' },
  { label: 'Glass',   ml: 200,  emoji: '🥃' },
  { label: 'Small',   ml: 330,  emoji: '🧋' },
  { label: 'Medium',  ml: 500,  emoji: '🍶' },
  { label: 'Sport',   ml: 600,  emoji: '🏃' },
  { label: 'Large',   ml: 750,  emoji: '💪' },
  { label: '1 Litre', ml: 1000, emoji: '🌊' },
  { label: '2 Litre', ml: 2000, emoji: '🌅' },
]

function WaterDrop({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={style}
      initial={{ y: '110vh', opacity: 0, scale: 0.6 }}
      animate={{
        y: '-10vh',
        opacity: [0, 0.45, 0.45, 0],
        scale:   [0.6, 1, 1, 0.8],
        rotate:  [0, 15, -10, 0],
      }}
      transition={{
        duration: style.duration,
        delay:    style.delay,
        repeat:   Infinity,
        ease:     'easeInOut',
      }}
    >
      <svg width={style.size} height={style.size * 1.3} viewBox="0 0 40 52" fill="none">
        <path d="M20 2 C20 2 4 22 4 34 C4 43.9 11.2 50 20 50 C28.8 50 36 43.9 36 34 C36 22 20 2 20 2Z"
          fill={style.color} opacity="0.7" />
        <path d="M14 32 C12 28 14 22 18 20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

const DROPS = Array.from({ length: 12 }, (_, i) => ({
  left:     `${Math.random() * 100}%`,
  size:     16 + Math.random() * 20,
  duration: 8 + Math.random() * 12,
  delay:    Math.random() * 14,
  color:    ['#57B8D6', '#2E86AB', '#9FE1CB', '#378ADD', '#B5D4F4'][Math.floor(Math.random() * 5)],
}))

const sv = (d = 0) => ({
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] } },
})

export default function Water() {
  const { waterGoal, setWaterGoal, todayEntries, todayTotal, addWater, removeWater, clearWaterToday, waterLog } = useWellness()
  const { playHydrationSound } = useSoundEffects()
  const [custom, setCustom] = useState('')
  const [goalInput, setGoalInput] = useState(waterGoal)

  const total   = todayTotal
  const waterPct = calcPct(total, waterGoal)
  const rem     = Math.max(0, waterGoal - total)

  const handleGoalChange = (v) => {
    const n = parseInt(v)
    setGoalInput(n)
    if (n >= 500 && n <= 6000) setWaterGoal(n)
  }

  const handleAddWater = (ml, label) => {
    const wasBelowGoal = total < waterGoal
    addWater(ml, label)
    if (wasBelowGoal && total + ml >= waterGoal) playHydrationSound()
  }

  const handleCustomAdd = () => {
    const n = parseInt(custom)
    if (n >= 10 && n <= 3000) { handleAddWater(n, 'Custom'); setCustom('') }
  }

  const history = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (i + 1))
    const iso = d.toISOString().slice(0, 10)
    const entries = waterLog[iso] || []
    const t = entries.reduce((s, e) => s + e.ml, 0)
    return {
      iso, total: t, pct: calcPct(t, waterGoal),
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    }
  })

  return (
    <PageLayout>
      <div className="relative min-h-screen overflow-hidden"
        style={{
          paddingTop: '4.5rem',
          background: `linear-gradient(180deg, rgba(235,248,255,0.60) 0%, rgba(219,238,255,0.55) 40%, rgba(235,248,255,0.60) 100%), url(${waterBg}) center/cover fixed`
        }}
      >
        <div className="dark:hidden absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30 pointer-events-none" />
        <div className="hidden dark:block absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(10,22,40,0.92) 0%, rgba(13,36,64,0.88) 40%, rgba(10,22,40,0.92) 100%)' }} />
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {DROPS.map((d, i) => <WaterDrop key={i} style={d} />)}

        </div>

        <Container className="pt-12 pb-20 relative z-10">

          {/* ── Compact Header ── */}
          <motion.div variants={sv(0)} initial="hidden" animate="show" className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow mb-1" style={{ color: '#2E86AB' }}>Daily hydration</p>
              <h1 className="leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', 'Lora', serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 300, color: '#0D1F2D' }}>
                Water <em style={{ fontStyle: 'italic', color: '#2E86AB' }}>Dashboard</em>
              </h1>
            </div>
            <div className="flex items-center gap-3 bg-white/70 dark:bg-white/[0.05] backdrop-blur-md rounded-2xl px-4 py-2.5 border border-ocean-pale dark:border-ocean/20">
              <label className="text-xs font-bold text-ocean dark:text-ocean-lt flex items-center gap-1.5">
                🎯 Goal
              </label>
              <input type="number" value={goalInput} min={500} max={6000} step={50}
                onChange={e => handleGoalChange(e.target.value)}
                className="w-20 px-2 py-1.5 rounded-lg border border-ocean-pale dark:border-ocean/30 bg-sand-lt dark:bg-ink text-ink dark:text-sand-lt font-bold text-center text-sm outline-none focus:ring-2 focus:ring-ocean/30 transition-all" />
              <span className="text-xs text-mist-dark dark:text-ocean-lt/60">ml/day</span>
            </div>
          </motion.div>

          {/* ── Main Content: Progress + Quick Add ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">

            {/* Left: Progress visualization (takes 2 cols) */}
            <motion.div variants={sv(0.1)} initial="hidden" animate="show" className="md:col-span-2">
              <div className="card p-6 h-full flex flex-col items-center justify-center">
                <WaterProgress pct={waterPct} ml={total} goal={waterGoal} />
                <div className="w-full mt-5">
                  <div className="h-2.5 rounded-full overflow-hidden bg-ocean-pale dark:bg-ocean/15">
                    <motion.div className="h-full rounded-full relative overflow-hidden"
                      initial={{ width: 0 }} animate={{ width: waterPct + '%' }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{ background: 'linear-gradient(90deg, #1AA3E8, #57B8D6)' }}>
                      <motion.div className="absolute inset-0"
                        animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-xs text-mist-dark dark:text-ocean-lt/50 mt-1.5 font-semibold">
                    <span>0 ml</span><span>{waterGoal} ml</span>
                  </div>
                </div>
                <p className="text-sm text-mist-dark dark:text-ocean-lt/70 mt-4 text-center">
                  {rem > 0
                    ? <><span className="font-bold text-ocean dark:text-ocean-lt">{rem} ml</span> remaining today</>
                    : <span className="text-green-600 dark:text-green-400 font-semibold">🎉 Goal crushed! Amazing work.</span>}
                </p>
              </div>
            </motion.div>

            {/* Right: Quick Add + Custom (takes 3 cols) */}
            <motion.div variants={sv(0.15)} initial="hidden" animate="show" className="md:col-span-3">
              <div className="card p-5 h-full flex flex-col">
                <p className="eyebrow mb-3">⚡ Quick add</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {BOTTLES.map(b => (
                    <motion.button key={b.ml}
                      whileTap={{ scale: 0.88 }} whileHover={{ y: -3, scale: 1.03 }}
                      onClick={() => handleAddWater(b.ml, b.label)}
                      className="flex flex-col items-center gap-1 rounded-xl p-2.5 cursor-pointer
                        border border-ocean-pale dark:border-ocean/20 bg-white/60 dark:bg-white/[0.03]
                        hover:border-ocean/40 dark:hover:border-ocean-lt/30 hover:bg-ocean/5 dark:hover:bg-ocean/5
                        transition-all duration-200">
                      <span className="text-xl">{b.emoji}</span>
                      <span className="text-[10px] font-bold text-center leading-tight text-mist-dark dark:text-ocean-lt/60">{b.label}</span>
                      <span className="text-[10px] font-bold text-ocean dark:text-ocean-lt">{b.ml}ml</span>
                    </motion.button>
                  ))}
                </div>
                <div className="mt-auto">
                  <p className="eyebrow mb-2">✏️ Custom amount</p>
                  <div className="flex gap-2">
                    <input type="number" value={custom} placeholder="Enter ml (e.g. 450)"
                      onChange={e => setCustom(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCustomAdd()}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-ocean-pale dark:border-ocean/30 bg-sand-lt dark:bg-ink text-ink dark:text-sand-lt font-semibold text-sm outline-none focus:ring-2 focus:ring-ocean/30 transition-all"
                      min={10} max={3000} />
                    <motion.button whileTap={{ scale: 0.96 }} onClick={handleCustomAdd}
                      className="btn-primary flex items-center gap-1.5 px-5 py-2.5 text-sm">
                      <Plus size={16} /> Add
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ── Bottom: Log + History ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Today's Log */}
            <motion.div variants={sv(0.2)} initial="hidden" animate="show">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="eyebrow">📋 Today's log</p>
                    <p className="text-xs text-mist-dark dark:text-ocean-lt/50 mt-0.5">
                      {todayEntries.length} entries · {total} ml total
                    </p>
                  </div>
                  {todayEntries.length > 0 && (
                    <button onClick={clearWaterToday}
                      className="text-xs font-bold px-3 py-1.5 rounded-full border border-ocean-pale dark:border-ocean/20 text-mist-dark dark:text-ocean-lt/60 hover:border-red-300 hover:text-red-500 transition-all">
                      Clear all
                    </button>
                  )}
                </div>
                {todayEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">💧</div>
                    <p className="text-sm text-mist-dark dark:text-ocean-lt/50">No entries yet — tap a bottle above!</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    <AnimatePresence>
                      {[...todayEntries].reverse().map((e) => (
                        <motion.div key={e.id}
                          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sand-lt dark:bg-ink border border-ocean-pale dark:border-ocean/15">
                          <div className="w-2 h-2 rounded-full bg-ocean flex-shrink-0" />
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(46,134,171,0.12)', color: '#0C6BA3' }}>
                            +{e.ml} ml
                          </span>
                          <span className="text-sm font-medium flex-1 text-mist-dark dark:text-ocean-lt/70">{e.label}</span>
                          <span className="text-xs text-mist-dark/60 dark:text-ocean-lt/40">{e.time}</span>
                          <button onClick={() => removeWater(e.id)}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 7-Day History */}
            <motion.div variants={sv(0.25)} initial="hidden" animate="show">
              <div className="card p-5">
                <p className="eyebrow mb-4">📊 Last 7 days</p>
                <div className="space-y-2.5">
                  {history.map((d, i) => (
                    <motion.div key={d.iso} variants={sv(i * 0.04)} initial="hidden" whileInView="show" viewport={{ once: true }}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-semibold text-ink dark:text-sand-lt">{d.label}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-display text-ocean dark:text-ocean-lt font-medium">{d.total} ml</span>
                          {d.pct >= 100 && <span className="text-xs">✅</span>}
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-ocean-pale dark:bg-ocean/15">
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: d.pct + '%' }}
                          viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05 }}
                          style={{ background: 'linear-gradient(90deg, #1AA3E8, #57B8D6)' }} />
                      </div>
                      <div className="text-[10px] mt-0.5 font-semibold text-mist-dark/60 dark:text-ocean-lt/40">{d.pct}% of goal</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

        </Container>
      </div>
    </PageLayout>
  )
}
