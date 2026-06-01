import { useTheme } from '../../context/ThemeContext'
import BookCard from '../../components/wisdom/BookCard.jsx'

export default function ExploreByTopic({ books, onBookOpen }) {
  const { dark } = useTheme()
  if (!books.length) return null

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-gold text-base">✨</span>
        <h2
          className="text-sm font-bold uppercase tracking-[0.15em]"
          style={{
            color: dark ? 'rgba(201,168,76,0.85)' : 'rgba(139,94,47,0.85)',
            fontFamily: "'Cinzel', serif",
          }}
        >
          Sacred Texts
        </h2>
        <span
          className="text-[9px] px-2 py-0.5 rounded-full font-bold"
          style={{
            background: dark ? 'rgba(201,147,58,0.1)' : 'rgba(201,147,58,0.08)',
            color: dark ? '#C9933A' : '#8B5E2F',
            border: '1px solid rgba(201,147,58,0.2)',
          }}
        >
          {books.length} scriptures
        </span>
      </div>

      {/*
        Tight grid: 3 columns default, 4 at ≥680px, 5 at ≥900px.
        gap-3 keeps cards close so they feel like a curated shelf.
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px',
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => onBookOpen?.(book)} />
        ))}
      </div>
    </section>
  )
}