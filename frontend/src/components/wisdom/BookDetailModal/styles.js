import pageBg from '../../../assets/page.webp'

const C = '#c9a84c'

export const styles = (dark) => ({
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem',
  },
  modal: {
    background: dark ? '#1a1208' : '#faf3e0',
    borderRadius: '16px', maxWidth: '520px', width: '100%',
    maxHeight: '88vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '10px',
    width: '30px', height: '30px', borderRadius: '50%', border: 'none',
    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    cursor: 'pointer', fontSize: '0.95rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: dark ? '#c9b080' : '#5c3d1e', zIndex: 10,
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '1.25rem 1.5rem 0.3rem', flexShrink: 0,
  },
  headerImg: { width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' },
  title: {
    margin: 0, fontSize: '1.1rem',
    fontFamily: '"Cinzel", serif',
    color: dark ? '#e8d9b5' : '#5c3d1e',
  },
  scripture: {
    margin: '0.1rem 0 0', fontSize: '0.72rem',
    color: dark ? '#c9b080' : '#8b6914',
    fontStyle: 'italic', fontFamily: '"Lora", serif',
  },
  progressWrap: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.3rem 1.5rem', flexShrink: 0,
  },
  progressTrack: {
    flex: 1, height: '3px',
    background: dark ? '#3a2a10' : '#e0d0b0', borderRadius: '2px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: `linear-gradient(90deg, ${C}, #8b6914)`,
    borderRadius: '2px', transition: 'width 0.35s ease',
  },
  progressLabel: {
    fontSize: '0.62rem', color: dark ? '#8a7a60' : '#a09070',
    fontFamily: 'monospace', minWidth: '40px', textAlign: 'right',
  },

  // ── BOOK ──
  bookArea: {
    position: 'relative', flex: 1, minHeight: '320px', margin: '0 1.25rem',
    borderRadius: '4px', overflow: 'hidden', cursor: 'grab',
    touchAction: 'pan-y', userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  page: {
    position: 'absolute', inset: 0,
    borderRadius: '3px', overflow: 'hidden',
    background: dark ? '#2a1e10' : '#fcf6e8',
    boxShadow: dark
      ? '0 1px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(201,168,76,0.06)'
      : '0 1px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(201,168,76,0.08)',
  },
  pageUnder: { zIndex: 5 },
  leftPage: {
    right: '50%',
    borderRight: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
  },
  flipper: {
    zIndex: 10, transformStyle: 'preserve-3d',
    transformOrigin: 'left center',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  },
  pageBg: {
    position: 'absolute', inset: 0,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: 'cover', backgroundPosition: 'center',
    opacity: dark ? 0.1 : 0.15, pointerEvents: 'none',
  },
  pageInner: {
    position: 'relative', padding: '1.25rem 1.25rem 0.75rem',
    display: 'flex', flexDirection: 'column', height: '100%',
    boxSizing: 'border-box',
  },
  face: {
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
  },
  backFace: {
    transform: 'rotateY(180deg)',
    position: 'absolute', inset: 0, padding: '1.25rem 1.25rem 0.75rem',
  },
  pageHead: {
    fontSize: '0.9rem', fontFamily: '"Cinzel", serif',
    color: dark ? '#e8d9b5' : '#5c3d1e',
    margin: '0 0 0.4rem', textAlign: 'center', flexShrink: 0,
    letterSpacing: '0.02em',
  },
  pageText: {
    fontSize: '0.82rem', fontFamily: '"Lora", serif',
    color: dark ? '#d4c9a0' : '#4a3a20',
    lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', flex: 1,
  },
  pageNum: {
    textAlign: 'center', fontSize: '0.58rem',
    color: dark ? '#8a7a60' : '#a09070', marginTop: '0.3rem',
    fontFamily: 'serif', fontStyle: 'italic', flexShrink: 0,
  },
  stickyPanelNotes: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    marginBottom: '0.4rem',
    maxHeight: '120px', overflowY: 'auto',
  },
  stickyPanelNote: {
    display: 'flex', alignItems: 'flex-start', gap: '0.3rem',
    padding: '4px 8px', borderRadius: '3px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    fontSize: '0.65rem', lineHeight: 1.4,
    fontStyle: 'italic',
    fontFamily: '"Caveat", "Segoe Script", cursive',
  },
  stickyPanelNoteText: {
    flex: 1, color: '#2a1e10', wordBreak: 'break-word',
  },
  stickyPanelNoteDel: {
    background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%',
    width: '14px', height: '14px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '0.45rem', color: '#2a1e10',
    padding: 0, flexShrink: 0, lineHeight: 1, opacity: 0.7,
  },
  stickyPanel: (dark) => ({
    margin: '0.3rem 1.25rem 0', padding: '0.5rem 0.6rem',
    background: dark ? 'rgba(40,30,15,0.3)' : 'rgba(255,252,240,0.6)',
    border: dark ? '1px solid rgba(201,168,76,0.08)' : '1px solid rgba(201,168,76,0.1)',
    borderRadius: '10px', flexShrink: 0,
  }),
  stickyPanelInput: (dark) => ({
    background: dark ? '#2a1e10' : '#fff',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    borderRadius: '6px', padding: '0.35rem 0.5rem',
    fontSize: '0.75rem', width: '100%', boxSizing: 'border-box',
    color: dark ? '#c9b080' : '#5c3d1e', outline: 'none',
    fontFamily: '"Caveat", "Segoe Script", cursive',
  }),
  stickyPanelRow: {
    display: 'flex', gap: '4px', alignItems: 'center',
    marginTop: '5px', flexWrap: 'wrap',
  },
  stickyPanelColor: {
    width: '16px', height: '16px', borderRadius: '50%',
    border: '2px solid transparent', cursor: 'pointer', padding: 0,
  },
  stickyPanelBtn: {
    background: '#c9a84c', border: 'none', borderRadius: '6px',
    padding: '0.25rem 0.7rem', fontSize: '0.65rem',
    color: '#fff', cursor: 'pointer', fontWeight: 700,
    marginLeft: 'auto', letterSpacing: '0.03em',
  },
  actionsBar: {
    display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between',
    margin: '0.3rem 1.25rem 0.2rem', padding: '0.35rem 0.6rem',
    background: dark ? 'rgba(40,30,15,0.25)' : 'rgba(255,252,240,0.5)',
    border: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.1)',
    borderRadius: '10px', flexShrink: 0,
  },
  actionsLabel: {
    fontSize: '0.65rem', fontStyle: 'italic',
    color: '#c9a84c', opacity: 0.7,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    marginRight: '0.5rem',
  },
  actionsGroup: {
    display: 'flex', gap: '0.25rem', flexShrink: 0,
  },
  actionBtn: {
    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
    border: 'none', borderRadius: '8px',
    cursor: 'pointer', padding: '6px 7px 4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    lineHeight: 1, transition: 'background 0.15s',
  },

  // ── DEPTH EFFECTS ──
  curlShadow: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
    background: 'linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 45%)',
  },
  dropShadow: {
    position: 'absolute', left: '100%', top: '1%', bottom: '1%', width: '18px',
    background: 'linear-gradient(270deg, rgba(0,0,0,0.15), transparent)',
    zIndex: 4, pointerEvents: 'none',
  },
  spineShadow: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px',
    background: 'linear-gradient(270deg, transparent, rgba(0,0,0,0.1))',
    zIndex: 7, pointerEvents: 'none',
  },
  thicknessStack: {
    position: 'absolute', right: '-1px', top: '2px', bottom: '2px', zIndex: 8,
    pointerEvents: 'none',
  },
  thickLayer: {
    position: 'absolute', top: 0, bottom: 0, width: '2px',
    background: dark ? '#3a2a10' : '#e8ddd0',
    borderRadius: '0 1px 1px 0',
    borderRight: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
  },
  spineLine: {
    position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
    background: dark ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.1)',
    zIndex: 3, pointerEvents: 'none',
  },

  // ── SHARE ──
  shareDropdown: (dark) => ({
    position: 'absolute', bottom: '100%', right: 0, marginBottom: '4px',
    background: dark ? '#2a1e10' : '#fff',
    border: dark ? '1px solid #4a3a20' : '1px solid #d4c5a0',
    borderRadius: '8px', overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 50, minWidth: '120px',
  }),
  shareOption: (dark) => ({
    display: 'block', width: '100%', textAlign: 'left',
    background: 'none', border: 'none',
    padding: '0.4rem 0.7rem', fontSize: '0.7rem',
    color: dark ? '#c9b080' : '#5c3d1e',
    cursor: 'pointer', fontFamily: 'inherit',
    borderBottom: dark ? '1px solid rgba(201,168,76,0.06)' : '1px solid rgba(201,168,76,0.08)',
    transition: 'background 0.15s',
  }),
  shareCard: {
    display: 'none',
    position: 'absolute',
    left: '-9999px',
    width: '400px',
    padding: '2rem',
    background: '#fcf6e8',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    border: '1px solid #d4c5a0',
    fontFamily: '"Lora", "Georgia", serif',
  },
  shareCardInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  shareCardEmoji: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  shareCardHeading: {
    fontSize: '1.1rem',
    fontFamily: '"Cinzel", serif',
    color: '#5c3d1e',
    margin: 0,
  },
  shareCardText: {
    fontSize: '0.9rem',
    color: '#4a3a20',
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: 'pre-line',
  },
  shareCardFooter: {
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  shareCardSource: {
    fontSize: '0.75rem',
    color: '#8b6914',
    fontStyle: 'italic',
  },
  shareCardTag: {
    fontSize: '0.6rem',
    color: '#c9a84c',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },

  // ── TOUCH ──
  touch: {
    position: 'absolute', top: 0, bottom: 0, width: '28%', zIndex: 20,
    cursor: 'pointer',
  },
  touchL: { left: 0 },
  touchR: { right: 0 },

  // ── FOOTER ──
  footer: { padding: '0.4rem 1.5rem 0.8rem', flexShrink: 0 },
  verse: {
    margin: 0, fontSize: '0.7rem',
    color: dark ? '#8a7a60' : '#8b6914',
    fontStyle: 'italic', textAlign: 'center',
    fontFamily: '"Lora", serif', lineHeight: 1.4,
  },
})
