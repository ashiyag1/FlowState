import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Compass, Flame, BookOpen, Sparkles, Award } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function PwaNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dark } = useTheme()

  // Active path checking
  const isActive = (path) => location.pathname === path

  return (
    <div className="pwa-navbar-container md:hidden">
      {/* ── Background Rounded Shape SVG ── */}
      <svg
        className="pwa-navbar-svg-bg"
        viewBox="0 0 400 65"
        preserveAspectRatio="none"
        fill={dark ? 'rgba(18, 12, 5, 0.96)' : 'rgba(253, 246, 227, 0.98)'}
        style={{
          stroke: dark ? 'rgba(201, 168, 76, 0.16)' : 'rgba(200, 169, 110, 0.22)',
          strokeWidth: '0.8px',
        }}
      >
        {/* Flat background with rounded top-left and top-right corners (12px radius) */}
        <path d="
          M 0,12 
          Q 0,0 12,0 
          L 388,0 
          Q 400,0 400,12 
          L 400,65 
          L 0,65 
          Z"
        />
      </svg>

      {/* ── Navigation Tabs ── */}
      <div className="pwa-navbar-items">
        {/* Tab 1: Sanctuary (Home) */}
        <button
          onClick={() => navigate('/')}
          className={`pwa-nav-tab ${isActive('/') ? 'active' : ''}`}
          style={{ color: isActive('/') ? 'var(--gold)' : (dark ? '#a08860' : '#8c765c') }}
        >
          <Compass size={20} />
          <span className="pwa-nav-tab-label">Sanctuary</span>
        </button>

        {/* Tab 2: Rituals (Sadhana) */}
        <button
          onClick={() => navigate('/habits')}
          className={`pwa-nav-tab ${isActive('/habits') ? 'active' : ''}`}
          style={{ color: isActive('/habits') ? 'var(--gold)' : (dark ? '#a08860' : '#8c765c') }}
        >
          <Flame size={20} />
          <span className="pwa-nav-tab-label">Rituals</span>
        </button>

        {/* Tab 3: Chintan (Journal) */}
        <button
          onClick={() => navigate('/journal')}
          className={`pwa-nav-tab ${isActive('/journal') ? 'active' : ''}`}
          style={{ color: isActive('/journal') ? 'var(--gold)' : (dark ? '#a08860' : '#8c765c') }}
        >
          <BookOpen size={20} />
          <span className="pwa-nav-tab-label">Chintan</span>
        </button>

        {/* Tab 4: Gyaan (Wisdom) */}
        <button
          onClick={() => navigate('/quotes')}
          className={`pwa-nav-tab ${isActive('/quotes') ? 'active' : ''}`}
          style={{ color: isActive('/quotes') ? 'var(--gold)' : (dark ? '#a08860' : '#8c765c') }}
        >
          <Sparkles size={20} />
          <span className="pwa-nav-tab-label">Gyaan</span>
        </button>

        {/* Tab 5: Heritage */}
        <button
          onClick={() => navigate('/heritage')}
          className={`pwa-nav-tab ${isActive('/heritage') ? 'active' : ''}`}
          style={{ color: isActive('/heritage') ? 'var(--gold)' : (dark ? '#a08860' : '#8c765c') }}
        >
          <Award size={20} />
          <span className="pwa-nav-tab-label">Heritage</span>
        </button>
      </div>
    </div>
  )
}
