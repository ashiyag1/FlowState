import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Waves, Sun, Moon, Flower2, Cloud, X, Feather } from 'lucide-react'
import LotusFlower from '../../icons/LotusFlower'

const MOODS = [
  { label: 'Grateful',  moodIcon: Heart,   bg: 'bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/20 dark:hover:bg-rose-900/30',   text: 'text-rose-700 dark:text-rose-300',   glow: 'rgba(244,114,182,0.12)',  tint: '#f472b6' },
  { label: 'Calm',      moodIcon: Waves,   bg: 'bg-sky-100/70 hover:bg-sky-200/80 dark:bg-sky-950/20 dark:hover:bg-sky-900/30',    text: 'text-sky-700 dark:text-sky-300',    glow: 'rgba(96,165,250,0.10)',  tint: '#60a5fa' },
  { label: 'Energized', moodIcon: Sun,     bg: 'bg-amber-100/70 hover:bg-amber-200/80 dark:bg-amber-950/20 dark:hover:bg-amber-900/30', bgActive: 'from-amber-300 to-yellow-400', text: 'text-amber-700 dark:text-amber-300', glow: 'rgba(251,191,36,0.12)',  tint: '#fbbf24' },
  { label: 'Reflective',moodIcon: Moon,    bg: 'bg-purple-100/70 hover:bg-purple-200/80 dark:bg-purple-950/20 dark:hover:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', glow: 'rgba(167,139,250,0.10)', tint: '#a78bfa' },
  { label: 'Happy',     moodIcon: Flower2, bg: 'bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', glow: 'rgba(52,211,153,0.10)', tint: '#34d399' },
  { label: 'Tired',     moodIcon: Cloud,   bg: 'bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-950/20 dark:hover:bg-slate-900/30',  text: 'text-slate-700 dark:text-slate-300',  glow: 'rgba(156,163,175,0.08)', tint: '#9ca3af' },
]

export function ParchmentJournalCard({
  dark,
  text,
  setText,
  mood,
  setMood,
  reflection,
  activePrompt,
  onSaveEntry,
  onCyclePrompt,
  inkSplash,
  xpToast
}) {
  const textareaRef = useRef(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    autoResize()
  }, [text])

  const currentMood = MOODS.find(m => m.label === mood)
  const moodGlow = currentMood?.glow || 'transparent'

  const handleMoodClick = (mLabel) => {
    const selected = mood === mLabel
    setMood(selected ? '' : mLabel)
    // Inject template automatically if text area is empty
    if (!selected && !text.trim() && activePrompt.template) {
      setText(activePrompt.template)
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-[#fbf6ee] dark:bg-[#1f1913] shadow-[inset_8px_0_16px_rgba(0,0,0,0.06)] flex flex-col justify-between relative min-h-[460px]">
      
      {/* Inner Parchment glow container */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: mood ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: mood
            ? `radial-gradient(circle at 75% 50%, ${moodGlow} 0%, transparent 80%)`
            : 'transparent',
        }}
      />

      {/* Title & Help details */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-xs text-gold flex items-center gap-1.5 uppercase font-bold tracking-widest">
            ✦ Today's Reflection
          </h4>
          
          <button
            onClick={onCyclePrompt}
            className="text-[9px] text-[#8a5a2b] dark:text-gold-lt bg-gold/10 hover:bg-gold/20 py-0.5 px-2 rounded-full border border-gold/20 transition-all font-semibold"
          >
            Inspire Me ✦
          </button>
        </div>
        
        <h2 className="font-display text-lg md:text-xl text-[#2d1f0e] dark:text-ivory mt-1 leading-snug">
          {activePrompt.text}
        </h2>
        <p className="text-[10px] text-[#5c3b17]/50 dark:text-ivory/50 mt-1 font-light font-mono">
          Tune into your heart. There is no right or wrong here.
        </p>
        <div className="mt-2.5 p-2.5 rounded-xl border border-gold/15 bg-white/25 dark:bg-black/20 text-left">
          <p className="text-[11px] font-serif italic text-sandalwood dark:text-gold-lt leading-relaxed">
            "{reflection.message}"
          </p>
        </div>

        {/* Mood selector pills */}
        <div className="flex flex-wrap gap-1.5 mt-3.5 pb-2">
          {MOODS.map(m => {
            const Icon = m.moodIcon
            const selected = mood === m.label
            return (
              <button
                key={m.label}
                onClick={() => handleMoodClick(m.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all border ${
                  selected
                    ? 'bg-gradient-to-br from-gold to-[#c9933a] text-white shadow-md border-transparent scale-[1.03]'
                    : `${m.bg} ${m.text} border-gold/10 hover:scale-[1.02]`
                }`}
              >
                <Icon size={11} className={selected ? 'text-white' : 'opacity-70'} />
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lined Text Editor Area */}
      <div className="relative z-10 flex-1 flex flex-col mt-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); autoResize() }}
          placeholder="Let your thoughts stream gently onto these pages..."
          maxLength={1000}
          className="w-full flex-1 min-h-[220px] bg-transparent text-ink dark:text-ivory text-xs md:text-sm font-body leading-loose placeholder:text-gold/25 placeholder:italic resize-none focus:outline-none parchment-lines"
        />
        
        {text && (
          <button
            onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto' }}
            className="absolute top-0 right-0 p-1 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 text-ink/40 dark:text-ivory/40 transition-all"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Save Seal Block & Character Counter */}
      <div className="relative z-10 flex items-center justify-between border-t border-gold/15 pt-3 mt-4">
        <span className="flex items-center gap-1 text-[9px] text-[#8a5a2b] dark:text-gold-lt/70 italic font-mono font-medium">
          <Feather size={10} />
          {(text || '').length}/1000 characters
        </span>

        {/* Purple Wax Seal Button */}
        <div className="relative">
          <AnimatePresence>
            {inkSplash && (
              <motion.div
                key="ink-splash"
                initial={{ scale: 0.2, opacity: 0.7 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-gold/50 pointer-events-none"
                style={{ filter: 'blur(5px)' }}
              />
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              if (text && text.trim()) onSaveEntry()
            }}
            disabled={!text || !text.trim()}
            className={`wax-seal-wood-container ${(!text || !text.trim()) ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="wax-seal-purple-seal">
              <LotusFlower size={20} />
            </div>
            <div className="wax-seal-wood-text">
              <span className="wax-seal-wood-text-title">Preserve Reflection</span>
              <span className="wax-seal-wood-text-subtitle">Seal this thought</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
export default ParchmentJournalCard
