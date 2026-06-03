import React from 'react'
import { motion } from 'framer-motion'

export function SoulIdentityCard({
  dark,
  archetype,
  wellnessScore,
  journalCycle,
  totalJournalEntries,
  habitsCompletedToday,
  totalHabits,
  waterPct
}) {
  return (
    <div
      className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-gold/50 text-xs">✦</span>
        <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-gold dark:text-gold-lt"
          style={{ fontFamily: "'Cinzel', serif" }}>
          Soul Identity
        </h3>
      </div>

      {/* Archetype display */}
      <div style={{
        padding: '1.1rem 1.4rem',
        borderRadius: 16,
        background: `linear-gradient(135deg, ${archetype.gradient.replace('linear-gradient(135deg,', '').replace(')', '')}20, transparent)`,
        border: `1px solid ${archetype.color}30`,
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 36, filter: `drop-shadow(0 0 12px ${archetype.glow})` }}
        >
          {archetype.emoji}
        </motion.span>
        <div style={{ flex: 1 }}>
          <p className="text-[9px] text-gold/60 uppercase tracking-[0.16em] font-bold font-sans" style={{ marginBottom: 2 }}>Your Soul Type</p>
          <p className="text-xl font-bold" style={{
            fontFamily: "'Playfair Display', serif",
            background: archetype.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{archetype.id}</p>
          <p className="text-xs italic text-ink/60 dark:text-sand-lt/60" style={{ fontFamily: "'Lora', serif", marginTop: 2 }}>
            {archetype.tagline}
          </p>
          <p className="text-[10px] text-ink/50 dark:text-sand-lt/40 mt-1" style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: 1.5 }}>
            {archetype.desc}
          </p>
        </div>
      </div>

      {/* Wellness Score */}
      <div>
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p className="text-[10px] text-gold/60 uppercase tracking-widest font-bold font-sans m-0">Wellness Score</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.4rem',
            fontWeight: 700,
            background: wellnessScore >= 70 ? 'linear-gradient(90deg, #34d399, #10b981)'
              : wellnessScore >= 40 ? 'linear-gradient(90deg, #c9933a, #e8b96a)'
              : 'linear-gradient(90deg, #94a3b8, #64748b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>{wellnessScore}<span style={{ fontSize: '0.65rem', opacity: 0.5 }}>/100</span></p>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(201,168,76,0.1)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${wellnessScore}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{
              height: '100%', borderRadius: 999,
              background: wellnessScore >= 70 ? 'linear-gradient(90deg, #34d399, #10b981)'
                : wellnessScore >= 40 ? 'linear-gradient(90deg, #c9933a, #e8b96a)'
                : 'linear-gradient(90deg, #94a3b8, #64748b)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: '🌕 Cycle', value: `${journalCycle}d` },
            { label: '📖 Entries', value: totalJournalEntries },
            { label: '🌿 Rituals', value: `${habitsCompletedToday}/${totalHabits}` },
            { label: '💧 Hydration', value: `${Math.round(waterPct * 100)}%` },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: '1 1 60px',
              padding: '6px 10px',
              borderRadius: 10,
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.12)',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', color: 'rgba(201,168,76,0.6)', margin: 0, letterSpacing: '0.06em' }}>{stat.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0', color: dark ? '#f5e6c8' : '#2d1f0e' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default SoulIdentityCard
