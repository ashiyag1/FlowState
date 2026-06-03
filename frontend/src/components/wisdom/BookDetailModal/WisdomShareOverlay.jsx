import React from 'react'

export function WisdomShareOverlay({
  previewImage,
  copied,
  onCopy,
  onClose
}) {
  if (!previewImage) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1.5rem', padding: '1rem',
    }} onClick={onClose}>
      <img src={previewImage} alt="Wisdom Card"
        style={{
          maxWidth: '90vw', maxHeight: '70vh',
          borderRadius: '12px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          cursor: 'pointer',
        }}
        onClick={e => e.stopPropagation()}
      />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onCopy} style={{
          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
          background: copied ? '#27ae60' : '#c9a84c',
          color: copied ? '#ffffff' : '#1a1208',
          fontWeight: 700,
          fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.2s, color 0.2s',
        }}>
          {copied ? 'Copied! ✓' : 'Copy Image'}
        </button>
        <a href={previewImage} download="wisdom-card.png" style={{
          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none',
          background: '#8a6a40', color: '#fcf6e8', fontWeight: 700,
          fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'none', fontFamily: 'inherit',
        }} onClick={() => setTimeout(onClose, 1000)}>
          Download
        </a>
        <button onClick={onClose} style={{
          padding: '0.6rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)',
          background: 'transparent', color: '#fcf6e8', fontWeight: 600,
          fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Close
        </button>
      </div>
    </div>
  )
}
