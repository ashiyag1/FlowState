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
      style={{
        background: '#1c1208',
        border: '1px solid rgba(201, 168, 76, 0.3)',
        borderRadius: '20px',
        padding: '0.85rem 1rem',
        minHeight: '210px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 85% 12%, rgba(201,168,76,0.18), transparent 34%), radial-gradient(circle at 10% 88%, rgba(232,98,42,0.10), transparent 38%)',
        }}
      />
      <div className="flex items-center justify-between border-b border-[#c8a96e]/20 pb-1.5 mb-2">
        <h3 className="font-display text-[10px] text-gold flex items-center gap-1.5 uppercase font-bold tracking-wider" style={{ color: '#c8a96e', margin: 0 }}>
          <Sparkles size={11} /> Mind-blowing moon fact
        </h3>
        <span className="text-[8px] text-[#c8a96e]/40">
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
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.25)',
                boxShadow: '0 0 12px rgba(201,168,76,0.15)',
              }}
            >
              <span className="text-base">{currentInsight.icon}</span>
            </div>
            <div className="min-w-0">
              <span className="inline-flex text-[7px] uppercase tracking-[0.18em] text-[#c8a96e]/60 font-bold mb-0">
                {currentInsight.stat}
              </span>
              <h4 style={{
                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2,
                color: '#fdf6ec', margin: 0,
              }}>
                {currentInsight.title}
              </h4>
            </div>
          </div>

          <p style={{
            fontSize: '10px', lineHeight: 1.4, fontWeight: 300, fontFamily: "'Lora', serif",
            color: '#c8a96e88', margin: '4px 0 0'
          }}>
            {currentInsight.desc}
          </p>

          <div
            style={{
              borderRadius: 12,
              padding: '6px 10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(201,168,76,0.15)',
              marginTop: '4px'
            }}
          >
            <p className="text-[9px] leading-relaxed m-0" style={{ color: '#c8a96e' }}>
              <strong>Why it slaps:</strong> "{currentInsight.vibe}"
            </p>
          </div>

          <div
            style={{
              borderRadius: 12,
              padding: '6px 10px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.15)',
              marginTop: '4px'
            }}
          >
            <p className="text-[9px] leading-relaxed m-0" style={{ color: '#c8a96ebb' }}>
              <strong>What you should do:</strong> {currentInsight.tryThis}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#c8a96e]/10">
        <div className="flex gap-1">
          {scientificInsights.map((_, i) => (
            <button
              key={i}
              onClick={() => onSetInsightIdx(i)}
              className="h-1 rounded-full transition-all"
              style={{
                width: i === currentInsightIdx ? 12 : 4,
                background: i === currentInsightIdx ? '#C9933A' : 'rgba(200,169,110,0.2)',
              }}
              aria-label={`Open lunar insight ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetInsightIdx((currentInsightIdx - 1 + scientificInsights.length) % scientificInsights.length)}
            className="p-0.5 rounded border border-[#c8a96e]/20 bg-white/[0.02] hover:bg-[#c8a96e]/10 text-[#c8a96e] transition-all"
          >
            <ChevronLeft size={10} />
          </button>
          <button
            onClick={() => onSetInsightIdx((currentInsightIdx + 1) % scientificInsights.length)}
            className="p-0.5 rounded border border-[#c8a96e]/20 bg-white/[0.02] hover:bg-[#c8a96e]/10 text-[#c8a96e] transition-all"
          >
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
export default LunarFactCarousel
