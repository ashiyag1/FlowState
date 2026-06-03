import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Music } from 'lucide-react'

export function SoundSanctuaryPanel({
  soundPanelOpen,
  onToggleSoundPanel,
  activeSound,
  isMuted,
  onToggleSound,
  onToggleMute
}) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {soundPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 p-4 rounded-2xl journal-glass border border-gold/30 flex flex-col gap-2 shadow-2xl text-xs w-48 text-ink dark:text-ivory"
          >
            <div className="flex items-center gap-1.5 border-b border-gold/15 pb-2 mb-1 font-display font-semibold">
              <Music size={12} className="text-gold" /> Sound Sanctuary
            </div>
            {[
              { preset: 'sitarBgm', label: '🪕 Sitar & Drone' },
              { preset: 'flute', label: '🎵 Bansuri Flute' },
              { preset: 'meditation', label: '🔔 Temple Bells' },
            ].map((sound) => {
              const isPlaying = activeSound === sound.preset && !isMuted
              return (
                <button
                  key={sound.preset}
                  onClick={() => onToggleSound(sound.preset)}
                  className={`px-3 py-2 rounded-xl text-left transition-all border text-[11px] ${
                    isPlaying
                      ? 'bg-gold/20 border-gold text-gold-lt font-semibold'
                      : 'bg-white/[0.03] border-transparent hover:bg-white/5'
                  }`}
                >
                  {sound.label} {isPlaying && '✦'}
                </button>
              )
            })}
            <button
              onClick={onToggleMute}
              className="w-full text-center py-1.5 mt-1 border-t border-white/5 text-[10px] text-saffron font-bold uppercase tracking-wider hover:underline"
            >
              {isMuted ? '🔊 Unmute All' : '🔇 Mute All'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSoundPanel}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-saffron to-gold text-white flex items-center justify-center shadow-lg shadow-gold/20 border border-white/30 cursor-pointer active:scale-95"
        title="Sound Sanctuary · ambient music"
        aria-label="Toggle ambient sound panel"
      >
        {activeSound && !isMuted ? (
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] bg-white rounded-full animate-[soundBar_0.8s_infinite]" style={{ height: '60%' }} />
            <span className="w-[2px] bg-white rounded-full animate-[soundBar_1.2s_infinite]" style={{ height: '100%', animationDelay: '0.2s' }} />
            <span className="w-[2px] bg-white rounded-full animate-[soundBar_1.0s_infinite]" style={{ height: '40%', animationDelay: '0.4s' }} />
          </div>
        ) : (
          <Volume2 size={18} />
        )}
      </motion.button>
    </div>
  )
}
export default SoundSanctuaryPanel
