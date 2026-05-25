import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { Heart, Share2 } from 'lucide-react'
import ManuscriptCard from './ManuscriptCard'

export default function TodaysWisdom({ wisdom }) {
  const { savedWisdom, toggleSavedWisdom } = useWisdom()
  const { dark } = useTheme()
  const isSaved = savedWisdom.includes('today')

  const handleShare = () => {
    const text = `${wisdom.sanskrit}\n\n${wisdom.english}\n— ${wisdom.source}`
    if (navigator.share) {
      navigator.share({ title: "Daily Wisdom", text })
    } else {
      navigator.clipboard.writeText(text)
      alert("Quote copied to clipboard!")
    }
  }

  return (
    <div className="w-full">
      <ManuscriptCard>
        {/* Left Decorative Lamp (Diya) */}
        <div className="flex-shrink-0 text-xl sm:text-2xl opacity-90 select-none">
          🪔
        </div>

        {/* Central Quote Text */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-1.5 min-w-0 px-2 sm:px-4">
          <p 
            className="text-sm sm:text-base md:text-lg font-bold leading-normal text-ink dark:text-ivory"
            style={{ fontFamily: "'Noto Serif Devanagari', 'Lora', serif" }}
          >
            {wisdom.sanskrit}
          </p>
          <p 
            className="text-xs sm:text-sm italic text-mist-dark dark:text-sand-lt/85 leading-normal"
            style={{ fontFamily: "'Lora', serif" }}
          >
            "{wisdom.english}"
          </p>
          <span 
            className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-saffron/90 dark:text-saffron-lt mt-1"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            — {wisdom.source.toUpperCase()}
          </span>
        </div>

        {/* Right Action Buttons - Vertically stacked round white buttons */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button 
            onClick={() => toggleSavedWisdom('today')}
            className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer
              ${isSaved 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-white/90 dark:bg-ink-soft/80 border-gold/20 dark:border-gold/30 text-gold dark:text-gold-lt hover:bg-gold/10 dark:hover:bg-gold/20 hover:border-gold/45'
              }`}
            title={isSaved ? "Saved to Favorites" : "Add to Favorites"}
          >
            <Heart size={14} className={isSaved ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={handleShare}
            className="w-8 h-8 rounded-full border flex items-center justify-center bg-white/90 dark:bg-ink-soft/80 border-gold/20 dark:border-gold/30 text-gold dark:text-gold-lt shadow-sm hover:scale-105 active:scale-95 transition-all duration-200 hover:bg-gold/10 dark:hover:bg-gold/20 hover:border-gold/45 cursor-pointer"
            title="Share Quote"
          >
            <Share2 size={13} />
          </button>
        </div>
      </ManuscriptCard>
    </div>
  )
}