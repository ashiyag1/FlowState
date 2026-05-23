/* ─────────────────────────────────────────────────────────────
   FlameRow.jsx
   Renders `count` small hand-drawn SVG flame icons in a row.
   Used as the bottomSlot in the hydration streak card.

   Props:
     count – number of flames to show (capped at 10 for layout)
─────────────────────────────────────────────────────────────── */
function Flame({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fr-fg" cx="50%" cy="90%" r="65%">
          <stop offset="0%"   stopColor="#ffe060" />
          <stop offset="55%"  stopColor="#ff8020" />
          <stop offset="100%" stopColor="#e04010" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer shape */}
      <path
        d="M7 15 Q3 11 4 6 Q5 3 7 1 Q9 3 10 6 Q11 11 7 15Z"
        fill="url(#fr-fg)"
      />
      {/* bright inner core */}
      <path
        d="M7 14 Q5 10 6 7 Q7 5 7 3 Q7 5 8 7 Q9 10 7 14Z"
        fill="#fff0a0"
        opacity="0.7"
      />
    </svg>
  )
}

export default function FlameRow({ count = 7 }) {
  const capped = Math.min(count, 10)
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
      {Array.from({ length: capped }, (_, i) => (
        <Flame key={i} size={14} />
      ))}
    </div>
  )
}
