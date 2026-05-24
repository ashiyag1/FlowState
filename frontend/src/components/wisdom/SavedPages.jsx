import { useState } from 'react'
import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

const STICKY_ROTATIONS = ['-2deg', '1deg', '-1deg', '2deg', '-1.5deg', '1.5deg']

export default function SavedPages({ onBookOpen }) {
  const { savedPages, removeSavedPage, getPageNotes } = useWisdom()
  const { dark } = useTheme()
  const [showNotes, setShowNotes] = useState({})

  if (!savedPages.length) {
    return (
      <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          Saved Verses
        </h3>
        <p className="text-xs text-mist-dark/60 dark:text-ocean-lt/40 italic text-center py-2">
          Bookmark pages while reading
        </p>
      </div>
    )
  }

  const handleOpen = (item) => {
    const fullBook = TOPIC_BOOKS.find(b => b.id === item.bookId)
    if (fullBook && onBookOpen) {
      onBookOpen(fullBook, item.pageIdx)
    }
  }

  const toggleNotes = (key, e) => {
    e.stopPropagation()
    setShowNotes(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const keyFor = (item) => `${item.bookId}-${item.pageIdx}`

  return (
    <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
        Saved Verses
      </h3>
      <div className="flex flex-col gap-1.5">
        {savedPages.slice(0, 10).map((item) => {
          const key = keyFor(item)
          const notes = getPageNotes(item.bookId, item.pageIdx)
          const isOpen = showNotes[key]
          return (
            <div key={key} className="flex flex-col border-b border-gold/5 last:border-b-0 pb-1.5 last:pb-0">
              <div 
                onClick={() => handleOpen(item)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gold/5 transition-all duration-200 cursor-pointer border border-transparent"
              >
                <div className="text-lg w-8 h-8 rounded-lg bg-gold/10 dark:bg-gold/5 flex items-center justify-center flex-shrink-0 select-none">
                  {item.bookEmoji || '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-ink dark:text-ivory truncate">
                    {item.heading}
                  </h4>
                  <p className="text-[10px] text-mist-dark/60 dark:text-ocean-lt/50 truncate mt-0.5">
                    {item.bookTitle}
                    <span className="text-gold font-bold ml-1">· p.{item.pageIdx + 1}</span>
                  </p>
                </div>
                
                {notes.length > 0 && (
                  <button
                    onClick={(e) => toggleNotes(key, e)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold border cursor-pointer select-none transition-colors
                      ${isOpen 
                        ? 'bg-gold border-gold text-white dark:text-ink' 
                        : 'bg-gold/10 dark:bg-gold/5 border-gold/25 text-gold hover:bg-gold/15'
                      }`}
                    title={isOpen ? 'Hide notes' : `Show ${notes.length} sticky note${notes.length > 1 ? 's' : ''}`}
                  >
                    📝 {notes.length}
                  </button>
                )}
                
                <button
                  onClick={(e) => { e.stopPropagation(); removeSavedPage(item.bookId, item.pageIdx) }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-mist-dark/45 dark:text-ocean-lt/30 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none bg-transparent cursor-pointer"
                  title="Remove bookmark"
                >
                  ✕
                </button>
              </div>

              {isOpen && notes.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-11 pr-2 py-1">
                  {notes.map((n, ni) => (
                    <div
                      key={n.id}
                      className="p-2 rounded shadow-sm border text-[10px] leading-relaxed relative text-ink-soft select-text"
                      style={{
                        background: n.color ? n.color + 'D9' : '#fff9dbD9',
                        borderColor: 'rgba(0,0,0,0.06)',
                        transform: `rotate(${STICKY_ROTATIONS[ni % STICKY_ROTATIONS.length]})`,
                        fontFamily: "'Caveat', 'Lora', cursive, sans-serif",
                        fontWeight: 600
                      }}
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}