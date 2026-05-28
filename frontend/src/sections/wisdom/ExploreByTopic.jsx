import { useTheme } from '../../context/ThemeContext'
import BookCard from '../../components/wisdom/BookCard.jsx'

export default function ExploreByTopic({ books, onBookOpen }) {
  const { dark } = useTheme()

  if (!books.length) return null

  return (
    <section className="relative w-full flex-col flex gap-6 mb-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-gold text-lg">✨</span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold font-serif text-sandalwood dark:text-gold" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
          Sacred Texts & Whispers
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => onBookOpen?.(book)} />
        ))}
      </div>
    </section>
  )
}