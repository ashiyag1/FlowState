import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music, Compass, Sparkles } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import TopBorder from '../components/TopBorder'
import HeroSection from '../sections/HeroSection'
import WisdomCarousel from '../sections/WisdomCarousel'
import DailyFlow from '../sections/DailyFlow'
import IndiaSections from '../sections/IndiaSections'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import homeBg from '../assets/home_bg.webp'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import LotusFlower from '../icons/LotusFlower'

export default function Home() {
  const { startWisdomAmbience, stopWisdomAmbience, isMuted, toggleMute } = useSoundEffects()
  const { dark } = useTheme()
  
  const [activeSound, setActiveSound] = useState(null)
  const [soundPanelOpen, setSoundPanelOpen] = useState(false)

  // Floating particles
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      x: 5 + (i * 7.7) % 90,
      y: 10 + (i * 11.3 + 7) % 80,
      delay: i * 0.4,
      duration: 7 + (i % 5) * 2.5,
      char: i % 4 === 0 ? '✦' : i % 4 === 1 ? '·' : i % 4 === 2 ? '◈' : '✧',
      color: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#e87722' : '#d4607a',
      fontSize: 8 + (i % 3) * 3,
    })), []
  )

  const handleToggleSound = (preset) => {
    if (activeSound === preset) {
      stopWisdomAmbience()
      setActiveSound(null)
    } else {
      startWisdomAmbience(preset)
      setActiveSound(preset)
    }
  }

  // Stop ambient sounds when leaving home
  useEffect(() => {
    return () => {
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  return (
    <>
      <HeroSection />

      <TopBorder />

      <PageLayout>
        <main
          style={{
            position: 'relative',
            paddingTop: '4.5rem',
            background: dark
              ? `
                linear-gradient(180deg, rgba(23,14,6,0.85) 0%, rgba(23,14,6,0.3) 18%, transparent 28%),
                radial-gradient(ellipse at 50% 45%, rgba(22,14,6,0.92) 0%, rgba(22,14,6,0.4) 55%, transparent 75%),
                radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.07) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 35%),
                url(${homeBg}) center top / cover no-repeat
              `
              : `
                linear-gradient(180deg, rgba(253,246,227,0.5) 0%, rgba(253,246,227,0.08) 18%, transparent 28%),
                radial-gradient(ellipse at 50% 45%, rgba(255,248,240,0.5) 0%, rgba(255,248,240,0.08) 55%, transparent 75%),
                radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.06) 0%, transparent 55%),
                radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.05) 0%, transparent 55%),
                radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 35%),
                url(${homeBg}) center top / cover no-repeat
              `,
          }}
        >
          {/* Drifting Sacred Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((s, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ 
                  top: `${s.y}%`, 
                  left: `${s.x}%`, 
                  fontSize: `${s.fontSize}px`, 
                  color: s.color,
                  opacity: 0.25,
                  filter: 'drop-shadow(0 0 4px rgba(253,246,227,0.4))'
                }}
                animate={{ 
                  opacity: [0, 0.65, 0], 
                  y: [0, -45, 0],
                  x: [0, (i % 2 === 0 ? 12 : -12), 0],
                  rotate: [0, 180, 360] 
                }}
                transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
              >
                {s.char}
              </motion.div>
            ))}
          </div>

          {/* Sacred Om watermark — anchors the spiritual atmosphere */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: 0,
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: 'clamp(320px, 55vw, 600px)',
              height: 'clamp(320px, 55vw, 600px)',
              borderRadius: '50%',
              background: dark 
                ? 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            <span style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: 'clamp(14rem, 38vw, 32rem)',
              color: dark ? 'rgba(201, 168, 76, 0.05)' : 'rgba(201, 168, 76, 0.04)',
              lineHeight: 1,
              userSelect: 'none',
              transform: 'translateY(-6%)',
              letterSpacing: '-0.04em',
              fontWeight: 400,
            }}>
              ॐ
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 1100,
              margin: '0 auto',
              padding: '3rem 1.2rem 0',
            }}
          >
            <DailyFlow />
            <WisdomCarousel />
            <IndiaSections />
          </div>

          <ImmersiveFooter />
        </main>
      </PageLayout>

      {/* Floating Sanctuary Soundscape panel */}
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
                    onClick={() => handleToggleSound(sound.preset)}
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
                onClick={toggleMute}
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
          onClick={() => setSoundPanelOpen(!soundPanelOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-saffron to-gold text-white flex items-center justify-center shadow-lg shadow-gold/20 border border-white/30 cursor-pointer active:scale-95"
          title="Ambient Music Controls"
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
    </>
  )
}