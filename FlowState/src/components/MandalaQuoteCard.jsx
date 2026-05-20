import { useState, useEffect, useRef } from "react";

const quotes = [
  {
    sk: "YOGA SUTRAS · 1.1",
    mq: ["Discipline today,", "freedom tomorrow."],
    sq: ["Small steps. Daily actions.", "Big transformation."],
  },
  {
    sk: "BHAGAVAD GITA · 2.47",
    mq: ["Act without attachment", "to the fruit."],
    sq: ["Your duty is to act.", "Not to claim the reward."],
  },
  {
    sk: "UPANISHADS",
    mq: ["The soul is", "its own witness."],
    sq: ["Be your own judge.", "Act with pure intention."],
  },
  {
    sk: "RIG VEDA",
    mq: ["Water flows.", "Life grows."],
    sq: ["Nourish the body.", "Nourish the spirit."],
  },
];

const PETALS_16 = Array.from({ length: 16 }, (_, i) => i * 22.5);
const PETALS_8  = Array.from({ length: 8  }, (_, i) => i * 45);

// Mandala + diamond centre
const CX = 150, CY = 240;

const alpha = (hex, opacity) => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

const CARD_THEMES = {
  morning: {
    bg: ["#6e3216", "#331b10", "#120908"],
    accent: "#f3c85f",
    accent2: "#e87722",
    text: "#fff4d8",
    subText: "rgba(255,207,112,0.72)",
    label: "rgba(255,218,126,0.62)",
    veil: ["rgba(58,25,10,0.82)", "rgba(58,25,10,0.48)", "rgba(58,25,10,0)"],
    shadow: "rgba(42,16,6,0.96)",
  },
  afternoon: {
    bg: ["#236176", "#174052", "#081c29"],
    accent: "#f2d38b",
    accent2: "#76d7e7",
    text: "#f7fdff",
    subText: "rgba(190,239,246,0.76)",
    label: "rgba(242,211,139,0.7)",
    veil: ["rgba(10,39,53,0.82)", "rgba(10,39,53,0.48)", "rgba(10,39,53,0)"],
    shadow: "rgba(4,24,34,0.96)",
  },
  evening: {
    bg: ["#6a2147", "#341436", "#120719"],
    accent: "#ffb25e",
    accent2: "#f472b6",
    text: "#fff0e6",
    subText: "rgba(255,190,132,0.76)",
    label: "rgba(255,178,94,0.68)",
    veil: ["rgba(48,13,36,0.84)", "rgba(48,13,36,0.5)", "rgba(48,13,36,0)"],
    shadow: "rgba(31,7,24,0.96)",
  },
  night: {
    bg: ["#18204f", "#0d1238", "#050817"],
    accent: "#d9c27a",
    accent2: "#aeb8ff",
    text: "#f4f0ff",
    subText: "rgba(217,194,122,0.72)",
    label: "rgba(217,194,122,0.62)",
    veil: ["rgba(8,10,34,0.86)", "rgba(8,10,34,0.52)", "rgba(8,10,34,0)"],
    shadow: "rgba(5,7,25,0.96)",
  },
};

