import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import pageBg from '../../assets/page.webp'

export default function BookCard({ book, onClick }) {
  const { dark } = useTheme()

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative w-[180px] h-[260px] rounded-[30px] overflow-hidden cursor-pointer flex-shrink-0 shadow-[0_10px_30px_rgba(201,168,76,0.15)] hover:shadow-[0_15px_45px_rgba(201,168,76,0.25)] group"
    >
      {/* Animated mystical border */}
      <div className="absolute inset-0 rounded-[30px] p-[2px] bg-gradient-to-br from-gold/30 via-saffron/20 to-transparent z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-0" />

      {/* Pulsing light source behind image */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,168,76,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

      {/* Ethereal Image or Fallback */}
      <div className="absolute inset-[2px] rounded-[28px] overflow-hidden">
        {book.image ? (
          <img src={book.image} alt={book.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000" />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000"
            style={{ background: `linear-gradient(to bottom, ${book.bg || '#2D1F0E'}, #000000)` }}
          >
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.2)] mb-8">
              <span className="text-4xl drop-shadow-md select-none filter blur-[0.5px] group-hover:blur-0 transition-all">{book.emoji || '✨'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating text area */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5 pt-16 bg-gradient-to-t from-black via-black/80 to-transparent">
        <span 
          className="text-[8px] font-bold tracking-[0.25em] uppercase text-gold/80 mb-1.5 flex items-center gap-1.5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
          {book.scripture}
        </span>
        <span 
          className="text-base font-medium text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {book.title}
        </span>
      </div>
    </motion.div>
  )
}