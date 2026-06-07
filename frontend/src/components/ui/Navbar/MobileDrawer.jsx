import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, LogIn, LogOut, Volume2, VolumeX, X, User, Award } from 'lucide-react'
import { BRANDING_OPTIONS } from './brandingConfig.js'
import { FlowSymbol } from './FlowSymbol.jsx'
import { MobileNavItem } from './NavItems.jsx'
import { BrandingDropdown } from './BrandingDropdown.jsx'
import { ProfileAvatar } from './ProfileDropdown.jsx'
import NotificationsButton from '../../system/NotificationsButton'
import { NAV, wordmarkStyle } from '../Navbar.jsx'

export function MobileDrawer({
  mobileOpen,
  setMobileOpen,
  dark,
  toggle,
  isMuted,
  toggleMute,
  isAuthenticated,
  user,
  logout,
  setGalleryOpen,
  navigate,
  selectedBranding,
  setSelectedBranding,
  currentBranding,
  notif
}) {
  const [mobileNameDropdownOpen, setMobileNameDropdownOpen] = useState(false)
  const mobileNameDropdownRef = useRef(null)

  useEffect(() => {
    if (!mobileNameDropdownOpen) return
    const handleClick = (e) => {
      if (mobileNameDropdownRef.current && !mobileNameDropdownRef.current.contains(e.target)) {
        setMobileNameDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileNameDropdownOpen])

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 34 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              zIndex: 61,
              background: dark
                ? 'linear-gradient(180deg, rgba(18,11,4,0.98), rgba(26,15,6,0.98))'
                : 'linear-gradient(180deg, rgba(253,246,234,0.98), rgba(245,228,200,0.98))',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(212,168,42,0.18)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem 1rem',
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '10%',
                right: '10%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,168,42,0.2), transparent)',
                opacity: 0.3,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }} ref={mobileNameDropdownRef}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FlowSymbol size={26} />
                  <span style={{
                    ...wordmarkStyle,
                    fontSize: '1.15rem',
                    color: dark ? '#e8c46a' : '#8a5a12',
                    fontFamily: currentBranding.fontFamily,
                    letterSpacing: currentBranding.letterSpacing,
                    fontStyle: currentBranding.fontStyle,
                    fontWeight: currentBranding.fontWeight,
                    textTransform: currentBranding.textTransform || 'none',
                    transition: 'all 0.5s ease',
                  }}>{currentBranding.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileNameDropdownOpen(prev => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: dark ? 'rgba(232, 196, 106, 0.55)' : 'rgba(138, 90, 18, 0.55)',
                    cursor: 'pointer',
                    fontSize: '10px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                  }}
                >
                  ✦
                </button>

                {/* Mobile Brand selector dropdown */}
                <AnimatePresence>
                  {mobileNameDropdownOpen && (
                    <BrandingDropdown
                      dark={dark}
                      user={user}
                      selectedBranding={selectedBranding}
                      setSelectedBranding={setSelectedBranding}
                      onClose={() => setMobileNameDropdownOpen(false)}
                      notif={notif}
                      customStyle={{ top: 'calc(100% + 8px)', width: 230 }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.88 }}
                onClick={() => setMobileOpen(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212,168,42,0.22)',
                  background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                  color: dark ? '#d9b96a' : '#6b4c12',
                  cursor: 'pointer',
                }}
                aria-label="Close menu"
              >
                <X size={13} />
              </motion.button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {NAV.map(item => (
                <MobileNavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>

            {/* Drawer footer */}
            <div style={{
              paddingTop: '1.25rem',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(212,168,42,0.2), transparent)',
                opacity: 0.3,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={toggle}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '9px 14px',
                    borderRadius: 999,
                    border: '1px solid rgba(212,168,42,0.22)',
                    background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                    color: dark ? '#d9b96a' : '#6b4c12',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                  }}
                >
                  {dark ? <Sun size={12} /> : <Moon size={12} />}
                  {dark ? 'Light Mode' : 'Dark Mode'}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={() => {
                    setMobileOpen(false)
                    setGalleryOpen(true)
                  }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212,168,42,0.22)',
                    background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                    color: dark ? '#d9b96a' : '#6b4c12',
                    cursor: 'pointer',
                  }}
                  aria-label="Open achievements"
                >
                  <Award size={13} />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={toggleMute}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212,168,42,0.22)',
                    background: isMuted ? 'rgba(127,29,29,0.1)' : dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                    color: isMuted ? '#b91c1c' : dark ? '#d9b96a' : '#6b4c12',
                    cursor: 'pointer',
                  }}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </motion.button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <NotificationsButton />
              </div>

              {isAuthenticated ? (
                <>
                  {/* Profile section in mobile */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: dark ? 'rgba(212,168,42,0.06)' : 'rgba(212,168,42,0.05)',
                    border: '1px solid rgba(212,168,42,0.12)',
                  }}>
                    <ProfileAvatar user={user} size={34} onClick={() => {}} style={{ cursor: 'default' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: dark ? '#f5e6c8' : '#3d2208',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {user?.name || 'User'}
                      </div>
                      <div style={{
                        fontSize: '0.62rem',
                        color: dark ? 'rgba(212,168,42,0.5)' : 'rgba(92,61,30,0.45)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: 1,
                      }}>
                        {user?.email || ''}
                      </div>
                      <div style={{
                        fontSize: '0.65rem',
                        color: '#c9a84c',
                        fontWeight: 700,
                        marginTop: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        <span>✨ {user.xp || '—'} XP</span>
                        <span style={{ color: dark ? 'rgba(212,168,42,0.3)' : 'rgba(92,61,30,0.2)' }}>|</span>
                        <span style={{ color: '#E8622A' }}>🪷 {user.pranaPoints || '—'} Prana</span>
                      </div>
                    </div>
                  </div>

                  <NavLink to="/profile" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 999,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: dark ? '#f5e6c8' : '#5c3d1e',
                      textTransform: 'uppercase',
                      background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                      border: '1px solid rgba(212,168,42,0.22)',
                      cursor: 'pointer',
                    }}>
                      <User size={11} />
                      View Profile
                    </div>
                  </NavLink>

                  <div
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                      navigate('/')
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      borderRadius: 999,
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#b45a3c',
                      textTransform: 'uppercase',
                      background: dark ? 'rgba(180,60,40,0.06)' : 'rgba(180,60,40,0.04)',
                      border: '1px solid rgba(180,60,40,0.15)',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={11} />
                    Logout
                  </div>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 999,
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: dark ? '#f5e6c8' : '#5c3d1e',
                    textTransform: 'uppercase',
                    background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                    border: '1px solid rgba(212,168,42,0.22)',
                    cursor: 'pointer',
                  }}>
                    <LogIn size={11} />
                    Sign In
                  </div>
                </NavLink>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
