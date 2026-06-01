import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { CheckCircle2, ChevronRight, X, Share2 } from 'lucide-react'
import RosePetals from './RosePetals'

export default function IssueDetailModal({ issue, onClose }) {
  const { dark } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [showPetals, setShowPetals] = useState(false)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const nextStep = () => {
    if (currentStep < issue.steps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      // Completion!
      setShowPetals(true)
      setTimeout(() => setShowPetals(false), 5500)
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
    }
  }

  const handleShare = () => {
    const tip = issue.tip || issue.steps[issue.steps.length - 1]
    const text = `🌿 ${issue.title}\n\n"${tip}"\n\n— Ancient wisdom from ${issue.approach}\n\nvia Tarang \u2728`
    if (navigator.share) {
      navigator.share({ title: issue.title, text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Wisdom copied to clipboard! Share it 🌸')
    }
  }

  return (
    <div style={styles.overlay} className="backdrop-blur-xl">
      <RosePetals trigger={showPetals} count={30} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={styles.modal(dark, issue.color)}
        onClick={(e) => e.stopPropagation()}
        className="shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Progress Bars (Story style) */}
        <div className="absolute top-0 left-0 right-0 p-4 flex gap-1.5 z-50">
          {issue.steps.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: i < currentStep ? '100%' : '0%' }}
                animate={{ width: i < currentStep ? '100%' : i === currentStep ? '100%' : '0%' }}
                transition={{ duration: i === currentStep ? 0.3 : 0 }}
              />
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button 
          className="absolute top-8 right-4 z-50 p-2 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Header Area */}
        <div className="pt-12 px-6 pb-6 relative z-10 flex flex-col items-center text-center">
          <div className="text-4xl mb-3">{issue.emoji}</div>
          <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/20 text-white mb-2">
            {issue.approach} • {issue.tag}
          </span>
          <h2 className="text-3xl font-serif font-bold text-white leading-tight mb-2">
            {issue.title}
          </h2>
          <p className="text-white/80 text-sm italic font-serif">
            {issue.summary}
          </p>
        </div>

        {/* Swipeable Content Area */}
        <div className="flex-1 relative bg-white dark:bg-[#110C06] rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-sm w-full"
            >
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-6 text-white"
                style={{ background: `linear-gradient(135deg, ${issue.color}, ${issue.color}aa)` }}
              >
                {currentStep + 1}
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-ink dark:text-ivory mb-4 leading-snug">
                {issue.steps[currentStep]}
              </h3>

              {currentStep === issue.steps.length - 1 && issue.tip && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="mt-8 p-4 rounded-2xl bg-gold/5 border border-gold/20 text-left flex gap-3 items-start"
                >
                  <span className="text-xl">💡</span>
                  <p className="text-sm font-serif italic text-mist-dark dark:text-sand-lt/80 leading-relaxed">
                    <strong className="text-gold not-italic block mb-1">Ancient Tip:</strong>
                    {issue.tip}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Navigation Area */}
        <div className="bg-white dark:bg-[#110C06] p-6 pt-0 flex justify-between items-center relative z-10">
          <button 
            onClick={prevStep}
            className={`font-bold tracking-wider uppercase text-xs px-4 py-3 rounded-full transition-opacity ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 text-mist-dark dark:text-sand-lt hover:bg-black/5 dark:hover:bg-white/5'}`}
          >
            Back
          </button>

          <div className="flex items-center gap-2">
            {/* Share button on final step */}
            {currentStep === issue.steps.length - 1 && (
              <motion.button
                onClick={handleShare}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-xs px-4 py-3 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  border: `1.5px solid ${issue.color}60`,
                  color: issue.color,
                  background: `${issue.color}15`,
                }}
              >
                <Share2 size={13} />
                Share
              </motion.button>
            )}

            <button 
              onClick={nextStep}
              className="flex items-center gap-2 font-bold tracking-wider uppercase text-xs px-6 py-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: issue.color }}
            >
              {currentStep === issue.steps.length - 1 ? 'Done 🌸' : 'Next'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>


      </motion.div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: (dark, color) => ({
    width: '100%',
    maxWidth: '420px',
    height: '85vh',
    maxHeight: '800px',
    borderRadius: '32px',
    background: `linear-gradient(160deg, ${color}, ${color}88)`,
    position: 'relative',
  }),
}
