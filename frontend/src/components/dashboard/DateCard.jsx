import { useState } from 'react'
import realCalendarImg from '../../assets/dashboard/real-calendar.webp'
import { useTheme } from '../../context/ThemeContext'
import CalendarModal from './CalendarModal'

export default function DateCard() {
  const { dark } = useTheme()
  const [showCalendar, setShowCalendar] = useState(false)
  const now = new Date()

  const day = now.toLocaleDateString('en-IN', {
    day: 'numeric',
  })

  const month = now.toLocaleDateString('en-IN', {
    month: 'short',
  })

  const weekday = now.toLocaleDateString('en-IN', {
    weekday: 'long',
  })

  return (
    <>
      <CalendarModal open={showCalendar} onClose={() => setShowCalendar(false)} />
      <div
        onClick={() => setShowCalendar(true)}
        className="fs-sandstone-tablet fs-gold-corner-card"
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1.4rem 1.4rem 1.1rem',
          minHeight: '235px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(92,61,30,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <span
          onClick={(e) => { e.stopPropagation(); setShowCalendar(true) }}
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            fontFamily: "'Lora', serif",
            fontSize: '0.78rem',
            color: '#e87722',
            textDecoration: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          View &rarr;
        </span>
      {/* Calendar Icon - Copper base */}
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 28%, #f5edd8 0%, #c9933a 62%, #8a5a2b 100%)',
          border: '1.5px solid #ffe8a0',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          flexShrink: 0,
        }}
        className="fs-date-icon"
      >
        <img
          src={realCalendarImg}
          alt="Calendar"
          style={{ width: '60%', height: '60%', objectFit: 'contain' }}
        />
      </div>

      {/* Date */}
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '2.35rem',
          fontWeight: 600,
          color: dark ? '#f5edd8' : '#5C3D1E',
          lineHeight: 1,
        }}
      >
        {day}{' '}
        <span
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '1.05rem',
            fontWeight: 400,
            color: dark ? '#c9b080' : '#8B5E2F',
          }}
        >
          {month}
        </span>
      </div>

      {/* Weekday */}
      <div
        style={{
          fontFamily: "'Lora', serif",
          fontSize: '0.86rem',
          color: dark ? '#c9b080' : '#8B5E2F',
          marginTop: 4,
        }}
      >
        {weekday}
      </div>

      {/* Sankalp Footer inside card */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: dark ? '1px dashed rgba(201,168,76,0.12)' : '1px dashed rgba(180,140,50,0.2)',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.62rem',
            letterSpacing: '0.08em',
            color: '#e87722',
            fontWeight: 700,
          }}
        >
          TODAY'S SANKALP
        </div>

        <div
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '0.74rem',
            color: dark ? '#c9b080' : '#8B5E2F',
            marginTop: 3,
            fontStyle: 'italic'
          }}
        >
          Choose peace, choose progress.
        </div>
      </div>
      </div>
    </>
  )
}