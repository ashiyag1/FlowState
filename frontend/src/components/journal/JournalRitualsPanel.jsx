import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Volume2 } from 'lucide-react'
import LotusFlower from '../../icons/LotusFlower'
import { AMBIENT_SOUNDS } from '../../config/constants'

export function JournalRitualsPanel({
  isBreathing,
  setIsBreathing,
  breathState,
  breathTimer,
  activePreset,
  toggleSound,
  isMuted
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      
      {/* PRANAYAMA BOX BREATHING */}
      <div className="journal-glass p-5 border border-gold/25 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-sm text-ivory flex items-center gap-2 font-semibold">
              <Sparkles size={14} className="text-gold" /> Pranayama Unwind
            </h3>
            <p className="text-[10px] text-ivory/50 font-light">
              A dynamic box breathing practice to slow circadian rhythms.
            </p>
          </div>
          <button
            onClick={() => setIsBreathing(!isBreathing)}
            className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all border ${
              isBreathing
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-gold/15 text-gold-lt border-gold/30 hover:bg-gold/25'
            }`}
          >
            {isBreathing ? 'Stop' : 'Begin'}
          </button>
        </div>

        <div className="h-28 flex items-center justify-center rounded-xl bg-black/20 border border-white/5">
          {isBreathing ? (
            <div className="text-center">
              <motion.div
                key={breathState}
                animate={
                  breathState === 'inhale' ? { scale: [1, 1.3] } :
                  breathState === 'holdIn' ? { scale: 1.3 } :
                  breathState === 'exhale' ? { scale: [1.3, 1] } : { scale: 1 }
                }
                transition={{ duration: breathState.startsWith('hold') ? 0 : 4, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto"
              >
                <LotusFlower size={16} className="text-gold" />
              </motion.div>
              <p className="text-xs font-display text-ivory mt-2 tracking-wider font-semibold">
                {breathState === 'inhale' && 'Inhale (Puraka)'}
                {breathState === 'holdIn' && 'Hold (Antar Kumbhaka)'}
                {breathState === 'exhale' && 'Exhale (Rechaka)'}
                {breathState === 'holdOut' && 'Hold (Bahya Kumbhaka)'}
              </p>
              <p className="text-[9px] text-gold-lt/60 mt-0.5 font-mono">{breathTimer} seconds</p>
            </div>
          ) : (
            <p className="text-xs text-ivory/40 italic px-6 text-center font-light leading-relaxed">
              "Exhaling releases toxins. Holding balances pressure. Inhaling draws raw Prana."
            </p>
          )}
        </div>
      </div>

      {/* SACRED SOUNDS */}
      <div className="journal-glass p-5 border border-gold/25">
        <div className="mb-3">
          <h3 className="font-display text-sm text-ivory flex items-center gap-2 font-semibold">
            <Volume2 size={15} className="text-gold" /> Sacred Ambience
          </h3>
          <p className="text-[10px] text-ivory/50 font-light">
            Listen to comforting acoustic vibrations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {AMBIENT_SOUNDS.map((sound) => {
            const isPlaying = activePreset === sound.preset && !isMuted
            return (
              <button
                key={sound.preset}
                onClick={() => toggleSound(sound.preset)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-[11px] ${
                  isPlaying
                    ? 'bg-gold/20 border-gold text-ivory font-bold'
                    : 'bg-white/[0.03] border-white/5 text-ivory/70 hover:bg-white/5'
                }`}
              >
                <span>{sound.icon}</span>
                <span className="truncate flex-1">{sound.label}</span>
                {isPlaying && (
                  <div className="flex items-end gap-[1px] h-2.5">
                    <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_0.8s_infinite]" style={{ height: '60%' }} />
                    <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_1.2s_infinite]" style={{ height: '100%', animationDelay: '0.2s' }} />
                    <span className="w-[1.5px] bg-gold rounded-full animate-[soundBar_1.0s_infinite]" style={{ height: '40%', animationDelay: '0.4s' }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default JournalRitualsPanel
