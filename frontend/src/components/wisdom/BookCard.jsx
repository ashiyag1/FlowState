import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

export default function BookCard({ book, onClick }) {
  const { dark } = useTheme()
  const readingMinutes = book.pages ? Math.ceil(book.pages.length * 2) : null

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="relative cursor-pointer group"
      style={{ width: '100%', aspectRatio: '3/4', borderRadius: '18px', overflow: 'visible' }}
    >
      {/* Hover glow halo */}
      <div
        className="absolute inset-[-4px] rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,147,58,0.4) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Card shell */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: '18px',
          boxShadow: dark
            ? '0 8px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)'
            : '0 8px 28px rgba(92,61,30,0.18), 0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        {/* Full-bleed image */}
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ opacity: dark ? 0.88 : 0.92 }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${book.bg || '#2D1F0E'}, #0d0906)` }}
          />
        )}

        {/* Always-on dark gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Reading time badge — top right */}
        {readingMinutes && (
          <div
            className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold text-white/90"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span>⏱</span>{readingMinutes}m
          </div>
        )}

        {/* Bottom text */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 pt-10">
          <span
            className="block text-[8px] font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-1"
            style={{ color: 'rgba(201,168,76,0.9)', fontFamily: "'Outfit', sans-serif" }}
          >
            <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
            {book.scripture}
          </span>
          <span
            className="block text-[13px] font-semibold text-white leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {book.title}
          </span>
        </div>

        {/* Thin gold border — more visible on hover */}
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ border: '1px solid rgba(201,168,76,0.4)', borderRadius: '18px' }}
        />
      </div>
    </motion.div>
  )
}