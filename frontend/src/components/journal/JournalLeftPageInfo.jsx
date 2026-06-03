import React from 'react'
import LotusFlower from '../../icons/LotusFlower'

function MoonIllustration({ phasePercent }) {
  const phasePercentNum = Number(phasePercent) || 0
  const isFull = phasePercentNum >= 46 && phasePercentNum <= 54
  const isNew = phasePercentNum <= 4 || phasePercentNum >= 96
  const isWaxing = phasePercentNum > 4 && phasePercentNum < 46

  return (
    <svg width="64" height="64" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }} className="mx-auto my-2">
      <circle cx="50" cy="50" r="40" fill="#1b1208" stroke="#c9933a" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="38" fill="url(#moonGlow)" opacity="0.1" />
      {isFull ? (
        <circle cx="50" cy="50" r="38" fill="#fcfcf7" />
      ) : isNew ? (
        <circle cx="50" cy="50" r="38" fill="#140f0a" />
      ) : (
        <path
          d={
            isWaxing 
              ? "M 50 12 A 38 38 0 0 1 50 88 A 38 38 0 0 0 50 12" 
              : "M 50 12 A 38 38 0 0 0 50 88 A 38 38 0 0 1 50 12"
          }
          fill="#fcfcf7"
        />
      )}
      <circle cx="35" cy="35" r="3.5" fill="#8a5a2b" opacity="0.08" />
      <circle cx="65" cy="45" r="5" fill="#8a5a2b" opacity="0.08" />
      <circle cx="48" cy="65" r="4" fill="#8a5a2b" opacity="0.06" />
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#c9933a" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function JournalLeftPageInfo({
  timeDetails,
  formattedDate,
  cycles,
  todayHindu,
  entries
}) {
  return (
    <div className="flex-1 p-6 md:p-8 bg-[#f6efe2] dark:bg-[#1a1510] border-r border-[#c9a84c20] shadow-[inset_-8px_0_16px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[460px]">
      
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-[#8a5a2b] dark:text-gold-lt">
          <span className="text-sm">{timeDetails.icon}</span>
          <h3 className="font-display text-lg tracking-wide uppercase font-semibold">
            {timeDetails.label} Reflection
          </h3>
        </div>
        
        <p className="text-xs text-[#5c3b17]/60 dark:text-ivory/50 mt-1 font-light font-mono">
          {formattedDate}
        </p>
        
        <span className="inline-block mt-3 text-[10px] bg-gold/15 dark:bg-gold/10 text-[#8a5a2b] dark:text-gold-lt font-sans font-bold px-3 py-1 rounded-full border border-gold/20">
          ✨ {cycles || 0} nights of reflection
        </span>
      </div>

      {/* Today's Energy Card */}
      <div className="my-6 p-4 rounded-xl border border-gold/25 bg-white/50 dark:bg-black/30 text-center shadow-inner relative">
        <p className="text-[9px] uppercase tracking-widest text-[#8a5a2b] dark:text-gold-lt font-bold mb-1">
          Tonight's Energy
        </p>
        
        <MoonIllustration phasePercent={todayHindu.phasePercent} />

        <h4 className="font-display text-xs font-bold text-ink dark:text-ivory">
          {todayHindu.paksha.split(' ')[0]} Phase ({todayHindu.moonSymbol})
        </h4>
        
        <div className="w-12 h-[1px] bg-gold/30 mx-auto my-2" />
        
        <p className="text-[10px] text-[#5c3b17]/70 dark:text-ivory/60 italic">
          {timeDetails.weather}
        </p>
      </div>

      {/* Wisdom Quote at bottom */}
      <div className="border-t border-[#c9a84c20] pt-4 text-center">
        <p className="text-xs text-[#5c3b17]/80 dark:text-ivory/70 italic leading-relaxed font-light">
          "{entries.length > 0 ? "Stillness does not mean absence of movement, but harmony in it." : "The quiet hours cradle your innermost truths."}"
        </p>
        <span className="text-[9px] uppercase tracking-wider text-gold font-bold mt-1.5 block">
          — Sri Sri
        </span>
      </div>

    </div>
  )
}
export default JournalLeftPageInfo
