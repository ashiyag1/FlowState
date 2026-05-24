import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'
import { TOPIC_BOOKS } from '../../data/wisdomData'

export default function ContinueExploring({ onBookOpen }) {
  const { openedBooks, removeOpenedBook } = useWisdom()
  const { dark } = useTheme()

  if (!openedBooks.length) {
    return (
      <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          Continue Reading
        </h3>
        <p className="text-xs text-mist-dark/60 dark:text-ocean-lt/40 italic text-center py-2">
          Open a book above to begin
        </p>
      </div>
    )
  }

  const handleResume = (item) => {
    const fullBook = TOPIC_BOOKS.find(b => b.id === item.id)
    if (fullBook && onBookOpen) {
      onBookOpen(fullBook, item.lastPage ?? 0)
    }
  }

  return (
    <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-sandalwood dark:text-gold mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
        Continue Reading
      </h3>
      <div className="flex flex-col gap-1">
        {openedBooks.slice(0, 4).map(item => (
          <div 
            key={item.id} 
            onClick={() => handleResume(item)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gold/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-gold/10"
          >
            <div className="text-lg w-8 h-8 rounded-lg bg-gold/10 dark:bg-gold/5 flex items-center justify-center flex-shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-ink dark:text-ivory truncate">
                {item.title}
              </h4>
              <p className="text-[10px] text-mist-dark/60 dark:text-ocean-lt/50 truncate mt-0.5">
                {item.scripture}
                {item.lastPage != null && (
                  <span className="text-gold font-bold ml-1">· p.{item.lastPage + 1}</span>
                )}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeOpenedBook(item.id) }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-mist-dark/45 dark:text-ocean-lt/30 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none bg-transparent cursor-pointer"
              title="Remove from history"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}