export default function QuoteCard({ tod = "morning" }) {
  const [idx, setIdx]     = useState(0);
  const [visible, setVis] = useState(true);
  const [rot, setRot]     = useState(0);
  const rafRef  = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    const tick = (ts) => {
      if (lastRef.current === null) lastRef.current = ts;
      setRot((r) => r + (ts - lastRef.current) * 0.004);
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const cycle = () => {
    setVis(false);
    setTimeout(() => { setIdx((i) => (i + 1) % quotes.length); setVis(true); }, 400);
  };

  const q = quotes[idx];
  const theme = CARD_THEMES[tod] || CARD_THEMES.morning;
  const accent = theme.accent;
  const accent2 = theme.accent2;

  return (
    <div
      onClick={cycle}
      style={{
        position: "relative",
        width: 300,
        height: 480,
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      {/* ── SVG Frame + Mandala ── */}
      <svg width="300" height="480" viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="qcBg" cx="50%" cy="50%" r="52%">
            <stop offset="0%"   stopColor={theme.bg[0]} />
            <stop offset="50%"  stopColor={theme.bg[1]} />
            <stop offset="100%" stopColor={theme.bg[2]} />
          </radialGradient>
          <radialGradient id="qcHalo" cx="50%" cy="50%" r="48%">
            <stop offset="0%"   stopColor={alpha(accent2, 0.2)} />
            <stop offset="70%"  stopColor={alpha(accent, 0.08)} />
            <stop offset="100%" stopColor={alpha(accent, 0)} />
          </radialGradient>
          <radialGradient id="qcVeil" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={theme.veil[0]} />
            <stop offset="75%"  stopColor={theme.veil[1]} />
            <stop offset="100%" stopColor={theme.veil[2]} />
          </radialGradient>
          <radialGradient id="qcBindu" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={alpha("#fff4b8", 0.98)} />
            <stop offset="100%" stopColor={alpha(accent, 0.78)} />
          </radialGradient>
        </defs>

        {/* ── Diamond body — perfect vertical lozenge ──
            top 150,18 | bottom 150,462 | left 18,240 | right 282,240  */}
        <path
          d="M150,18 C195,75 282,155 282,240 C282,325 195,405 150,462 C105,405 18,325 18,240 C18,155 105,75 150,18 Z"
          fill="url(#qcBg)"
        />
        {/* Outer gold border */}
        <path
          d="M150,18 C195,75 282,155 282,240 C282,325 195,405 150,462 C105,405 18,325 18,240 C18,155 105,75 150,18 Z"
          fill="none" stroke={alpha(accent, 0.9)} strokeWidth="1.2"
        />
        {/* Inner border 1 */}
        <path
          d="M150,32 C192,86 268,163 268,240 C268,317 192,394 150,448 C108,394 32,317 32,240 C32,163 108,86 150,32 Z"
          fill="none" stroke={alpha(accent, 0.26)} strokeWidth="0.7"
        />
        {/* Inner border 2 */}
        <path
          d="M150,46 C188,97 254,170 254,240 C254,310 188,383 150,434 C112,383 46,310 46,240 C46,170 112,97 150,46 Z"
          fill="none" stroke={alpha(accent, 0.13)} strokeWidth="0.5"
        />

        {/* Global halo glow */}
        <ellipse cx={CX} cy={CY} rx="130" ry="120" fill="url(#qcHalo)" />

        {/* ── Apex jewels — TOP ── */}
        <circle cx={CX} cy="18" r="9"   fill={theme.bg[2]} stroke={alpha(accent, 0.94)} strokeWidth="1.1" />
        <circle cx={CX} cy="18" r="4.5" fill={theme.bg[2]} stroke={alpha(accent, 0.62)}  strokeWidth="0.7" />
        <circle cx={CX} cy="18" r="2"   fill={alpha(accent, 0.98)} />
        <ellipse cx={CX}   cy="7"  rx="2" ry="4.5" fill={alpha(accent, 0.32)}  stroke={alpha(accent, 0.52)}  strokeWidth="0.5" />
        <ellipse cx="159" cy="10" rx="2" ry="4.5" fill={alpha(accent, 0.26)} stroke={alpha(accent, 0.44)} strokeWidth="0.5" transform="rotate(55,159,10)"  />
        <ellipse cx="141" cy="10" rx="2" ry="4.5" fill={alpha(accent, 0.26)} stroke={alpha(accent, 0.44)} strokeWidth="0.5" transform="rotate(-55,141,10)" />

        {/* ── Apex jewels — BOTTOM (mirror) ── */}
        <circle cx={CX} cy="462" r="9"   fill={theme.bg[2]} stroke={alpha(accent, 0.94)} strokeWidth="1.1" />
        <circle cx={CX} cy="462" r="4.5" fill={theme.bg[2]} stroke={alpha(accent, 0.62)}  strokeWidth="0.7" />
        <circle cx={CX} cy="462" r="2"   fill={alpha(accent, 0.98)} />
        <ellipse cx={CX}   cy="473" rx="2" ry="4.5" fill={alpha(accent, 0.32)}  stroke={alpha(accent, 0.52)}  strokeWidth="0.5" />
        <ellipse cx="159" cy="470" rx="2" ry="4.5" fill={alpha(accent, 0.26)} stroke={alpha(accent, 0.44)} strokeWidth="0.5" transform="rotate(-55,159,470)" />
        <ellipse cx="141" cy="470" rx="2" ry="4.5" fill={alpha(accent, 0.26)} stroke={alpha(accent, 0.44)} strokeWidth="0.5" transform="rotate(55,141,470)"  />

        {/* ── Side jewels — LEFT & RIGHT ── */}
        {[18, 282].map((x) => (
          <g key={x}>
            <circle cx={x} cy={CY} r="9"   fill={theme.bg[2]} stroke={alpha(accent, 0.9)}  strokeWidth="1.1" />
            <circle cx={x} cy={CY} r="4.5" fill={theme.bg[2]} stroke={alpha(accent, 0.56)} strokeWidth="0.7" />
            <circle cx={x} cy={CY} r="2"   fill={alpha(accent, 0.94)} />
          </g>
        ))}

        {/* ── Quarter jewels ── */}
        {[{ x: 69, y: 128 }, { x: 231, y: 128 }, { x: 69, y: 352 }, { x: 231, y: 352 }].map(({ x, y }) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r="5"   fill={theme.bg[2]} stroke={alpha(accent, 0.54)} strokeWidth="0.8" />
            <circle cx={x} cy={y} r="1.8" fill={alpha(accent, 0.66)} />
          </g>
        ))}

        {/* ── Filigree connectors ── */}
        {[
          [150,26,  71,123], [150,26,  229,123],
          [64,132,  23,235], [236,132, 277,235],
          [23,245,  64,347], [277,245, 236,347],
          [71,357,  150,454],[229,357, 150,454],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={alpha(accent, i < 2 || i > 5 ? 0.2 : 0.16)}
            strokeWidth="0.55" strokeDasharray="2 4" />
        ))}

        {/* ── Small top lotus trio ── */}
        <ellipse cx="136" cy="82" rx="4.5" ry="8" fill={alpha(accent, 0.1)} stroke={alpha(accent, 0.3)} strokeWidth="0.5" transform="rotate(-20,136,82)" />
        <ellipse cx="150" cy="76" rx="4.5" ry="9" fill={alpha(accent, 0.12)} stroke={alpha(accent, 0.34)} strokeWidth="0.5" />
        <ellipse cx="164" cy="82" rx="4.5" ry="8" fill={alpha(accent, 0.1)} stroke={alpha(accent, 0.3)} strokeWidth="0.5" transform="rotate(20,164,82)" />

        {/* ── Small bottom lotus trio ── */}
        <ellipse cx="136" cy="398" rx="4.5" ry="8" fill={alpha(accent, 0.1)} stroke={alpha(accent, 0.3)} strokeWidth="0.5" transform="rotate(20,136,398)"  />
        <ellipse cx="150" cy="404" rx="4.5" ry="9" fill={alpha(accent, 0.12)} stroke={alpha(accent, 0.34)} strokeWidth="0.5" />
        <ellipse cx="164" cy="398" rx="4.5" ry="8" fill={alpha(accent, 0.1)} stroke={alpha(accent, 0.3)} strokeWidth="0.5" transform="rotate(-20,164,398)" />

        {/* ══════════════════════════════
            MANDALA — centred at 150,240
            ══════════════════════════════ */}

        {/* Static outer orbit */}
        <circle cx={CX} cy={CY} r="108" fill="none" stroke={alpha(accent, 0.1)} strokeWidth="0.6" />

        {/* Animated rings */}
        <circle cx={CX} cy={CY} r="94"  fill="none" stroke={alpha(accent, 0.19)} strokeWidth="0.5" strokeDasharray="3 7"
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${rot}deg)` }} />
        <circle cx={CX} cy={CY} r="78"  fill="none" stroke={alpha(accent, 0.17)} strokeWidth="0.5" strokeDasharray="2 5"
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${-rot * 0.7}deg)` }} />
        <circle cx={CX} cy={CY} r="112" fill="none" stroke={alpha(accent, 0.09)} strokeWidth="0.5" strokeDasharray="1 5"
          style={{ transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${rot * 1.3}deg)` }} />

        {/* Static structural rings */}
        <circle cx={CX} cy={CY} r="62" fill="none" stroke={alpha(accent, 0.3)} strokeWidth="0.6" />
        <circle cx={CX} cy={CY} r="44" fill="none" stroke={alpha(accent, 0.24)} strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r="26" fill="none" stroke={alpha(accent, 0.32)}  strokeWidth="0.5" />

        {/* 16-petal outer lotus */}
        {PETALS_16.map((deg) => (
          <ellipse key={deg} cx={CX} cy={CY - 44} rx="5" ry="18"
            fill={alpha(accent2, 0.09)} stroke={alpha(accent, 0.24)} strokeWidth="0.5"
            transform={`rotate(${deg},${CX},${CY})`} />
        ))}

        {/* 8-petal inner lotus */}
        {PETALS_8.map((deg) => (
          <ellipse key={deg} cx={CX} cy={CY - 31} rx="4" ry="13"
            fill={alpha(accent2, 0.12)} stroke={alpha(accent, 0.3)} strokeWidth="0.5"
            transform={`rotate(${deg},${CX},${CY})`} />
        ))}

        {/* 8-spoke lines */}
        {PETALS_8.map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={CX + 26 * Math.cos(r)} y1={CY + 26 * Math.sin(r)}
              x2={CX + 62 * Math.cos(r)} y2={CY + 62 * Math.sin(r)}
              stroke={alpha(accent, 0.16)} strokeWidth="0.5" />
          );
        })}

        {/* Sri Yantra triangles */}
        <polygon points={`${CX},${CY-42} ${CX+36},${CY+22} ${CX-36},${CY+22}`}
          fill={alpha(accent2, 0.06)} stroke={alpha(accent, 0.32)} strokeWidth="0.65" />
        <polygon points={`${CX},${CY+42} ${CX+36},${CY-22} ${CX-36},${CY-22}`}
          fill={alpha(accent2, 0.06)} stroke={alpha(accent, 0.32)} strokeWidth="0.65" />

        {/* Text readability veil */}
        <circle cx={CX} cy={CY} r="80" fill="url(#qcVeil)" />

        {/* Bindu */}
        <circle cx={CX} cy={CY} r="5.5" fill="url(#qcBindu)" />
        <circle cx={CX} cy={CY} r="2.2" fill="#fffce8" />

        {/* ── Top rule band ── */}
        <line x1="88" y1="172" x2="212" y2="172" stroke={alpha(accent, 0.28)} strokeWidth="0.5" />
        <polygon points="150,168 153.5,172 150,176 146.5,172" fill={alpha(accent, 0.58)} />
        <circle cx="88"  cy="172" r="2"   fill={alpha(accent, 0.42)} />
        <circle cx="212" cy="172" r="2"   fill={alpha(accent, 0.42)} />
        <circle cx="104" cy="172" r="1.3" fill={alpha(accent, 0.28)} />
        <circle cx="196" cy="172" r="1.3" fill={alpha(accent, 0.28)} />

        {/* ── Bottom rule band ── */}
        <line x1="88" y1="308" x2="212" y2="308" stroke={alpha(accent, 0.28)} strokeWidth="0.5" />
        <polygon points="150,304 153.5,308 150,312 146.5,308" fill={alpha(accent, 0.58)} />
        <circle cx="88"  cy="308" r="2"   fill={alpha(accent, 0.42)} />
        <circle cx="212" cy="308" r="2"   fill={alpha(accent, 0.42)} />
        <circle cx="104" cy="308" r="1.3" fill={alpha(accent, 0.28)} />
        <circle cx="196" cy="308" r="1.3" fill={alpha(accent, 0.28)} />
      </svg>

      {/* ── Text layer — absolutely centred over mandala ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${visible ? 0 : 7}px)`,
          width: 228,
          textAlign: "center",
          pointerEvents: "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Sanskrit label */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9.2,
          letterSpacing: "0.22em",
          color: theme.label,
          marginBottom: 16,
          textTransform: "uppercase",
        }}>
          {q.sk}
        </div>

        {/* Main quote */}
        <div style={{
          fontSize: 20,
          fontWeight: 600,
          color: theme.text,
          lineHeight: 1.34,
          marginBottom: 12,
          letterSpacing: "0.01em",
          textShadow: `0 0 18px ${theme.shadow}, 0 0 6px ${theme.shadow}`,
        }}>
          {q.mq.map((line, i) => (
            <span key={i}>{line}{i < q.mq.length - 1 && <br />}</span>
          ))}
        </div>

        {/* Decorative rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "0 auto 12px", width: 120 }}>
          <div style={{ flex: 1, height: "0.5px", background: alpha(accent, 0.38) }} />
          <div style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: alpha(accent, 0.7), flexShrink: 0 }} />
          <div style={{ flex: 1, height: "0.5px", background: alpha(accent, 0.38) }} />
        </div>

        {/* Sub quote */}
        <div style={{
          fontSize: 13.2,
          fontStyle: "italic",
          color: theme.subText,
          lineHeight: 1.46,
          letterSpacing: "0.05em",
          textShadow: `0 0 12px ${theme.shadow}, 0 0 4px ${theme.shadow}`,
        }}>
          {q.sq.map((line, i) => (
            <span key={i}>{line}{i < q.sq.length - 1 && <br />}</span>
          ))}
        </div>

        {/* Pagination dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
          {quotes.map((_, i) => (
            <div key={i} style={{
              width: 4.5,
              height: 4.5,
              borderRadius: "50%",
              background: i === idx ? alpha(accent, 0.88) : alpha(accent, 0.24),
              transform: i === idx ? "scale(1.3)" : "scale(1)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
