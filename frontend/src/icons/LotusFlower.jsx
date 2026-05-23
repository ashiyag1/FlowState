/* ─────────────────────────────────────────────────────────────
   LotusFlower.jsx
   Hand-crafted SVG of a blooming lotus with layered petals,
   leaf base and golden stamen centre.
   Props:
     size  – rendered height (and proportional width), default 54
     faded – boolean, renders at 25% opacity (for incomplete state)
─────────────────────────────────────────────────────────────── */
export default function LotusFlower({ size = 54, faded = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 54"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lotus flower"
      style={{ opacity: faded ? 0.25 : 1 }}
    >
      <defs>
        <radialGradient id="lf-outer" cx="50%" cy="80%" r="70%">
          <stop offset="0%"   stopColor="#f8c8d8" />
          <stop offset="60%"  stopColor="#e8809e" />
          <stop offset="100%" stopColor="#c04870" />
        </radialGradient>
        <radialGradient id="lf-inner" cx="50%" cy="85%" r="65%">
          <stop offset="0%"   stopColor="#fff0f5" />
          <stop offset="55%"  stopColor="#f4a8c0" />
          <stop offset="100%" stopColor="#d0607a" />
        </radialGradient>
        <radialGradient id="lf-center" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#fff3a0" />
          <stop offset="60%"  stopColor="#f0c040" />
          <stop offset="100%" stopColor="#c08020" />
        </radialGradient>
        <radialGradient id="lf-leaf" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor="#60b870" />
          <stop offset="100%" stopColor="#2a7840" />
        </radialGradient>
      </defs>

      {/* leaves */}
      <path d="M27 44 Q14 42 10 36 Q18 35 27 44Z" fill="url(#lf-leaf)" opacity="0.85" />
      <path d="M27 44 Q40 42 44 36 Q36 35 27 44Z" fill="url(#lf-leaf)" opacity="0.85" />
      <path d="M27 44 Q18 40 11 36" stroke="#48a058" strokeWidth="0.6" fill="none" opacity="0.6" />
      <path d="M27 44 Q36 40 43 36" stroke="#48a058" strokeWidth="0.6" fill="none" opacity="0.6" />

      {/* back petals */}
      <path d="M27 40 Q16 34 15 22 Q21 26 27 40Z" fill="url(#lf-outer)" opacity="0.7" />
      <path d="M27 40 Q38 34 39 22 Q33 26 27 40Z" fill="url(#lf-outer)" opacity="0.7" />
      <path d="M27 40 Q20 30 18 16 Q24 21 27 40Z" fill="url(#lf-outer)" opacity="0.8" />
      <path d="M27 40 Q34 30 36 16 Q30 21 27 40Z" fill="url(#lf-outer)" opacity="0.8" />

      {/* mid petals */}
      <path d="M27 40 Q18 30 19 14 Q23 20 27 40Z" fill="url(#lf-inner)" />
      <path d="M27 40 Q36 30 35 14 Q31 20 27 40Z" fill="url(#lf-inner)" />
      <path d="M27 40 Q14 28 16 12 Q22 18 27 40Z" fill="url(#lf-outer)" opacity="0.9" />
      <path d="M27 40 Q40 28 38 12 Q32 18 27 40Z" fill="url(#lf-outer)" opacity="0.9" />

      {/* front upright petals */}
      <path d="M27 40 Q20 22 22  6 Q26 14 27 40Z" fill="url(#lf-inner)" />
      <path d="M27 40 Q34 22 32  6 Q28 14 27 40Z" fill="url(#lf-inner)" />
      <path d="M27 40 Q24 18 27  4 Q30 18 27 40Z" fill="url(#lf-inner)" />

      {/* petal veins */}
      <path d="M27 40 Q27 24 27 4"  stroke="#c06080" strokeWidth="0.5" fill="none" opacity="0.35" />
      <path d="M27 40 Q23 24 22 6"  stroke="#c06080" strokeWidth="0.4" fill="none" opacity="0.30" />
      <path d="M27 40 Q31 24 32 6"  stroke="#c06080" strokeWidth="0.4" fill="none" opacity="0.30" />

      {/* golden centre */}
      <circle cx="27" cy="34" r="6"  fill="url(#lf-center)" />
      <circle cx="27" cy="34" r="4"  fill="#f8d060" opacity="0.7" />
      <circle cx="25" cy="32" r="0.8" fill="#a06010" />
      <circle cx="29" cy="32" r="0.8" fill="#a06010" />
      <circle cx="27" cy="30.5" r="0.8" fill="#a06010" />
      <circle cx="24.5" cy="34" r="0.6" fill="#c08020" opacity="0.7" />
      <circle cx="29.5" cy="34" r="0.6" fill="#c08020" opacity="0.7" />
    </svg>
  )
}
