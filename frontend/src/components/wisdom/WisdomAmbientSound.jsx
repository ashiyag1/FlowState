import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, ChevronDown, ChevronUp, Music, Volume2 } from 'lucide-react'
import { useSoundEffects, AMBIENCE_PRESETS } from '../../context/SoundEffectsContext'
import { useTheme } from '../../context/ThemeContext'

export default function WisdomAmbientSound() {
  const { isMuted, startWisdomAmbience, stopWisdomAmbience } = useSoundEffects()
  const { dark } = useTheme()
  const [preset, setPreset] = useState('sitarBgm')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopWisdomAmbience()
      setIsPlaying(false)
    } else if (!isMuted) {
      startWisdomAmbience(preset)
      setIsPlaying(true)
    }
  }, [isPlaying, isMuted, preset, startWisdomAmbience, stopWisdomAmbience])

  const handleSelectPreset = useCallback((k) => {
    setPreset(k)
    setIsPlaying(true)
    startWisdomAmbience(k)
    setIsOpen(false)
  }, [startWisdomAmbience])

  const keys = Object.keys(AMBIENCE_PRESETS)
  const currentPreset = AMBIENCE_PRESETS[preset]

  return (
    <div className="wisdom-ambient-sound-container fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2.5">
      {/* Main control pill */}
      <motion.div 
        layout 
        className="flex items-center rounded-full shadow-lg border bg-white/75 dark:bg-white/[0.04] backdrop-blur-xl overflow-hidden border-gold/25"
      >
        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-2 px-4 py-2.5 hover:bg-gold/10 dark:hover:bg-gold/5 transition-colors border-none cursor-pointer select-none"
          title={isPlaying ? 'Stop' : 'Play ' + currentPreset.label}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-0.5 w-4 h-4">
              {/* Audio Wave Animation */}
              {[1, 2, 3].map((bar) => (
                <span 
                  key={bar}
                  className="w-0.5 bg-gold rounded-full"
                  style={{
                    animation: 'soundBar 1.2s ease-in-out infinite',
                    animationDelay: `${bar * 0.2}s`,
                    height: '100%'
                  }}
                />
              ))}
            </div>
          ) : (
            <Play size={13} className="text-gold fill-current" />
          )}
          <span 
            className="text-[10px] sm:text-xs font-bold text-sandalwood dark:text-gold"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {currentPreset.label}
          </span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-9 h-9 border-l border-gold/15 dark:border-gold/10 hover:bg-gold/10 dark:hover:bg-gold/5 transition-colors border-y-none border-r-none cursor-pointer"
          title="Choose sound"
        >
          {isOpen ? (
            <ChevronUp size={13} className="text-gold" />
          ) : (
            <ChevronDown size={13} className="text-gold" />
          )}
        </button>
      </motion.div>

      {/* Styled audio wave keyframes (added to document head via inline style if needed, or already in global css) */}
      <style>{`
        @keyframes soundBar {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
      `}</style>

      {/* Sound list dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-56 rounded-2xl p-2.5 bg-white/95 dark:bg-[#150f09]/96 backdrop-blur-xl border border-gold/25 shadow-xl flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5 px-2 pb-2 border-b border-gold/10">
              <Music size={11} className="text-gold" />
              <span className="text-[10px] tracking-wider uppercase font-bold text-gold" style={{ fontFamily: "'Cinzel', serif" }}>
                Ambient Sound
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-mist-dark dark:text-sand-lt/70">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{isPlaying ? 'Playing' : isMuted ? 'Muted (global)' : 'Ready'}</span>
            </div>

            <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto scrollbar-thin">
              {keys.map((k) => {
                const isActive = preset === k
                return (
                  <button
                    key={k}
                    onClick={() => handleSelectPreset(k)}
                    className={`w-full text-left p-2 rounded-xl border-none cursor-pointer transition-all flex flex-col gap-0.5
                      ${isActive 
                        ? 'bg-gold/15 dark:bg-gold/10 text-gold' 
                        : 'bg-transparent text-ink/70 dark:text-ivory/70 hover:bg-gold/5 hover:text-ink dark:hover:text-ivory'
                      }`}
                  >
                    <span className="text-xs font-bold font-serif">{AMBIENCE_PRESETS[k].label}</span>
                    <span className="text-[9px] opacity-70 leading-normal">{AMBIENCE_PRESETS[k].description}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
