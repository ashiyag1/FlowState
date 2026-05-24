import { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import IssueCard from '../../components/wisdom/IssueCard.jsx'
import IssueDetailModal from '../../components/wisdom/IssueDetailModal.jsx'

export default function LifeIssuesGrid({ issues }) {
  const { dark } = useTheme()
  const scrollRef = useRef(null)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScrollUpdate = () => {
    const el = scrollRef.current
    if (!el) return
    
    // Update arrow visibility
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6)

    // Calculate scroll progress percentage
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 0) {
      setScrollProgress(el.scrollLeft / maxScroll)
    } else {
      setScrollProgress(0)
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    
    el.addEventListener('scroll', handleScrollUpdate)
    handleScrollUpdate()
    
    const ro = new ResizeObserver(handleScrollUpdate)
    ro.observe(el)
    
    return () => {
      el.removeEventListener('scroll', handleScrollUpdate)
      ro.disconnect()
    }
  }, [issues])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' })
  }

  if (!issues.length) return null

  return (
    <section className="relative w-full">
      <div className="mb-3">
        <h2 className="text-base sm:text-lg md:text-xl font-bold font-serif text-sandalwood dark:text-gold" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
          What would you like help with?
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
            {issues.map(issue => (
              <div key={issue.id} className="flex-shrink-0 w-[290px] sm:w-[350px]">
                <IssueCard
                  issue={issue}
                  dark={dark}
                  onClick={() => setSelectedIssue(issue)}
                />
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

      {/* Sleek Golden Progress Tracker Bar */}
      <div className="relative mx-auto mt-2 w-36 h-1 bg-gold/10 dark:bg-gold/5 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-gold to-gold/75 rounded-full transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </section>
  )
}
