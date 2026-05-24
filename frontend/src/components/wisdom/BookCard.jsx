import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import pageBg from '../../assets/page.webp'

export default function BookCard({ book, onClick }) {
  const { dark } = useTheme()

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative w-[170px] h-[255px] rounded-xl overflow-hidden cursor-pointer flex-shrink-0 shadow-lg hover:shadow-2xl border"
      style={{
        borderColor: dark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(139, 111, 76, 0.22)'
      }}
    >
      {/* Book Spine (left boundary effect to mimic real book cover) */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-black/20 dark:bg-black/35 rounded-l-xl z-20 shadow-[1px_0_3px_rgba(0,0,0,0.15)]" />
      <div className="absolute left-[6px] top-0 bottom-0 w-[1px] bg-white/10 dark:bg-white/[0.04] z-20" />

      {/* Linen/Paper Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none mix-blend-multiply z-10"
        style={{
          backgroundImage: `url(${pageBg})`,
          backgroundSize: 'cover',
        }}
      />

      {/* Book Cover Image or Fallback */}
      {book.image ? (
        <img src={book.image} alt={book.title} className="absolute inset-0 w-full h-full object-cover z-0" />
      ) : (
        <div 
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{ background: book.bg || '#7A5230' }}
        >
          <span className="text-5xl drop-shadow-md select-none">{book.emoji || '📖'}</span>
        </div>
      )}

      {/* Premium Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-4 pt-16 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
        <span 
          className="text-[9px] font-bold tracking-[0.1em] uppercase text-gold/90 mb-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {book.scripture}
        </span>
        <span 
          className="text-sm font-bold text-white leading-snug"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {book.title}
        </span>
      </div>
    </motion.div>
  )
}