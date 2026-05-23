/* ─────────────────────────────────────────────────────────────
   DiyaLamp.jsx
   Hand-crafted SVG of a clay diya (oil lamp) with a glowing
   flame, shimmering oil pool, and decorative dots on the body.
   Props:
     size – rendered height (width is proportionally 58/58),
            default 58
─────────────────────────────────────────────────────────────── */
export default function DiyaLamp({ size = 58 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 58 58"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Diya oil lamp"
    >
      <defs>
        <radialGradient id="dl-flameCore" cx="50%" cy="90%" r="60%">
          <stop offset="0%"   stopColor="#fffde0" />
          <stop offset="30%"  stopColor="#ffe060" />
          <stop offset="65%"  stopColor="#ff9020" />
          <stop offset="100%" stopColor="#e04010" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-flameOuter" cx="50%" cy="85%" r="65%">
          <stop offset="0%"   stopColor="#ff8020" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff4000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-body" cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#e8a850" />
          <stop offset="40%"  stopColor="#c07828" />
          <stop offset="100%" stopColor="#804010" />
        </radialGradient>
        <radialGradient id="dl-bodyShine" cx="30%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#ffe8a0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffe8a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-oil" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#d4950a" />
          <stop offset="100%" stopColor="#a06010" />
        </radialGradient>
        <radialGradient id="dl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffd060" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff8020" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <ellipse cx="29" cy="22" rx="14" ry="16" fill="url(#dl-glow)" />

      {/* outer flame */}
      <path
        d="M29 36 Q22 28 24 18 Q26 12 29 8 Q32 12 34 18 Q36 28 29 36Z"
        fill="url(#dl-flameOuter)"
      />

      {/* flame body */}
      <path
        d="M29 35 Q23 27 25 19 Q27 13 29 10 Q31 13 33 19 Q35 27 29 35Z"
        fill="url(#dl-flameCore)"
      />

      {/* inner bright core */}
      <path
        d="M29 32 Q26 26 27 21 Q28 17 29 15 Q30 17 31 21 Q32 26 29 32Z"
        fill="#fff8d0"
        opacity="0.85"
      />

      {/* wick */}
      <rect x="28" y="34" width="2" height="5" rx="1" fill="#5a3010" />

      {/* clay bowl */}
      <path
        d="M12 42 Q12 50 29 52 Q46 50 46 42 Q40 38 29 38 Q18 38 12 42Z"
        fill="url(#dl-body)"
      />
      <path
        d="M12 42 Q12 50 29 52 Q46 50 46 42 Q40 38 29 38 Q18 38 12 42Z"
        fill="url(#dl-bodyShine)"
      />

      {/* spout */}
      <path
        d="M40 39 Q46 37 48 40 Q47 43 44 42 Q42 41 40 39Z"
        fill="#c07828"
      />
      <path
        d="M40 39 Q46 37 48 40 Q47 43 44 42 Q42 41 40 39Z"
        fill="#ffe090"
        opacity="0.2"
      />

      {/* oil pool */}
      <ellipse cx="29" cy="41" rx="12" ry="2.5" fill="url(#dl-oil)"   opacity="0.7" />
      <ellipse cx="26" cy="40.5" rx="4" ry="1"  fill="#f8d060" opacity="0.35" />

      {/* rim highlight */}
      <path d="M14 42 Q29 40 44 42" stroke="#f0b050" strokeWidth="0.8" fill="none" opacity="0.6" />

      {/* base shadow */}
      <ellipse cx="29" cy="52.5" rx="17" ry="2.5" fill="#c07020" opacity="0.2" />

      {/* decorative dots */}
      <circle cx="20" cy="46" r="1.2" fill="#f0c060" opacity="0.5" />
      <circle cx="29" cy="48" r="1.2" fill="#f0c060" opacity="0.5" />
      <circle cx="38" cy="46" r="1.2" fill="#f0c060" opacity="0.5" />
    </svg>
  )
}
