import { useTheme } from '../../context/ThemeContext'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import NotificationsButton from '../../components/system/NotificationsButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const MORPHING_WORDS = [
  { text: 'ज्ञान',   script: 'Sanskrit' },
  { text: 'Gyaan',   script: 'Hindi'    },
  { text: 'Wisdom',  script: 'English'  },
  { text: 'Jnana',   script: 'Vedic'    },
  { text: 'प्रज्ञा', script: 'Sanskrit' },
]

// Fixed pixel width wide enough for the longest word so the layout NEVER shifts
const WORD_WIDTH = '240px'

export default function HeroHeader({ searchQuery, setSearchQuery }) {
  const { dark } = useTheme()
  const { isMuted, toggleMute, startWisdomAmbience } = useSoundEffects()
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx(prev => (prev + 1) % MORPHING_WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const currentWord = MORPHING_WORDS[wordIdx]

  return (
    <div className="relative pb-6 border-b border-gold/15 mb-6">
      {/* Ambient glow — pointer-events off, aria-hidden */}
      <div aria-hidden className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Label row ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-saffron flex items-center gap-2">
            <span className="w-8 h-px bg-saffron/50" />
            Ancient Archives
          </p>
          <span
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider"
            style={{
              background:   dark ? 'rgba(201,147,58,0.08)' : 'rgba(201,147,58,0.06)',
              borderColor:  dark ? 'rgba(201,147,58,0.2)'  : 'rgba(201,147,58,0.18)',
              color:        dark ? '#C9933A' : '#8B5E2F',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            12 scriptures
          </span>
        </div>

        {/* Global Sound & Notification Buttons */}
        <div className="flex md:hidden items-center gap-2 relative z-10">
          {/* Speaker mute control button */}
          <button
            onClick={() => {
              if (isMuted) {
                startWisdomAmbience('sitarBgm')
                toggleMute()
              } else {
                toggleMute()
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isMuted ? 'rgba(185, 28, 28, 0.15)' : 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(200, 169, 110, 0.45)',
              color: isMuted ? '#b91c1c' : '#8b5a12',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            title="Toggle ambient sounds mute"
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
          </button>

          {/* Notifications Button */}
          <NotificationsButton />
        </div>
      </div>

      {/* ── Two-column hero row ────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

        {/* LEFT: Title + search */}
        <div className="flex-1 min-w-0">
          {/*
            The morphing word lives in a block of FIXED height + FIXED width
            so it NEVER causes reflow in surrounding content.
          */}
          <div
            className="mb-3"
            style={{ height: 'clamp(52px, 7vw, 80px)' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord.text}
                initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{   opacity: 0, y: -12, filter: 'blur(8px)' }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-saffron to-gold block leading-none"
                style={{
                  fontFamily: "'Playfair Display', 'Noto Serif Devanagari', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(42px, 7vw, 80px)',
                  fontWeight: 700,
                }}
              >
                {currentWord.text}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Static subtitle — never moves */}
          <p
            className="text-ink dark:text-ivory mb-1 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', 'Lora', serif",
              fontSize: 'clamp(18px, 2.2vw, 26px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            for the Modern Soul
          </p>

          {/* Script label — fixed height so it doesn't shift either */}
          <div style={{ height: '18px' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord.script}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-[9px] uppercase tracking-[0.28em] font-bold"
                style={{ color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(139,94,47,0.4)' }}
              >
                {currentWord.script}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Search bar */}
        <div className="w-full md:w-[360px] shrink-0">
          <label className="sr-only" htmlFor="wisdom-search">Search wisdom</label>
          <div
            className="relative flex items-center backdrop-blur-xl rounded-2xl px-5 py-3.5 border transition-all shadow-lg group"
            style={{
              background:   dark ? 'rgba(21,16,10,0.8)' : 'rgba(255,255,255,0.55)',
              borderColor:  dark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.22)',
              boxShadow: dark
                ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
                : '0 8px 32px rgba(201,168,76,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <span className="text-base mr-3 text-gold/70 shrink-0">✨</span>
            <input
              id="wisdom-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search scriptures, topics, guidance…"
              className="bg-transparent border-none outline-none text-sm text-ink dark:text-ivory w-full placeholder:text-ink/35 dark:placeholder:text-sand-lt/35 font-serif"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 shrink-0 text-xs text-mist-dark/60 hover:text-red-400 bg-black/5 dark:bg-white/8 w-5 h-5 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                ✕
              </button>
            ) : (
              <span className="ml-2 shrink-0 text-[9px] font-bold text-mist-dark/35 dark:text-sand-lt/35 px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded font-mono select-none border border-black/5 dark:border-white/5">
                ⌘K
              </span>
            )}
          </div>
          <p className="text-[9px] mt-2 text-center font-serif italic" style={{ color: dark ? 'rgba(201,147,58,0.35)' : 'rgba(139,94,47,0.35)' }}>
            "Knowledge is learned, but wisdom is remembered."
          </p>
        </div>
      </div>
    </div>
  )
}