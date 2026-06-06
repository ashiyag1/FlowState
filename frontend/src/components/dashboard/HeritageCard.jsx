import React from 'react'
import { Link } from 'react-router-dom'

export function HeritageCard({ dark, glassCardStyle }) {
  return (
    <div style={{ ...glassCardStyle, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <span style={{ fontSize: '10px', color: '#c8a96e', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: '0.1em' }}>
        ANCIENT HERITAGE
      </span>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: dark ? '#ffeab8' : '#3d2600', fontWeight: 600, margin: 0 }}>
        Reconnect with Your Roots
      </h4>
      <p style={{ fontSize: '12.5px', color: dark ? 'rgba(245,230,200,0.75)' : '#5c4322', margin: 0, fontFamily: 'sans-serif', lineHeight: 1.5 }}>
        How well do you know the wisdom that shaped our world? Journey beyond modern paths to explore the pioneering science, mathematics, and profound philosophy of ancient India.
      </p>
      <Link
        to="/heritage"
        style={{ fontSize: '11px', color: '#e8622a', fontWeight: 600, textDecoration: 'none', marginTop: 'auto', alignSelf: 'flex-start', fontFamily: 'sans-serif' }}
      >
        Explore archives →
      </Link>
    </div>
  )
}

export default HeritageCard
