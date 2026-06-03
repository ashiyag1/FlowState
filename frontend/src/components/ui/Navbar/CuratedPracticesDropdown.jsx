import React from 'react'
import { motion } from 'framer-motion'

export function CuratedPracticesDropdown({ dark, onClose }) {
  const links = [
    { title: 'Yoga for Beginners', desc: 'Stretch out the laptop slouch & recharge your body vibe.', url: 'https://youtu.be/oDP-89wRXUk?si=v5TLzJNX1ty3XymT' },
    { title: 'Deep Yoga Nidra', desc: 'The ultimate brain nap—feel like you slept 4 hours in just 20 mins.', url: 'https://youtu.be/uPSml_JQGVY?si=nhVhj5Ag64X3CHEQ' },
    { title: 'Surya Namaskar', desc: 'The ultimate 5-minute full body cheat-code to boost your dopamine.', url: 'https://youtu.be/AneOlb4dAZU?si=zXqpYa1iZ7MQ0hK-' },
    { title: 'Chakra Meditation', desc: 'De-clutter your subconscious & stop the late-night overthinking loops.', url: 'https://youtu.be/Zdy-NVFpSUI?si=ayma3Ml5RqjFXKE-' },
    { title: 'Kapalbhati Breath', desc: 'Like a double-shot espresso for your focus, minus the caffeine crash.', url: 'https://youtu.be/AtG7cx6p7DY?si=BdKVCedciXeLo4SJ' },
    { title: 'Anulom Vilom', desc: 'The biological chill-pill. Instantly balances nervous system chaos.', url: 'https://youtu.be/blbv5UTBCGg?si=DQt8rU1zp_H5_frA' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
        width: 260, zIndex: 100,
        borderRadius: 16,
        background: dark ? 'rgba(22, 14, 6, 0.92)' : 'rgba(253, 248, 235, 0.95)',
        backdropFilter: 'blur(32px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
        border: '1px solid rgba(212,168,42,0.22)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3), 0 0 40px rgba(212,168,42,0.06)',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(212,168,42,0.5), rgba(232,134,42,0.3), transparent)' }} />
      <div style={{ padding: '14px 16px 8px', borderBottom: '1px solid rgba(212,168,42,0.12)' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: dark ? '#f5e6c8' : '#3d2208' }}>
          Curated Practices
        </div>
        <div style={{ fontSize: '0.65rem', color: dark ? 'rgba(212,168,42,0.55)' : 'rgba(92,61,30,0.5)', marginTop: 2 }}>
          Ashiya's personal YouTube library
        </div>
      </div>
      <div style={{ padding: '6px 8px' }}>
        {links.map((link, idx) => (
          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} onClick={onClose}>
            <motion.div
              whileHover={{ backgroundColor: dark ? 'rgba(212,168,42,0.08)' : 'rgba(212,168,42,0.06)' }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 10px', borderRadius: 10,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#d9b96a' : '#8a5a12'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: dark ? '#e8d5a8' : '#5c3d1e',
                }}>
                  {link.title}
                </span>
                <span style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: 'italic',
                  fontSize: '0.62rem',
                  color: dark ? 'rgba(212,168,42,0.55)' : 'rgba(92,61,30,0.6)',
                  marginTop: 2,
                  lineHeight: 1.25
                }}>
                  {link.desc}
                </span>
              </div>
            </motion.div>
          </a>
        ))}
      </div>
    </motion.div>
  )
}
