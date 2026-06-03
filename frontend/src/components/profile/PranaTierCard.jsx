import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { useNotif } from '../../components/system/NotificationPopup'

const PRANA_TIERS = [
  { threshold: 0, title: "Seeker (Arambha)", desc: "A seeker embarking on the paths of awareness.", next: { name: "Practitioner", threshold: 50 } },
  { threshold: 50, title: "Practitioner (Sadhaka)", desc: "A dedicated practitioner cultivating steady focus.", next: { name: "Harmonist", threshold: 100 } },
  { threshold: 100, title: "Harmonist (Yogi/Yogini)", desc: "Living in balance, uniting inner and outer rhythms.", next: { name: "Visionary Sage", threshold: 150 } },
  { threshold: 150, title: "Visionary Sage (Rishi/Rishika)", desc: "Awakened awareness, seeing the light within all things.", next: { name: "Liberated Spirit", threshold: 200 } },
  { threshold: 200, title: "Liberated Spirit (Jivanmukta)", desc: "Resting in pure liberation, the ultimate state of flow.", next: null }
]

function getPranaTier(prana) {
  let activeTier = PRANA_TIERS[0]
  for (const tier of PRANA_TIERS) {
    if (prana >= tier.threshold) {
      activeTier = tier
    }
  }
  return activeTier
}

export function PranaTierCard({ dark, user }) {
  const { playHydrationSound } = useSoundEffects()
  const notif = useNotif()

  const userPranaTier = useMemo(() => getPranaTier(user?.pranaPoints || 0), [user?.pranaPoints])

  return (
    <div
      className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-gold/50 text-xs">✦</span>
        <Award size={15} className="text-gold/60" />
        <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-gold dark:text-gold-lt"
          style={{ fontFamily: "'Cinzel', serif" }}>
          Sadhana Energy &amp; Progress
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Interactive SVG Mandala */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: 140, height: 140 }}>
          {/* Outer Glow */}
          <div
            className="absolute inset-0 rounded-full opacity-30 pointer-events-none transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${(user?.pranaPoints || 0) > 0 ? '#E8622A' : '#C9933A'} 0%, transparent 70%)`,
              filter: 'blur(16px)',
              transform: `scale(${1 + Math.min(user?.pranaPoints || 0, 250) / 500})`,
            }}
          />

          {/* SVG Mandala */}
          <motion.svg
            onClick={() => {
              playHydrationSound()
              notif("✨ You feel the pulse of Prana flow within you...", "info")
            }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: Math.max(10, 60 - Math.min(user?.pranaPoints || 0, 250) * 0.2), // spins faster with more prana!
              ease: "linear"
            }}
            viewBox="0 0 100 100"
            className="w-full h-full cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
            style={{
              filter: `drop-shadow(0 0 12px ${(user?.pranaPoints || 0) > 100 ? '#E8622A66' : '#C9933A44'})`
            }}
          >
            <circle cx="50" cy="50" r="45" stroke="#c9a84c" strokeWidth="0.8" fill="none" opacity="0.3" />
            <circle cx="50" cy="50" r="35" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity="0.4" />
            <circle cx="50" cy="50" r="22" stroke="#E8622A" strokeWidth="0.6" fill="none" opacity="0.6" />
            <circle cx="50" cy="50" r="8" fill="#E8622A" opacity="0.85" />
            <circle cx="50" cy="50" r="3" fill="#fff" />

            {/* Concentric Petals / Rays */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <path d="M50 15 C52 25 48 25 50 35 C52 25 48 25 50 15 Z" fill="#c9a84c" opacity="0.5" />
                  <circle cx="50" cy="22" r="1.2" fill="#E8622A" />
                  <line x1="50" y1="35" x2="50" y2="42" stroke="#E8622A" strokeWidth="0.4" opacity="0.6" />
                </g>
              )
            })}

            {/* Inner Lotus Petals */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 360) / 6 + 15
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <ellipse cx="50" cy="38" rx="2.5" ry="6" fill="#E8622A" opacity="0.8" />
                </g>
              )
            })}
          </motion.svg>
        </div>

        {/* Progress & Tier Details */}
        <div className="flex-1 w-full">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[10px] text-gold/60 uppercase tracking-[0.14em] font-bold font-sans">
              Spiritual Tier
            </span>
            <span className="text-xs font-bold text-gold dark:text-gold-lt" style={{ fontFamily: "'Cinzel', serif" }}>
              Level {Math.floor((user?.xp || 0) / 100) + 1}
            </span>
          </div>

          <h4 className="text-xl font-bold font-display leading-tight mb-1" style={{ color: dark ? '#ffe090' : '#8a5a12' }}>
            {userPranaTier.title}
          </h4>

          <p className="text-[11px] text-ink/60 dark:text-sand-lt/50 italic font-serif leading-relaxed mb-4">
            "{userPranaTier.desc}"
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gold/5 dark:bg-white/[0.02] border border-gold/10 rounded-xl p-2.5 text-center">
              <span className="text-[8px] text-gold/60 uppercase tracking-widest font-bold block mb-1">Total Experience</span>
              <span className="text-lg font-bold" style={{ color: dark ? '#e8d5a8' : '#5c3d1e' }}>✨ {user?.xp || '—'} <span className="text-xs font-normal opacity-60">XP</span></span>
            </div>
            <div className="bg-saffron/5 dark:bg-white/[0.02] border border-saffron/10 rounded-xl p-2.5 text-center">
              <span className="text-[8px] text-saffron/60 uppercase tracking-widest font-bold block mb-1">Prana Points</span>
              <span className="text-lg font-bold" style={{ color: '#E8622A' }}>🪷 {user?.pranaPoints || '—'} <span className="text-xs font-normal opacity-60">Prana</span></span>
            </div>
          </div>

          {userPranaTier.next && (
            <div>
              <div className="flex justify-between items-center text-[9px] text-mist-dark/60 dark:text-sand-lt/40 font-semibold uppercase tracking-wider mb-1">
                <span>Progress to {userPranaTier.next.name}</span>
                <span>{user?.pranaPoints || '—'} / {userPranaTier.next.threshold} Prana</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(201,168,76,0.1)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((user?.pranaPoints || 0) / userPranaTier.next.threshold) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-gold to-[#E8622A] rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default PranaTierCard
