import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Sun, Moon, LogIn, LogOut, Volume2, VolumeX, Menu, X, User, Award, Droplet, BookOpen, Compass, Flame, Download } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationsButton from '../system/NotificationsButton'
import { useAchievements } from '../../context/AchievementsContext'
import { useWellness } from '../../context/WellnessContext'
import { useNotif } from '../system/NotificationPopup'

import { BRANDING_LOCKS, BRANDING_OPTIONS } from './Navbar/brandingConfig.js'
import { FlowSymbol } from './Navbar/FlowSymbol.jsx'
import { NavItem, MobileNavItem, BottomTab } from './Navbar/NavItems.jsx'
import { BrandingDropdown } from './Navbar/BrandingDropdown.jsx'
import { CuratedPracticesDropdown } from './Navbar/CuratedPracticesDropdown.jsx'
import { ProfileAvatar, ProfileDropdown } from './Navbar/ProfileDropdown.jsx'
import { MobileDrawer } from './Navbar/MobileDrawer.jsx'

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const NAV = [
  { to: '/',        label: 'Home',      sub: 'Sanctuary' },
  { to: '/habits',  label: 'Daily Flow',    sub: 'Sadhana'   },
  { to: '/journal', label: 'Journal',   sub: 'Chintan'   },
  { to: '/quotes',  label: 'Wisdom',    sub: 'Gyan'      },
]

const GoldStar = ({ size = 5 }) => (
  <span style={{
    fontSize: `${size}px`, color: 'var(--gold)', opacity: 0.4,
    lineHeight: 1, flexShrink: 0,
  }}>✦</span>
)

