import { useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function TopicFilterBar({ topics, active, onChange }) {
  const { dark } = useTheme()
  const scrollRef = useRef(null)

  return (
    <div className="my-6 flex-shrink-0">
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {topics.map((t) => {
          const isActive = active === t
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 transform active:scale-95 border cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-gold to-gold/80 text-white dark:text-ink border-gold shadow-[0_4px_12px_rgba(201,147,58,0.25)] scale-105' 
                  : 'bg-white/40 dark:bg-white/[0.02] border-gold/15 dark:border-gold/10 hover:border-gold/45 text-ink/70 dark:text-ivory/70 hover:text-ink dark:hover:text-ivory hover:-translate-y-[1px]'
                }
              `}
            >
              {t}
            </button>
          )
        })}
      </div>
    </div>
  )
}