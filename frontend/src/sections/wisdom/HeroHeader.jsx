import { useTheme } from '../../context/ThemeContext'

export default function HeroHeader({ searchQuery, setSearchQuery }) {
  const { dark } = useTheme()

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gold/10">
      <div>
        <p className="eyebrow mb-1">Timeless Teachings</p>
        <h1 className="leading-tight text-ink dark:text-ivory"
          style={{
            fontFamily: "'Cormorant Garamond', 'Lora', serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300
          }}
        >
          Wisdom & <em className="not-italic text-gold dark:text-gold/90" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Insights</em>
        </h1>
        <p className="text-xs sm:text-sm text-mist-dark dark:text-sand-lt/70 italic font-serif mt-1">
          Explore scriptures, find counsel for life issues, and track your spiritual growth.
        </p>
      </div>

      <div className="relative flex items-center bg-white/60 dark:bg-white/[0.04] backdrop-blur-lg rounded-2xl px-4 py-3 border border-gold/20 dark:border-gold/15 focus-within:border-gold/50 focus-within:ring-2 focus-within:ring-gold/20 transition-all w-full md:max-w-xs shadow-sm">
        <span className="text-sm mr-2 opacity-60">🔍</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scriptures, issues, topics..."
          className="bg-transparent border-none outline-none text-sm text-ink dark:text-ivory w-full placeholder:text-mist-dark/50 dark:placeholder:text-sand-lt/35 font-medium"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-mist-dark/60 hover:text-red-500 bg-black/5 dark:bg-white/5 w-5 h-5 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer"
            title="Clear search"
          >
            ✕
          </button>
        ) : (
          <span className="text-[9px] font-bold text-mist-dark/40 dark:text-sand-lt/35 px-1.5 py-0.5 bg-black/5 dark:bg-white/5 rounded-md font-mono select-none">
            ⌘K
          </span>
        )}
      </div>
    </div>
  )
}