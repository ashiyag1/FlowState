import React from 'react'
import { QuoteScroll, WisdomStyles } from '../../sections/WisdomCarousel'

export function WisdomScrollSection({
  secLabelStyle,
  currentSankalpa,
  wisdomRead,
  handleReadWisdom
}) {
  return (
    <section id="wisdom-scroll-section" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={secLabelStyle}>
        <span>Daily Wisdom Scroll</span>
        <div style={{ flex: 1, height: '0.5px', background: 'rgba(200,169,110,0.2)' }} />
      </div>
      <WisdomStyles />
      <div style={{ position: 'relative' }}>
        <QuoteScroll sankalpa={currentSankalpa} />
      </div>
      {!wisdomRead && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button
            onClick={handleReadWisdom}
            style={{
              padding: '6px 16px', borderRadius: '99px',
              background: 'rgba(200,169,110,0.12)', border: '0.5px solid rgba(200,169,110,0.4)',
              color: '#c8a96e', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'sans-serif'
            }}
          >
            Mark wisdom as read
          </button>
        </div>
      )}
    </section>
  )
}

export default WisdomScrollSection
