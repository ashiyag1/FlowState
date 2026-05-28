import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import IssueCard from '../../components/wisdom/IssueCard.jsx'
import IssueDetailModal from '../../components/wisdom/IssueDetailModal.jsx'

export default function LifeIssuesGrid({ issues }) {
  const { dark } = useTheme()
  const [selectedIssue, setSelectedIssue] = useState(null)

  if (!issues.length) return null

  return (
    <section className="relative w-full mb-12">
      <div className="mb-8 mt-12 flex items-center justify-center gap-3 relative">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <span className="text-gold text-2xl relative z-10 bg-[#1a1208] px-3">🌿</span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-sandalwood dark:text-gold relative z-10 bg-white dark:bg-[#120c04] px-4" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
          What would you like help with?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
        {issues.map(issue => (
          <div key={issue.id} className="w-full transition-transform hover:-translate-y-1">
            <IssueCard
              issue={issue}
              dark={dark}
              onClick={() => setSelectedIssue(issue)}
            />
          </div>
        ))}
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
