import { useEffect, useState, useRef, useCallback } from 'react'
import { useSoundEffects, AMBIENCE_PRESETS } from '../../context/SoundEffectsContext'

export default function WisdomAmbientSound() {
  const {
    isMuted, startWisdomAmbience, stopWisdomAmbience,
  } = useSoundEffects()
  const [preset, setPreset] = useState('sitarBgm')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopWisdomAmbience()
    }
  }, [stopWisdomAmbience])

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopWisdomAmbience()
      setIsPlaying(false)
    } else if (!isMuted) {
      startWisdomAmbience(preset)
      setIsPlaying(true)
    }
  }, [isPlaying, isMuted, preset, startWisdomAmbience, stopWisdomAmbience])

  const handleSelectPreset = useCallback((k) => {
    setPreset(k)
    setIsPlaying(true)
    startWisdomAmbience(k)
    setIsOpen(false)
  }, [startWisdomAmbience])

  const keys = Object.keys(AMBIENCE_PRESETS)
  const currentPreset = AMBIENCE_PRESETS[preset]

  return (
    <div style={styles.wrapper}>
      <div style={styles.buttonGroup}>
        <button
          onClick={handleTogglePlay}
          title={isPlaying ? 'Stop' : 'Play ' + currentPreset.label}
          aria-label={isPlaying ? 'Stop ambient sound' : 'Play ambient sound'}
          style={styles.btn(isPlaying)}
        >
          <span style={styles.icon}>{isPlaying ? '⏹' : '▶'}</span>
          <span style={styles.presetLabel}>{currentPreset.label}</span>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={styles.arrowBtn(isOpen)}
          title="Change sound"
          aria-label="Change ambient sound"
        >
          <span style={styles.arrow}>▼</span>
        </button>
      </div>

      {isOpen && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>Ambient Sound</div>
          <div style={styles.indicator}>
            <span style={styles.dot(isPlaying)} />
            {isPlaying ? 'Playing' : isMuted ? 'Muted (global)' : 'Ready'}
          </div>
          {keys.map((k) => (
            <button
              key={k}
              onClick={() => handleSelectPreset(k)}
              style={styles.option(preset === k)}
            >
              <span style={styles.optLabel}>{AMBIENCE_PRESETS[k].label}</span>
              <span style={styles.optDesc}>{AMBIENCE_PRESETS[k].description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  buttonGroup: {
    display: 'flex',
    borderRadius: '22px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    border: '1px solid rgba(201,168,76,0.25)',
  },
  btn: (playing) => ({
    border: 'none',
    background: playing
      ? 'rgba(201,168,76,0.15)'
      : 'rgba(30,25,15,0.5)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '0 10px 0 12px',
    height: '44px',
    transition: 'background 0.25s, opacity 0.25s',
    opacity: 0.85,
  }),
  icon: {
    color: '#c9a84c',
    fontSize: '1rem',
    lineHeight: 1,
  },
  presetLabel: {
    color: '#d4c8a0',
    fontSize: '0.7rem',
    fontFamily: '"Lora", serif',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  arrowBtn: (open) => ({
    border: 'none',
    borderLeft: '1px solid rgba(201,168,76,0.15)',
    background: open
      ? 'rgba(201,168,76,0.12)'
      : 'rgba(30,25,15,0.5)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '44px',
    transition: 'background 0.25s',
  }),
  arrow: {
    color: '#c9a84c',
    fontSize: '0.5rem',
    lineHeight: 1,
  },
  panel: {
    background: 'rgba(20,18,12,0.88)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '10px',
    padding: '0.6rem 0',
    minWidth: '190px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  panelHeader: {
    padding: '0 0.75rem 0.4rem',
    fontSize: '0.65rem',
    fontFamily: '"Cinzel", serif',
    color: '#c9a84c',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(201,168,76,0.1)',
    marginBottom: '0.3rem',
  },
  indicator: {
    padding: '0.2rem 0.75rem 0.45rem',
    fontSize: '0.6rem',
    color: 'rgba(180,170,150,0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  dot: (on) => ({
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: on ? '#4ade80' : '#b91c1c',
    display: 'inline-block',
    flexShrink: 0,
  }),
  option: (active) => ({
    display: 'block',
    width: '100%',
    padding: '0.4rem 0.75rem',
    border: 'none',
    background: active ? 'rgba(201,168,76,0.12)' : 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
    transition: 'background 0.15s',
  }),
  optLabel: {
    display: 'block',
    fontSize: '0.72rem',
    fontFamily: '"Lora", serif',
    color: '#d4c8a0',
    fontWeight: 600,
  },
  optDesc: {
    display: 'block',
    fontSize: '0.55rem',
    color: 'rgba(180,170,150,0.6)',
    marginTop: '1px',
  },
}
