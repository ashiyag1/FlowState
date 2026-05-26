import { motion } from 'framer-motion'

export default function WaterProgress({ pct = 0, ml = 0, goal = 2500 }) {
  const fillH = Math.min(100, Math.max(0, pct)) || 0

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Drop SVG */}
      <div className="relative w-36 h-44 mx-auto">
        <svg viewBox="0 0 120 150" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 24px rgba(46,134,171,0.3))' }}>
          <defs>
            <clipPath id="dropClip">
              <path d="M60 8 C60 8 14 62 14 92 C14 120 35 140 60 140 C85 140 106 120 106 92 C106 62 60 8 60 8 Z" />
            </clipPath>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#57B8D6" />
              <stop offset="100%" stopColor="#1A5F7A" />
            </linearGradient>
            <linearGradient id="dropBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6E8EE" />
              <stop offset="100%" stopColor="#A8D4E0" />
            </linearGradient>
          </defs>

          {/* Drop background */}
          <path
            d="M60 8 C60 8 14 62 14 92 C14 120 35 140 60 140 C85 140 106 120 106 92 C106 62 60 8 60 8 Z"
            fill="url(#dropBg)" stroke="rgba(46,134,171,0.3)" strokeWidth="1.5"
            className="dark:opacity-30"
          />

          {/* Water fill */}
          <motion.rect
            x="14" width="92"
            y={140 - (132 * fillH / 100)}
            height={132 * fillH / 100}
            fill="url(#waterGrad)"
            clipPath="url(#dropClip)"
            initial={{ y: 140, height: 0 }}
            animate={{ y: 140 - (132 * fillH / 100), height: 132 * fillH / 100 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Wave effect */}
          {pct > 0 && pct < 100 && (
            <motion.path
              d={`M14 ${140 - (132 * fillH / 100)} Q33 ${140 - (132 * fillH / 100) - 6} 52 ${140 - (132 * fillH / 100)} Q71 ${140 - (132 * fillH / 100) + 6} 92 ${140 - (132 * fillH / 100)} Q106 ${140 - (132 * fillH / 100) - 4} 106 ${140 - (132 * fillH / 100)}`}
              fill="none" stroke="rgba(87,184,214,0.5)" strokeWidth="1.5"
              clipPath="url(#dropClip)"
              animate={{ d: [
                `M14 ${140 - (132 * fillH / 100)} Q33 ${140 - (132 * fillH / 100) - 6} 52 ${140 - (132 * fillH / 100)} Q71 ${140 - (132 * fillH / 100) + 6} 92 ${140 - (132 * fillH / 100)} Q106 ${140 - (132 * fillH / 100) - 4} 106 ${140 - (132 * fillH / 100)}`,
                `M14 ${140 - (132 * fillH / 100)} Q33 ${140 - (132 * fillH / 100) + 5} 52 ${140 - (132 * fillH / 100)} Q71 ${140 - (132 * fillH / 100) - 5} 92 ${140 - (132 * fillH / 100)} Q106 ${140 - (132 * fillH / 100) + 3} 106 ${140 - (132 * fillH / 100)}`
              ]}}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
          )}

          {/* % text */}
          <text x="60" y="98" textAnchor="middle" dominantBaseline="middle"
            fontSize="22" fontWeight="600" fontFamily="Cormorant Garamond, serif"
            fill={fillH > 45 ? 'white' : '#1A5F7A'}>
            {pct}%
          </text>
        </svg>
      </div>

      <div className="text-center">
        <div className="font-display text-3xl font-light text-ink dark:text-sand-lt">
          {ml} <span className="text-base text-mist-dark dark:text-ocean-lt">ml</span>
        </div>
        <div className="text-xs text-mist-dark dark:text-ocean-lt/70 mt-0.5">
          of {goal} ml goal
        </div>
      </div>
    </div>
  )
}

