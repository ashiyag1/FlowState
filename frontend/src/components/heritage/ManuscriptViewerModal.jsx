import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bookmark, Sparkles, BookOpen } from 'lucide-react'

function OrnateCorners({ dark }) {
  const color = dark ? "rgba(201, 168, 76, 0.45)" : "rgba(139, 111, 76, 0.45)";
  return (
    <>
      <svg style={{ position: 'absolute', top: '16px', left: '16px', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M0 0h16v2H2v14H0V0z" fill={color} />
        <circle cx="5" cy="5" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', top: '16px', right: '16px', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M16 0H0v2h14v14h2V0z" fill={color} />
        <circle cx="11" cy="5" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', bottom: '16px', left: '16px', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M0 16h16v-2H2V0H0v16z" fill={color} />
        <circle cx="5" cy="11" r="1.5" fill={color} />
      </svg>
      <svg style={{ position: 'absolute', bottom: '16px', right: '16px', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 16 16" fill="none">
        <path d="M16 16H0v-2h14V0h2v16z" fill={color} />
        <circle cx="11" cy="11" r="1.5" fill={color} />
      </svg>
    </>
  )
}

export function ManuscriptViewerModal({
  isOpen,
  onClose,
  title,
  subtitle,
  paragraphs = [],
  accent = '#c9a84c',
  type = 'Heritage',
  dark = true
}) {
  const [textSize, setTextSize] = useState('medium') // small, medium, large
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'small': return 'text-xs md:text-sm'
      case 'large': return 'text-base md:text-lg'
      default: return 'text-sm md:text-base'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border flex flex-col ${
              dark 
                ? 'bg-[#18130e] text-ivory border-gold/20' 
                : 'bg-[#fbf6ee] text-[#2d1f0e] border-[#c9933a]/30'
            }`}
          >
            {/* Ornate corner accents */}
            <OrnateCorners dark={dark} />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2 border-b border-gold/10">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-gold/10 text-gold">
                  <BookOpen size={14} />
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold-lt opacity-70">
                  {type} Manuscript
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Text sizing options */}
                <div className="flex items-center gap-1 bg-black/25 dark:bg-white/5 rounded-lg p-0.5 border border-gold/10 text-[9px] font-mono">
                  <button 
                    onClick={() => setTextSize('small')} 
                    className={`px-1.5 py-0.5 rounded transition-all ${textSize === 'small' ? 'bg-gold text-black font-bold' : 'opacity-65'}`}
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setTextSize('medium')} 
                    className={`px-1.5 py-0.5 rounded transition-all ${textSize === 'medium' ? 'bg-gold text-black font-bold' : 'opacity-65'}`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setTextSize('large')} 
                    className={`px-1.5 py-0.5 rounded transition-all ${textSize === 'large' ? 'bg-gold text-black font-bold' : 'opacity-65'}`}
                  >
                    A+
                  </button>
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-1.5 rounded-full border transition-all ${
                    isBookmarked
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'bg-black/10 dark:bg-white/5 border-gold/10 hover:border-gold/30'
                  }`}
                >
                  <Bookmark size={14} className={isBookmarked ? 'fill-gold' : ''} />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-black/10 dark:bg-white/5 border border-gold/10 hover:border-gold/30 transition-all text-ivory/60 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10 custom-scrollbar">
              <div className="text-center mb-6">
                <span className="inline-block text-[9px] font-mono uppercase tracking-widest text-gold px-2 py-0.5 rounded-full border border-gold/25 bg-gold/5 mb-2">
                  ✦ Sacred heritage ✦
                </span>
                <h1 className="font-display text-xl md:text-2xl font-bold font-serif leading-tight">
                  {title}
                </h1>
                <p className="text-xs font-mono uppercase tracking-wide opacity-60 mt-1.5">
                  {subtitle}
                </p>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
              </div>

              {/* Manuscript Text */}
              <div className={`space-y-4 font-serif leading-relaxed ${getTextSizeClass()}`}>
                {paragraphs.map((p, idx) => (
                  <p 
                    key={idx} 
                    className="first-letter:text-3xl first-letter:font-bold first-letter:text-gold first-letter:float-left first-letter:mr-2 first-letter:font-display"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Footer inside content */}
              <div className="mt-8 pt-6 border-t border-gold/10 flex items-center justify-between text-[10px] opacity-50 font-mono">
                <span>© Wisdom Archive</span>
                <span className="flex items-center gap-1 text-gold"><Sparkles size={10} /> Preserved Knowledge</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ManuscriptViewerModal
