import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

export default function HeroHeader({ searchQuery, setSearchQuery }) {
  const { dark } = useTheme()

  return (
    <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gold/15 mb-8">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-saffron mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-saffron/50"></span>
            Ancient Archives
          </p>
          <h1 className="leading-[1.1] text-ink dark:text-ivory mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', 'Lora', serif",
              fontSize: 'clamp(38px, 6vw, 64px)',
              fontWeight: 400
            }}
          >
            Timeless <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-gold to-saffron" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', paddingRight: '10px' }}>Wisdom</em>
          </h1>
          <p className="text-sm sm:text-base text-mist-dark dark:text-sand-lt/80 font-serif italic max-w-xl leading-relaxed">
            "Knowledge is learned, but wisdom is remembered." Explore sacred scriptures, find gentle counsel for modern struggles, and nurture your soul's growth.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 w-full md:max-w-md"
      >
        <div className="relative flex items-center bg-white/40 dark:bg-[#15100a]/80 backdrop-blur-xl rounded-2xl px-5 py-4 border border-gold/20 dark:border-gold/15 focus-within:border-saffron/50 focus-within:ring-4 focus-within:ring-saffron/10 transition-all w-full shadow-xl shadow-gold/5 group">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <span className="text-lg mr-3 opacity-60 text-gold drop-shadow-md">✨</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Seek wisdom, scriptures, or guidance..."
            className="bg-transparent border-none outline-none text-base text-ink dark:text-ivory w-full placeholder:text-ink/40 dark:placeholder:text-sand-lt/40 font-medium font-serif"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-xs text-mist-dark/60 hover:text-red-400 bg-black/5 dark:bg-white/5 w-6 h-6 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          ) : (
            <span className="ml-2 text-[10px] font-bold text-mist-dark/40 dark:text-sand-lt/40 px-2 py-1 bg-black/5 dark:bg-white/5 rounded-md font-mono select-none border border-black/5 dark:border-white/5">
              ⌘K
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}