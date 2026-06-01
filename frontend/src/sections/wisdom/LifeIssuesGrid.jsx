import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import IssueDetailModal from '../../components/wisdom/IssueDetailModal.jsx'
import { motion } from 'framer-motion'

export default function LifeIssuesGrid({ issues }) {
  const { dark } = useTheme()
  const [selectedIssue, setSelectedIssue] = useState(null)

  if (!issues.length) return null

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.2)' }} />
        <span className="text-base">🌿</span>
        <h2
          className="text-sm font-bold uppercase tracking-[0.15em] whitespace-nowrap"
          style={{
            color: dark ? 'rgba(201,168,76,0.85)' : 'rgba(139,94,47,0.85)',
            fontFamily: "'Cinzel', serif",
          }}
        >
          Ancient Help
        </h2>
        <div className="flex-1 h-px" style={{ background: dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.2)' }} />
      </div>

      {/*
        3 columns — tight and premium.
        Each IssueCard is now compact height so 3-across works well.
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        {issues.map((issue, i) => (
          <CompactIssueCard
            key={issue.id}
            issue={issue}
            dark={dark}
            index={i}
            onClick={() => setSelectedIssue(issue)}
          />
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

/* Compact card — replaces the big IssueCard for this grid */
function CompactIssueCard({ issue, dark, index, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        background: dark
          ? `linear-gradient(140deg, ${issue.color}22 0%, rgba(20,14,6,0.9) 100%)`
          : `linear-gradient(140deg, ${issue.color}18 0%, rgba(255,252,244,0.95) 100%)`,
        border: `1px solid ${issue.color}35`,
        padding: '14px',
        minHeight: '140px',
      }}
    >
      {/* Blob glow top-right */}
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-30 group-hover:opacity-55 transition-opacity duration-500 pointer-events-none"
        style={{
          background: issue.color,
          filter: 'blur(20px)',
          transform: 'translate(25%, -25%)',
        }}
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${issue.color}55` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top row: tag + emoji */}
        <div className="flex items-start justify-between mb-2">
          <span
            className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
            style={{
              background: `${issue.color}20`,
              color: issue.color,
              border: `1px solid ${issue.color}35`,
            }}
          >
            {issue.tag}
          </span>
          <span className="text-lg leading-none">{issue.emoji}</span>
        </div>

        {/* Approach */}
        <p
          className="text-[8px] font-bold uppercase tracking-wider mb-1"
          style={{ color: `${issue.color}cc` }}
        >
          {issue.approach}
        </p>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-snug mb-1.5 flex-1"
          style={{
            color: dark ? 'rgba(252,246,232,0.92)' : 'rgba(45,25,8,0.92)',
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {issue.title}
        </h3>

        {/* CTA — appears on hover */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-250"
          style={{ transform: 'translateY(2px)' }}
        >
          <span className="text-[9px] font-bold" style={{ color: issue.color }}>
            Read guide
          </span>
          <span className="text-[9px]" style={{ color: issue.color }}>→</span>
        </div>
      </div>
    </motion.div>
  )
}
