import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { fetchAIQuote, getDailyQuote, Store, today } from '../utils'

const ERA_COLORS = {
  'dharma':      '#D4A84B',
  'yoga':        '#6B9E78',
  'wisdom':      '#7B8DC8',
  'health':      '#5DCAA5',
  'ayurveda':    '#8FB86A',
  'mindfulness': '#A08BBF',
  'habits':      '#E87722',
  'cosmos':      '#4BBFD4',
  'compassion':  '#E88080',
  'motivation':  '#E87722',
}

export default function QuoteBanner({ className = '' }) {
  const { dark } = useTheme()
  const [quote,    setQuote]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [spinning, setSpinning] = useState(false)

  const load = async (force = false) => {
    setLoading(true)
    try {
      const q = await fetchAIQuote(force)
      setQuote(q)
    } catch {
      setQuote(getDailyQuote())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRefresh = async () => {
    setSpinning(true)
    Store.del('quote_' + today())
    await load(true)
    setSpinning(false)
  }

  const accentColor = quote ? (ERA_COLORS[quote.category] || '#D4A84B') : '#D4A84B'

  return (
    <div
      className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 border transition-transform duration-300 hover:scale-[1.006] ${className}`}
      style={{
        borderColor: dark ? 'rgba(201,168,76,0.15)' : 'rgba(216,187,134,0.4)',
        background: dark
          ? 'radial-gradient(circle at 18% 10%, rgba(180,140,60,0.15), transparent 42%), linear-gradient(145deg, #1a1208 0%, #221a0e 55%, #2a1e10 100%)'
          : 'radial-gradient(circle at 18% 10%, rgba(244,186,83,0.20), transparent 42%), linear-gradient(145deg, #fdf5e8 0%, #f7ebd8 55%, #f2dfc3 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(114,76,35,0.05), rgba(114,76,35,0.05) 1px, transparent 1px, transparent 28px)',
      }} />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.32, 0.5, 0.32] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(201,147,58,0.25), transparent 65%)` }}
      />

      <div
        className="absolute top-2 right-5 text-[7.5rem] leading-none pointer-events-none select-none"
        style={{ color: dark ? 'rgba(200,180,140,0.06)' : 'rgba(131,89,43,0.08)', fontFamily: 'serif', userSelect: 'none' }}
        aria-hidden
      >ॐ</div>

      <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full"
        style={{ background: `linear-gradient(to bottom, ${accentColor}, ${dark ? '#4a3a20' : '#8a5a2b'})` }}
      />

      <button
        onClick={handleRefresh}
        disabled={loading || spinning}
        className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center
                   rounded-full border transition-all duration-300
                   hover:scale-110 disabled:opacity-40"
        style={{
          borderColor: dark ? 'rgba(201,168,76,0.3)' : 'rgba(199,164,106,0.55)',
          background: dark ? 'rgba(40,30,15,0.72)' : 'rgba(251,238,212,0.72)',
          color: dark ? '#c9b080' : '#7b5123',
        }}
        aria-label="Refresh quote"
        title="Get a new quote"
      >
        <RefreshCw size={14} className={spinning || loading ? 'animate-spin' : ''} />
      </button>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="pl-4 py-2 relative z-10">
            <div className="h-4 w-32 rounded-full mb-3 animate-pulse" style={{ background: dark ? 'rgba(200,180,140,0.12)' : 'rgba(132,94,53,0.16)' }} />
            <div className="h-6 w-full rounded-full mb-2 animate-pulse" style={{ background: dark ? 'rgba(200,180,140,0.1)' : 'rgba(132,94,53,0.13)' }} />
            <div className="h-6 w-3/4 rounded-full animate-pulse" style={{ background: dark ? 'rgba(200,180,140,0.08)' : 'rgba(132,94,53,0.10)' }} />
          </motion.div>
        ) : quote ? (
          <motion.div
            key={quote.text?.slice(0, 20)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="pl-5 relative z-10"
          >
            {quote.category && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-4 uppercase tracking-wider"
                style={{
                  background: `${accentColor}20`,
                  color: dark ? '#c9b080' : '#7a4e20',
                  border: `1px solid ${accentColor}55`,
                }}
              >✦ {quote.category}</div>
            )}

            {quote.text && /[\u0900-\u097F]/.test(quote.text) && (
              <p className="text-base sm:text-lg mb-2 leading-relaxed"
                style={{ color: dark ? 'rgba(200,180,140,0.6)' : 'rgba(86,55,22,0.7)', fontFamily: '"Noto Serif Devanagari", serif' }}>
                {quote.text}
              </p>
            )}

            <blockquote
              className="font-display mb-4 leading-relaxed"
              style={{ fontSize: 'clamp(17px, 3vw, 23px)', fontStyle: 'italic', color: dark ? '#e8d9b5' : '#3f2914' }}
            >"{quote.translation || quote.text}"</blockquote>

            <div>
              <div className="text-sm font-bold tracking-widest uppercase"
                style={{ color: dark ? '#c9b080' : '#8a5a2b' }}>
                — {quote.author}
              </div>
              {quote.source && quote.source !== quote.author && (
                <div className="text-xs mt-1"
                  style={{ color: dark ? 'rgba(200,180,140,0.5)' : 'rgba(86,55,22,0.58)' }}>
                  {quote.source}
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
