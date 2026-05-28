import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Play, Square, X, Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAchievements } from '../../context/AchievementsContext'
import chakraImg from '../../assets/dashboard/chakra_pranayama.png'

export default function BreathingPortal() {
  const { dark } = useTheme()
  const { trackEvent } = useAchievements()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [cycleStep, setCycleStep] = useState(0) // 0: inhale, 1: hold, 2: exhale, 3: hold
  const [timeLeft, setTimeLeft] = useState(4)

  const steps = [
    { label: 'Inhale', duration: 4, instruction: 'Fill your lungs with positive energy', scale: 1.45, color: '#e87722' },
    { label: 'Hold', duration: 4, instruction: 'Let the breath expand inside you', scale: 1.45, color: '#c9a84c' },
    { label: 'Exhale', duration: 4, instruction: 'Release all tension and stress', scale: 1.0, color: '#d4607a' },
    { label: 'Hold', duration: 2, instruction: 'Rest in pure stillness', scale: 1.0, color: '#6b8f6b' }
  ]

  useEffect(() => {
    let timer
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCycleStep((currentStep) => {
              if (currentStep === 3) trackEvent('breathing_completed')
              const nextStep = (currentStep + 1) % steps.length
              setTimeLeft(steps[nextStep].duration)
              return nextStep
            })
            return 4 // temp fallback, overridden instantly
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setCycleStep(0)
      setTimeLeft(4)
    }
    return () => clearInterval(timer)
  }, [isActive, cycleStep, trackEvent])

  const toggleBreathing = () => setIsActive(!isActive)
  const closeModal = () => {
    setIsActive(false)
    setIsModalOpen(false)
  }

  const current = steps[cycleStep]

  return (
    <>
      {/* Small Inline Widget */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full fs-gold-corner-card overflow-hidden mb-8 flex items-center justify-between p-4 group"
        style={{
          background: dark
            ? 'linear-gradient(135deg, rgba(30, 22, 10, 0.6), rgba(42, 30, 16, 0.4))'
            : 'linear-gradient(135deg, rgba(255, 252, 245, 0.8), rgba(248, 240, 220, 0.6))',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
            <Wind size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-display font-medium text-base text-ink dark:text-ivory leading-tight">
              Pranayama Portal
            </h3>
            <p className="font-serif italic text-xs text-ink-soft dark:text-bark-lt">
              Enter to sync your breath & chakras.
            </p>
          </div>
        </div>
        <div className="text-gold opacity-50 group-hover:opacity-100 transition-opacity">
          <Play size={20} />
        </div>
      </motion.button>

      {/* Full Screen Glassmorphism Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-[40px] p-8 overflow-hidden shadow-[0_0_80px_rgba(201,168,76,0.15)] flex flex-col items-center border border-gold/20"
              style={{
                background: dark
                  ? 'linear-gradient(135deg, rgba(20, 15, 10, 0.85), rgba(30, 20, 12, 0.8))'
                  : 'linear-gradient(135deg, rgba(255, 252, 240, 0.9), rgba(255, 248, 230, 0.85))',
              }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors z-50 shadow-md"
              >
                <X size={24} className="text-ink dark:text-ivory" />
              </button>

              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                <span 
                  style={{
                    fontFamily: "'Noto Serif Devanagari', serif",
                    fontSize: '12rem',
                    color: dark ? 'rgba(201,168,76,0.02)' : 'rgba(201,168,76,0.03)',
                    lineHeight: 1,
                    userSelect: 'none'
                  }}
                >
                  प्राणायाम
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center w-full mt-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold dark:text-gold-lt mb-2">
                  ✦ Pranayama Sanctuary ✦
                </span>

                <h3 className="font-display font-medium text-3xl text-ink dark:text-ivory leading-tight mb-2 h-10">
                  {isActive ? (
                    <span style={{ color: current.color }} className="font-semibold transition-colors duration-1000">
                      {current.label}
                    </span>
                  ) : (
                    'Align Your Chakras'
                  )}
                </h3>

                <p className="font-serif italic text-base text-ink-soft dark:text-bark-lt leading-relaxed min-h-[48px] max-w-sm mb-8">
                  {isActive ? current.instruction : 'Focus on the glowing light as it travels through your energy centers.'}
                </p>

                {/* Chakra Animation Container */}
                <div className="relative flex items-center justify-center w-72 h-96 sm:w-96 sm:h-[32rem] flex-shrink-0 mb-8">
                  <img src={chakraImg} alt="Meditating Figure with Chakras" className="w-full h-full object-contain opacity-90 drop-shadow-2xl" />
                  
                  {/* Animated Chakra Light */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 rounded-full"
                        style={{
                          width: '40px',
                          height: '40px',
                          color: current.color,
                          background: 'radial-gradient(circle, rgba(255,255,255,1) 10%, rgba(255,255,255,0.4) 40%, transparent 80%)',
                          boxShadow: '0 0 60px 20px currentColor, inset 0 0 20px 5px white',
                          mixBlendMode: 'screen',
                          bottom: '15%'
                        }}
                        animate={{
                          bottom: cycleStep === 0 ? ['15%', '85%'] : cycleStep === 1 ? '85%' : cycleStep === 2 ? ['85%', '15%'] : '15%',
                          scale: isActive ? current.scale : 1.0,
                          opacity: isActive ? 1 : 0,
                          filter: isActive ? ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] : 'brightness(1)'
                        }}
                        transition={{
                          bottom: { duration: steps[cycleStep].duration, ease: 'easeInOut' },
                          scale: { duration: steps[cycleStep].duration, ease: 'easeInOut' },
                          filter: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        }}
                      >
                        <div className="absolute inset-0 rounded-full animate-ping opacity-70" style={{ background: current.color, animationDuration: '2s' }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Timer Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold drop-shadow-xl text-white font-display opacity-80 mix-blend-overlay">
                      {isActive ? `${timeLeft}` : ''}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <button
                  onClick={toggleBreathing}
                  className={`px-8 py-3.5 rounded-full font-display text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl w-64 ${
                    isActive
                      ? 'bg-black/10 border border-gold/30 hover:bg-black/20 text-gold'
                      : 'bg-gradient-to-r from-saffron to-gold hover:from-saffron hover:to-gold-lt text-white shadow-gold/20'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Square size={14} fill="currentColor" /> Pause Flow
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="currentColor" /> Begin Practice
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
