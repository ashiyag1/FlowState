import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BookCard from '../../components/wisdom/BookCard.jsx'

export default function ExploreByTopic({ books, onBookOpen }) {
  const scrollRef = useRef(null)
  const { dark } = useTheme()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows)
    updateArrows()
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [books])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  if (!books.length) return null

  return (
    <section className="relative w-full flex-shrink-0">
      <div className="mb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold font-serif text-sandalwood dark:text-gold" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
          Explore by Topic
        </h2>
      </div>

      <div className="relative flex items-center py-2 px-1">
        {canScrollLeft && (
          <button 
            className="absolute left-0 z-20 w-8 h-8 rounded-full border border-gold/35 dark:border-gold/20 bg-white/80 dark:bg-[#1a1208]/90 text-gold flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all hover:bg-gold/10"
            onClick={() => scroll(-1)} 
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          <div 
            ref={scrollRef} 
            className="flex gap-4 overflow-x-auto py-3 px-2 scroll-smooth scrollbar-none touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {books.map((b) => (
              <div key={b.id} className="flex-shrink-0 flex items-end">
                <BookCard book={b} onClick={() => onBookOpen?.(b)} />
              </div>
            ))}
            <div className="w-2 flex-shrink-0" />
          </div>
        </div>

        {canScrollRight && (
          <button 
            className="absolute right-0 z-20 w-8 h-8 rounded-full border border-gold/35 dark:border-gold/20 bg-white/80 dark:bg-[#1a1208]/90 text-gold flex items-center justify-center cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all hover:bg-gold/10"
            onClick={() => scroll(1)} 
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Ornate Wood Bookshelf Shelf design */}
      <div className="relative mx-1.5 mt-1 select-none pointer-events-none">
        <div className="h-[4px] bg-gradient-to-r from-transparent via-[#8a5a2b] via-[#c9933a] via-[#8a5a2b] to-transparent rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
        <div className="h-[6px] bg-gradient-to-b from-[#5c3a1a] to-[#2e1d0d] rounded-b-md opacity-90" />
        <div className="h-[4px] bg-gradient-to-b from-black/15 to-transparent rounded-b-md mx-1" />
      </div>
    </section>
  )
}