export const wordmarkStyle = {
  fontFamily:"'Samarkan','Yatra One','Tiro Devanagari Hindi','Cormorant Garamond',serif",
  fontSize:'1.58rem',
  fontWeight:400,
  color:'#c4911e',
  lineHeight:1,
  letterSpacing:'0.04em',
  textShadow:'0 1px 0 rgba(255,240,190,0.35)',
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { isMuted, toggleMute } = useSoundEffects()
  const { user, isAuthenticated, logout } = useAuth()
  const { setGalleryOpen } = useAchievements()
  const { journal } = useWellness()
  const notif = useNotif()
  const navigate = useNavigate()
  const [visible,    setVisible]  = useState(true)
  const [scrolled,   setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const lastY = useRef(0)
  const dropdownRef = useRef(null)
  const resourcesRef = useRef(null)

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const [selectedBranding, setSelectedBranding] = useState(() => {
    return localStorage.getItem('fwa_selected_branding') || 'Tarang-FlowState'
  })
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false)
  const nameDropdownRef = useRef(null)

  useEffect(() => {
    if (!nameDropdownOpen) return
    const handleClick = (e) => {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(e.target)) {
        setNameDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [nameDropdownOpen])

  const currentBranding = useMemo(() => {
    return BRANDING_OPTIONS[selectedBranding] || BRANDING_OPTIONS['Tarang-FlowState']
  }, [selectedBranding])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > lastY.current + 8) setVisible(false)
      if (y < lastY.current - 8 || y < 80) setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive:true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen])

  // Close resources dropdown on outside click
  useEffect(() => {
    if (!resourcesOpen) return
    const handleClick = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [resourcesOpen])

  const glassBg = dark
    ? 'rgba(16, 10, 4, 0.68)'
    : 'rgba(253, 246, 227, 0.6)'

  const glassBorder = dark
    ? 'rgba(212, 168, 42, 0.14)'
    : 'rgba(212, 168, 42, 0.16)'

  const glassShadow = scrolled
    ? '0 12px 48px rgba(0,0,0,0.25), 0 0 80px rgba(212,168,42,0.05), inset 0 1px 0 rgba(255,255,255,0.12)'
    : '0 8px 32px rgba(0,0,0,0.12), 0 0 60px rgba(212,168,42,0.04), inset 0 1px 0 rgba(255,255,255,0.18)'

  const glassShadowDark = scrolled
    ? '0 12px 48px rgba(0,0,0,0.55), 0 0 80px rgba(212,168,42,0.06), inset 0 1px 0 rgba(232,199,122,0.05)'
    : '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(212,168,42,0.04), inset 0 1px 0 rgba(232,199,122,0.04)'

  return (
    <>
      <motion.header
        className="desktop-top-nav"
        animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
        transition={{ duration:0.35, ease:[0.4,0,0.2,1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: '100%',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4%',
          background: glassBg,
          backdropFilter: 'blur(28px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
          borderBottom: `1px solid ${glassBorder}`,
          boxShadow: dark ? glassShadowDark : glassShadow,
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
        }}
      >
        {/* LEFT SECTION — brand and navigation links side-by-side like Netflix */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {/* CENTRE — brand (placed left now) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }} ref={nameDropdownRef}>
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="nb-float" style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(212,168,42,0.35) 0%,transparent 70%)',
                    filter: 'blur(8px)', transform: 'scale(1.4)', opacity: 0.4,
                    pointerEvents: 'none',
                  }} />
                  <FlowSymbol size={28} />
                </div>
                <span style={{
                  ...wordmarkStyle,
                  fontSize: '1.28rem',
                  color: dark ? '#e8c46a' : '#8a5a12',
                  fontFamily: currentBranding.fontFamily,
                  letterSpacing: currentBranding.letterSpacing,
                  fontStyle: currentBranding.fontStyle,
                  fontWeight: currentBranding.fontWeight,
                  textTransform: currentBranding.textTransform || 'none',
                  transition: 'all 0.5s ease',
                }}>{currentBranding.name}</span>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={() => setNameDropdownOpen(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: dark ? 'rgba(232, 196, 106, 0.55)' : 'rgba(138, 90, 18, 0.55)',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '4px 2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
              }}
              title="Explore Sanctuary Names"
            >
              ✦
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {nameDropdownOpen && (
                <BrandingDropdown
                  dark={dark}
                  user={user}
                  selectedBranding={selectedBranding}
                  setSelectedBranding={setSelectedBranding}
                  onClose={() => setNameDropdownOpen(false)}
                  notif={notif}
                />
              )}
            </AnimatePresence>
          </div>

          {/* LEFT — nav (links now next to brand logo) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>

        {/* RIGHT — actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isAuthenticated && user && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: 999,
                border: dark ? '1px solid rgba(212,168,42,0.22)' : '1px solid #e8d5b0',
                background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                boxShadow: '0 1px 6px rgba(160,100,10,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              title={`Level ${Math.floor((user.xp || 0) / 100) + 1} Sadhaka`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '11px' }}>✨</span>
                <span style={{ fontSize: '0.7rem', color: '#c9a84c', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>
                  {user.xp || 0} <span style={{ opacity: 0.7, fontSize: '0.58rem', fontWeight: 600 }}>XP</span>
                </span>
              </div>
              <span style={{ width: 1, height: 12, background: dark ? 'rgba(212,168,42,0.25)' : '#e8d5b0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '11px' }}>🪷</span>
                <span style={{ fontSize: '0.7rem', color: '#E8622A', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>
                  {user.pranaPoints || 0} <span style={{ opacity: 0.7, fontSize: '0.58rem', fontWeight: 600 }}>Pts</span>
                </span>
              </div>
            </motion.button>
          )}

          <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={toggle}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(212,168,42,0.22)',
              background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
              boxShadow: '0 1px 6px rgba(160,100,10,0.04), inset 0 1px 0 rgba(232,199,122,0.08)',
              color: dark ? '#d9b96a' : '#6b4c12',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }} aria-label="Toggle theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={dark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}>
                {dark ? <Sun size={12} /> : <Moon size={12} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <NotificationsButton />

          <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={() => setGalleryOpen(true)}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(212,168,42,0.22)',
              background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
              boxShadow: '0 1px 6px rgba(160,100,10,0.04), inset 0 1px 0 rgba(232,199,122,0.08)',
              color: dark ? '#d9b96a' : '#6b4c12',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }} aria-label="Open achievements">
            <Award size={13} />
          </motion.button>

          <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={toggleMute}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(212,168,42,0.22)',
              background: isMuted
                ? 'rgba(127,29,29,0.1)'
                : dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
              color: isMuted ? '#b91c1c' : dark ? '#d9b96a' : '#6b4c12',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }} aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}>
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </motion.button>

          <div ref={resourcesRef} style={{ position: 'relative' }}>
            <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={() => setResourcesOpen(!resourcesOpen)}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(212,168,42,0.22)',
                background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                boxShadow: '0 1px 6px rgba(160,100,10,0.04), inset 0 1px 0 rgba(232,199,122,0.08)',
                color: dark ? '#d9b96a' : '#6b4c12',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }} aria-label="Curated Practices">
              <BookOpen size={12} />
            </motion.button>

            <AnimatePresence>
              {resourcesOpen && (
                <CuratedPracticesDropdown
                  dark={dark}
                  onClose={() => setResourcesOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <ProfileAvatar user={user} size={30} onClick={() => setProfileOpen(p => !p)} />

              <AnimatePresence>
                {profileOpen && (
                  <ProfileDropdown
                    dark={dark}
                    user={user}
                    onClose={() => setProfileOpen(false)}
                    logout={logout}
                    navigate={navigate}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink to="/login" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 999,
                  fontFamily: "'Cinzel',serif", fontSize: '0.64rem',
                  fontWeight: 600, letterSpacing: '0.08em',
                  color: dark ? '#f5e6c8' : '#5c3d1e',
                  textTransform: 'uppercase',
                  background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(212,168,42,0.22)',
                  boxShadow: '0 1px 4px rgba(160,100,10,0.04)',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}>
                <LogIn size={10} />
                <span>Sign In</span>
              </motion.div>
            </NavLink>
          )}
        </div>
      </motion.header>

      <MobileDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        dark={dark}
        toggle={toggle}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        setGalleryOpen={setGalleryOpen}
        navigate={navigate}
        selectedBranding={selectedBranding}
        setSelectedBranding={setSelectedBranding}
        currentBranding={currentBranding}
        notif={notif}
      />

      <style>{`
        @media (min-width: 768px) {
          .desktop-top-nav {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-top-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
