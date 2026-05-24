import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Play, Square, Volume2, VolumeX } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function BreathingPortal() {
  const { dark } = useTheme()
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
            // Move to next step
            setCycleStep((currentStep) => {
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
  }, [isActive, cycleStep])

  const toggleBreathing = () => {
    setIsActive(!isActive)
  }

  const current = steps[cycleStep]

  return (
    <div
      className="fs-gold-corner-card overflow-hidden mb-8"
      style={{
        background: dark
          ? 'linear-gradient(135deg, rgba(30, 22, 10, 0.95), rgba(42, 30, 16, 0.95))'
          : 'linear-gradient(135deg, rgba(255, 252, 245, 0.98), rgba(248, 240, 220, 0.96))',
        position: 'relative'
      }}
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <span 
          style={{
            fontFamily: "'Noto Serif Devanagari', serif",
            fontSize: '8rem',
            color: dark ? 'rgba(201,168,76,0.03)' : 'rgba(201,168,76,0.04)',
            lineHeight: 1,
            userSelect: 'none'
          }}
        >
          प्राणायाम
        </span>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-2">
        {/* Animated Circle Container */}
        <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
          {/* Breathing Aura Rings */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${current.color}15 0%, transparent 70%)`,
                  border: `1.5px solid ${current.color}35`,
                }}
                animate={{
                  scale: current.scale * 1.15,
                }}
                transition={{
                  duration: steps[cycleStep].duration,
                  ease: 'easeInOut'
                }}
              />
            )}
          </AnimatePresence>

          <div 
            className="fs-breathing-ring-outer"
            style={{ 
              borderColor: isActive ? `${current.color}40` : 'rgba(201, 168, 76, 0.25)' 
            }}
          >
            {/* Animated Inner Breathing Circle */}
            <motion.div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-semibold shadow-lg shadow-gold/10"
              style={{
                background: isActive 
                  ? `radial-gradient(circle, ${current.color}ef 0%, ${current.color}b0 100%)`
                  : 'radial-gradient(circle, #e87722 0%, #c9a84c 100%)',
              }}
              animate={{
                scale: isActive ? current.scale : 1.0,
              }}
              transition={{
                duration: isActive ? steps[cycleStep].duration : 0.8,
                ease: 'easeInOut'
              }}
            >
              <Wind size={20} className={isActive && cycleStep === 0 ? 'animate-[floaty_3s_infinite]' : ''} />
              <span className="text-[10px] tracking-widest font-display mt-1">
                {isActive ? `${timeLeft}s` : 'READY'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Text and Actions */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold dark:text-gold-lt">
              ✦ Pranayama Portal ✦
            </span>
          </div>

          <h3 className="font-display font-medium text-lg text-ink dark:text-ivory leading-tight mb-2">
            {isActive ? (
              <span style={{ color: current.color }} className="font-semibold text-xl">
                {current.label}
              </span>
            ) : (
              'Breath Sanctuary'
            )}
          </h3>

          <p className="font-serif italic text-sm text-ink-soft dark:text-bark-lt leading-relaxed min-h-[38px] max-w-sm mx-auto md:mx-0">
            {isActive ? current.instruction : 'Take a moment to center your energy before starting your rituals.'}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
            <button
              onClick={toggleBreathing}
              className={`px-5 py-2.5 rounded-xl font-display text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                isActive
                  ? 'bg-transparent border border-gold/30 hover:bg-gold/5 text-gold'
                  : 'bg-gradient-to-r from-saffron to-gold hover:from-saffron hover:to-gold-lt text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Square size={11} fill="currentColor" /> Stop Practice
                </>
              ) : (
                <>
                  <Play size={11} fill="currentColor" /> Begin Breaths
                </>
              )}
            </button>

            {isActive && (
              <span className="text-[10px] font-bold text-ink-soft/40 dark:text-ivory/30 uppercase tracking-widest">
                Cycle: Box Rhythm (4s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
