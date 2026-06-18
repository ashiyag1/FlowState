import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { getScientificInsights } from '../../../utils/hinduCalendar'

export function LunarFactCarousel({
  currentInsightIdx,
  onSetInsightIdx
}) {
  const scientificInsights = getScientificInsights()
  const currentInsight = scientificInsights[currentInsightIdx]

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.12 } }
      }}
      className="bg-white/60 dark:bg-[#1c1208] backdrop-blur-md border border-gold/30 rounded-[20px] px-4 py-[0.85rem] min-h-[210px] flex flex-col justify-between overflow-hidden relative shadow-sm dark:shadow-none"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 85% 12%, rgba(201,168,76,0.18), transparent 34%), radial-gradient(circle at 10% 88%, rgba(232,98,42,0.10), transparent 38%)',
        }}
      />
      <div className="flex items-center justify-between border-b border-gold/20 pb-1.5 mb-2 relative z-10">
        <h3 className="font-display text-[10px] text-gold flex items-center gap-1.5 uppercase font-bold tracking-wider m-0">
          <Sparkles size={11} /> Mind-blowing moon fact
        </h3>
        <span className="text-[8px] text-[#5c3b17]/60 dark:text-[#c8a96e]/40 font-bold">
          {currentInsightIdx + 1} / {scientificInsights.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsightIdx}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col gap-2 py-0.5 relative z-10"
        >
          <div className="flex items-center gap-2">
            <div
              className="shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/[0.05] border border-gold/25 rounded-[10px]"
              style={{
                width: 32,
                height: 32,
                boxShadow: '0 0 12px rgba(201,168,76,0.15)',
              }}
            >
              <span className="text-base">{currentInsight.icon}</span>
            </div>
            <div className="min-w-0">
              <span className="inline-flex text-[7px] uppercase tracking-[0.18em] text-[#5c3b17]/60 dark:text-[#c8a96e]/60 font-bold mb-0">
                {currentInsight.stat}
              </span>
              <h4 className="text-[0.78rem] font-bold tracking-[0.02em] leading-[1.2] text-[#3d2e1a] dark:text-[#fdf6ec] m-0">
                {currentInsight.title}
              </h4>
            </div>
          </div>

          <p className="text-[10px] leading-[1.4] font-light font-lora text-[#5c3b17]/80 dark:text-[#c8a96e]/70 m-0 mt-1">
            {currentInsight.desc}
          </p>

          <div className="rounded-xl px-2.5 py-1.5 bg-black/5 dark:bg-black/20 border border-gold/15 mt-1">
            <p className="text-[9px] leading-relaxed m-0 text-[#5c3b17] dark:text-[#c8a96e]">
              <strong>Why it slaps:</strong> "{currentInsight.vibe}"
            </p>
          </div>

          <div className="rounded-xl px-2.5 py-1.5 bg-gold/10 dark:bg-gold/[0.08] border border-gold/15 mt-1">
            <p className="text-[9px] leading-relaxed m-0 text-[#5c3b17]/90 dark:text-[#c8a96e]/90">
              <strong>What you should do:</strong> {currentInsight.tryThis}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gold/10 relative z-10">
        <div className="flex gap-1">
          {scientificInsights.map((_, i) => (
            <button
              key={i}
              onClick={() => onSetInsightIdx(i)}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === currentInsightIdx ? 12 : 4,
                background: i === currentInsightIdx ? '#C9933A' : 'rgba(200,169,110,0.3)',
              }}
              aria-label={`Open lunar insight ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetInsightIdx((currentInsightIdx - 1 + scientificInsights.length) % scientificInsights.length)}
            className="p-0.5 rounded border border-gold/20 bg-black/5 dark:bg-white/[0.02] hover:bg-gold/10 text-[#5c3b17] dark:text-gold transition-all"
          >
            <ChevronLeft size={10} />
          </button>
          <button
            onClick={() => onSetInsightIdx((currentInsightIdx + 1) % scientificInsights.length)}
            className="p-0.5 rounded border border-gold/20 bg-black/5 dark:bg-white/[0.02] hover:bg-gold/10 text-[#5c3b17] dark:text-gold transition-all"
          >
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
export default LunarFactCarousel
