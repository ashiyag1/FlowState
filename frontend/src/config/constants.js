export const AMBIENT_SOUNDS = [
  { preset: 'sitarBgm', label: 'Sitar & Drone', icon: '🪕' },
  { preset: 'flute', label: 'Bansuri Flute', icon: '🎵' },
  { preset: 'meditation', label: 'Temple Bells', icon: '🔔' },
  { preset: 'omSound', label: 'Om Chant', icon: '🕉️' },
  { preset: 'rain', label: 'Forest Rain', icon: '🌧️' }
]

export const DASHBOARD_CONTAINER_STYLE = {
  maxWidth: '860px',
  margin: '0 auto',
  padding: '2.5rem 1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  position: 'relative',
  zIndex: 1,
}

export const SEC_LABEL_STYLE = {
  fontFamily: "'Cinzel', serif",
  fontSize: '11px',
  color: '#c8a96e',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  opacity: 0.95
}

export function getGlassCardStyle(dark) {
  return {
    background: dark ? 'rgba(20, 13, 6, 0.8)' : 'rgba(255, 252, 243, 0.9)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.22)' : '1px solid rgba(200, 169, 110, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(139,105,20,0.07)',
    transition: 'all 0.3s ease',
  }
}
