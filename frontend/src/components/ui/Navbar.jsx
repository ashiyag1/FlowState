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

const BRANDING_LOCKS = {
  'Tarang-FlowState': 0,
  'Saanjh': 50,
  'Antara': 100,
  'Sattva': 150,
  'Sukoon': 200,
  'Ekaa': 250
}

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const NAV = [
  { to: '/',        label: 'Home',      sub: 'Sanctuary' },
  { to: '/habits',  label: 'Daily Flow',    sub: 'Sadhana'   },
  { to: '/journal', label: 'Journal',   sub: 'Chintan'   },
  { to: '/quotes',  label: 'Wisdom',    sub: 'Gyan'      },
]

const BRANDING_OPTIONS = {
  'Tarang-FlowState': {
    name: 'Tarang‑FlowState',
    meaning: 'Wave of FlowState',
    fontFamily: "'Samarkan', 'Yatra One', 'Tiro Devanagari Hindi', 'Cormorant Garamond', serif",
    letterSpacing: '0.04em',
    fontStyle: 'normal',
    fontWeight: 400
  },
  'Saanjh': {
    name: 'Saanjh',
    meaning: 'Twilight Sanctuary',
    fontFamily: "'Lora', serif",
    letterSpacing: '0.08em',
    fontStyle: 'italic',
    fontWeight: 600
  },
  'Antara': {
    name: 'Antara',
    meaning: 'Inner Space & Rhythm',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '0.14em',
    fontStyle: 'normal',
    fontWeight: 500
  },
  'Sattva': {
    name: 'Sattva',
    meaning: 'Purity & Stillness',
    fontFamily: "'Lexend', sans-serif",
    letterSpacing: '0.12em',
    fontStyle: 'normal',
    fontWeight: 300,
    textTransform: 'uppercase'
  },
  'Sukoon': {
    name: 'Sukoon',
    meaning: 'Calmness & Peace',
    fontFamily: "'Noto Serif Devanagari', serif",
    letterSpacing: '0.06em',
    fontStyle: 'normal',
    fontWeight: 600
  },
  'Ekaa': {
    name: 'Ekaa',
    meaning: 'Single-Pointed Focus',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '0.1em',
    fontStyle: 'italic',
    fontWeight: 700
  }
}

function FlowSymbol({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 1 L31 16 L16 31 L1 16 Z" stroke="url(#sg)" strokeWidth="0.9" fill="none"/>
      <path d="M16 4.5 L27.5 16 L16 27.5 L4.5 16 Z" stroke="url(#sg)" strokeWidth="0.55" fill="none" opacity="0.45"/>
      {[0,45,90,135,180,225,270,315].map(d => (
        <ellipse key={d} cx="16" cy="9.5" rx="1.6" ry="5.2"
          fill="url(#sg)" opacity="0.55" transform={`rotate(${d} 16 16)`}/>
      ))}
      <circle cx="16" cy="16" r="5.5" stroke="url(#sg)" strokeWidth="0.55" fill="none" opacity="0.5"/>
      <circle cx="16" cy="16" r="2.2" fill="url(#sg)" opacity="0.95"/>
      <circle cx="16" cy="16" r="0.9" fill="white" opacity="0.9"/>
      {[['16','1'],['31','16'],['16','31'],['1','16']].map(([cx,cy]) => (
        <circle key={cx+cy} cx={cx} cy={cy} r="0.9" fill="url(#sg)" opacity="0.7"/>
      ))}
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#e8c46a"/>
          <stop offset="50%" stopColor="#d4a82a"/>
          <stop offset="100%" stopColor="#c8921a"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function NavItem({ to, label }) {
  return (
    <div style={{ position: 'relative' }}>
      <NavLink to={to} end={to === '/'} style={{ textDecoration: 'none' }}
        className={({ isActive }) =>
          `relative flex flex-col items-center px-3 py-2 transition-all duration-300 select-none
           ${isActive ? 'text-[#3d2208] dark:text-[#f5e6c8]' : 'text-[#5c3d1e]/75 dark:text-[#e8c97a]/70 hover:text-[#3d2208] dark:hover:text-[#f5e6c8]'}`
        }>
        {({ isActive }) => (<>
          {isActive && (
            <motion.span layoutId="nav-underline" className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, #d4a82a, #e8c77a)',
                boxShadow: '0 0 8px rgba(212,168,42,0.4)',
              }}
              transition={{ type:'spring', stiffness:400, damping:36 }}/>
          )}
          <span className="relative z-10 text-[0.82rem] font-bold leading-tight tracking-wider"
            style={{ fontFamily:"'Cinzel',serif" }}>
            {label}
          </span>
        </>)}
      </NavLink>
    </div>
  )
}

const GoldStar = ({ size = 5 }) => (
  <span style={{
    fontSize: `${size}px`, color: 'var(--gold)', opacity: 0.4,
    lineHeight: 1, flexShrink: 0,
  }}>✦</span>
)

const wordmarkStyle = {
  fontFamily:"'Samarkan','Yatra One','Tiro Devanagari Hindi','Cormorant Garamond',serif",
  fontSize:'1.58rem',
  fontWeight:400,
  color:'#c4911e',
  lineHeight:1,
  letterSpacing:'0.04em',
  textShadow:'0 1px 0 rgba(255,240,190,0.35)',
}

function MobileNavItem({ to, label, sub, onClick }) {
  return (
    <NavLink to={to} end={to === '/'} onClick={onClick}
      style={{ textDecoration:'none' }}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200
         ${isActive
           ? 'bg-[var(--gold)]/10 dark:bg-[var(--gold)]/8 text-[var(--bark)] dark:text-[var(--cream)]'
           : 'text-[var(--bark-lt)]/70 dark:text-[var(--gold-lt)]/50 hover:bg-[var(--gold)]/5'}`
      }>
      {({ isActive }) => (<>
        <span style={{
          fontSize: '10px', color: 'var(--gold)',
          opacity: isActive ? 1 : 0.3,
          flexShrink: 0, transition: 'opacity 0.2s',
        }}>✦</span>
        <div style={{ display:'flex', flexDirection:'column' }}>
          <span style={{
            fontFamily:"'Cinzel',serif", fontSize:'1rem',
            fontWeight: isActive ? 600 : 400, letterSpacing:'0.05em',
          }}>
            {label}
          </span>
          <span style={{
            fontFamily:"'Lora',serif", fontStyle:'italic',
            fontSize:'0.72rem', opacity:0.5, marginTop:1,
          }}>
            {sub}
          </span>
        </div>
      </>)}
    </NavLink>
  )
}

function BottomTab({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 select-none
         ${isActive ? 'text-[#3d2208] dark:text-[#f5e6c8]' : 'text-[#5c3d1e]/55 dark:text-[#e8c97a]/45 hover:text-[#3d2208] dark:hover:text-[#f5e6c8]'}`
      }
    >
      {({ isActive }) => {
        const iconColor = isActive 
          ? 'var(--gold)' 
          : 'currentColor';
        return (
          <>
            <Icon size={18} style={{ color: iconColor, transition: 'color 0.2s' }} />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '8px',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                marginTop: '1px'
              }}
            >
              {label}
            </span>
          </>
        )
      }}
    </NavLink>
  )
}

/* ── Avatar component (shared between desktop & mobile) ── */
function ProfileAvatar({ user, size = 30, onClick, style = {} }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(212,168,42,0.4)',
        background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #C9933A, #E8B96A)',
        cursor: 'pointer', overflow: 'hidden',
        boxShadow: '0 0 12px rgba(212,168,42,0.15), inset 0 1px 0 rgba(255,240,190,0.2)',
        padding: 0,
        ...style,
      }}
      aria-label="Profile"
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      ) : (
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: size * 0.42,
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1,
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}>
          {initial}
        </span>
      )}
    </motion.button>
  )
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { isMuted, toggleMute } = useSoundEffects()
  const { user, isAuthenticated, logout } = useAuth()
  const { setGalleryOpen } = useAchievements()
  const { journal, habitDone } = useWellness()
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
  const [mobileNameDropdownOpen, setMobileNameDropdownOpen] = useState(false)
  const nameDropdownRef = useRef(null)
  const mobileNameDropdownRef = useRef(null)

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

  // Compute journal cycle from local journal entries
  const journalCycle = useMemo(() => {
    const dateSet = new Set(journal.map(e => e.date))
    let count = 0
    const d = new Date()
    let currentStr = getLocalYYYYMMDD(d)
    
    // Check today, then yesterday, then the day before (up to 1 rest day initially)
    if (!dateSet.has(currentStr)) {
      d.setDate(d.getDate() - 1)
      currentStr = getLocalYYYYMMDD(d)
      if (!dateSet.has(currentStr)) {
        d.setDate(d.getDate() - 1)
        currentStr = getLocalYYYYMMDD(d)
      }
    }
    
    if (dateSet.has(currentStr)) {
      while (true) {
        if (dateSet.has(currentStr)) {
          count++
          d.setDate(d.getDate() - 1)
          currentStr = getLocalYYYYMMDD(d)
        } else {
          // Check if it's just a 1-day gap (Rest Day)
          const tempD = new Date(d)
          tempD.setDate(tempD.getDate() - 1)
          const tempStr = getLocalYYYYMMDD(tempD)
          if (dateSet.has(tempStr)) {
            // Found an entry the day before the gap. Count the gap as a forgiven rest day.
            d.setDate(d.getDate() - 1)
            currentStr = getLocalYYYYMMDD(d)
          } else {
            break // 2-day gap breaks the cycle
          }
        }
      }
    }
    return count
  }, [journal])

  const todayStr = getLocalYYYYMMDD()
  const dCheck = new Date()
  dCheck.setDate(dCheck.getDate() - 1)
  const yesterdayStr = getLocalYYYYMMDD(dCheck)
  
  const journaledToday = journal.some(e => e.date === todayStr)
  const journaledYesterday = journal.some(e => e.date === yesterdayStr)
  
  const cycleAtRisk = journalCycle > 0 && !journaledToday && !journaledYesterday
  const isOnRestDay = journalCycle > 0 && !journaledToday && journaledYesterday

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
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 12px)', left: 0,
                    width: 250, zIndex: 100,
                    borderRadius: 16,
                    background: dark
                      ? 'rgba(22, 14, 6, 0.95)'
                      : 'rgba(253, 248, 235, 0.98)',
                    backdropFilter: 'blur(32px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
                    border: '1px solid rgba(212,168,42,0.22)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
                    padding: '8px',
                    pointerEvents: 'auto',
                  }}
                >
                  <div style={{
                    fontSize: '9px',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.12em',
                    color: dark ? 'rgba(212,168,42,0.6)' : 'rgba(138,90,18,0.6)',
                    padding: '6px 8px 4px',
                    borderBottom: '1px solid rgba(212,168,42,0.1)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                  }}>
                    Select Sanctuary Name
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(BRANDING_OPTIONS).map(([key, opt]) => {
                      const isSelected = selectedBranding === key
                      const requiredPrana = BRANDING_LOCKS[key] || 0
                      const userPrana = user?.pranaPoints || 0
                      const isLocked = requiredPrana > userPrana
                      return (
                        <motion.button
                          key={key}
                          whileHover={{ backgroundColor: dark ? 'rgba(212,168,42,0.08)' : 'rgba(212,168,42,0.06)' }}
                          onClick={() => {
                            if (isLocked) {
                              notif(`🔒 Unlock ${opt.name} by earning ${requiredPrana} Prana Points! Complete all daily rituals.`, 'info')
                              setNameDropdownOpen(false)
                              return
                            }
                            setSelectedBranding(key)
                            localStorage.setItem('fwa_selected_branding', key)
                            setNameDropdownOpen(false)
                          }}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '8px 10px',
                            borderRadius: 10,
                            background: isSelected
                              ? (dark ? 'rgba(212,168,42,0.14)' : 'rgba(212,168,42,0.1)')
                              : 'transparent',
                            border: isSelected
                              ? '1px solid rgba(212,168,42,0.25)'
                              : '1px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.2s ease',
                            opacity: isLocked ? 0.55 : 1,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span style={{
                              fontFamily: opt.fontFamily,
                              fontSize: '0.92rem',
                              fontWeight: opt.fontWeight,
                              fontStyle: opt.fontStyle,
                              letterSpacing: opt.letterSpacing,
                              textTransform: opt.textTransform || 'none',
                              color: isSelected
                                ? (dark ? '#ffe090' : '#8a5a12')
                                : (dark ? '#e8d5a8' : '#5c3d1e'),
                            }}>
                              {opt.name}
                            </span>
                            {isLocked && <span style={{ fontSize: '0.65rem', color: dark ? 'rgba(212,168,42,0.7)' : 'rgba(138,90,18,0.7)' }}>🔒 {requiredPrana}</span>}
                          </div>
                          <span style={{
                            fontFamily: "'Lora', serif",
                            fontStyle: 'italic',
                            fontSize: '0.62rem',
                            color: dark ? 'rgba(212,168,42,0.5)' : 'rgba(92,61,30,0.5)',
                            marginTop: 1,
                          }}>
                            {opt.meaning}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
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
                    {[
                      { title: 'Yoga for Beginners', desc: 'Stretch out the laptop slouch & recharge your body vibe.', url: 'https://youtu.be/oDP-89wRXUk?si=v5TLzJNX1ty3XymT' },
                      { title: 'Deep Yoga Nidra', desc: 'The ultimate brain nap—feel like you slept 4 hours in just 20 mins.', url: 'https://youtu.be/uPSml_JQGVY?si=nhVhj5Ag64X3CHEQ' },
                      { title: 'Surya Namaskar', desc: 'The ultimate 5-minute full body cheat-code to boost your dopamine.', url: 'https://youtu.be/AneOlb4dAZU?si=zXqpYa1iZ7MQ0hK-' },
                      { title: 'Chakra Meditation', desc: 'De-clutter your subconscious & stop the late-night overthinking loops.', url: 'https://youtu.be/Zdy-NVFpSUI?si=ayma3Ml5RqjFXKE-' },
                      { title: 'Kapalbhati Breath', desc: 'Like a double-shot espresso for your focus, minus the caffeine crash.', url: 'https://youtu.be/AtG7cx6p7DY?si=BdKVCedciXeLo4SJ' },
                      { title: 'Anulom Vilom', desc: 'The biological chill-pill. Instantly balances nervous system chaos.', url: 'https://youtu.be/blbv5UTBCGg?si=DQt8rU1zp_H5_frA' }
                    ].map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <ProfileAvatar user={user} size={30} onClick={() => setProfileOpen(p => !p)} />

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                      width: 230, zIndex: 100,
                      borderRadius: 16,
                      background: dark
                        ? 'rgba(22, 14, 6, 0.92)'
                        : 'rgba(253, 248, 235, 0.95)',
                      backdropFilter: 'blur(32px) saturate(1.4)',
                      WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
                      border: '1px solid rgba(212,168,42,0.22)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.3), 0 0 40px rgba(212,168,42,0.06)',
                      overflow: 'hidden',
                      pointerEvents: 'auto',
                    }}
                  >
                    {/* Gold accent line at top */}
                    <div style={{
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, rgba(212,168,42,0.5), rgba(232,134,42,0.3), transparent)',
                    }} />

                    {/* User Info */}
                    <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(212,168,42,0.12)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ProfileAvatar user={user} size={36} onClick={() => { }} style={{ cursor: 'default' }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: dark ? '#f5e6c8' : '#3d2208',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {user?.name || 'User'}
                          </div>
                          <div style={{
                            fontSize: '0.65rem',
                            color: dark ? 'rgba(212,168,42,0.55)' : 'rgba(92,61,30,0.5)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            marginTop: 2,
                          }}>
                            {user?.email || ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '6px 8px' }}>
                      <motion.div
                        whileHover={{ backgroundColor: dark ? 'rgba(212,168,42,0.08)' : 'rgba(212,168,42,0.06)' }}
                        onClick={() => { setProfileOpen(false); navigate('/profile') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 10px', borderRadius: 10,
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        <User size={13} style={{ color: dark ? '#d9b96a' : '#8a5a12', flexShrink: 0 }} />
                        <span style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          color: dark ? '#e8d5a8' : '#5c3d1e',
                        }}>
                          View Profile
                        </span>
                      </motion.div>

                      {/* Install PWA Button */}
                      <motion.div
                        whileHover={{ backgroundColor: dark ? 'rgba(87, 184, 214, 0.1)' : 'rgba(87, 184, 214, 0.08)' }}
                        onClick={() => {
                          setProfileOpen(false)
                          alert("To install: Open browser menu (or share sheet on iOS) and tap 'Add to Home Screen'.")
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 10px', borderRadius: 10,
                          cursor: 'pointer', transition: 'background 0.15s',
                          borderBottom: '1px solid rgba(212,168,42,0.1)'
                        }}
                      >
                        <Download size={13} style={{ color: '#57B8D6', flexShrink: 0 }} />
                        <span style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          color: '#57B8D6',
                        }}>
                          Install App
                        </span>
                      </motion.div>

                      <motion.div
                        whileHover={{ backgroundColor: dark ? 'rgba(180,40,40,0.1)' : 'rgba(180,40,40,0.06)' }}
                        onClick={() => { setProfileOpen(false); logout(); navigate('/') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 10px', borderRadius: 10,
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        <LogOut size={13} style={{ color: '#b45a3c', flexShrink: 0 }} />
                        <span style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          color: '#b45a3c',
                        }}>
                          Logout
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
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

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position:'fixed', inset:0, zIndex:60,
                background:'rgba(0,0,0,0.4)',
                backdropFilter:'blur(4px)',
              }}
            />
            <motion.aside
              initial={{ x:'100%' }}
              animate={{ x:0 }}
              exit={{ x:'100%' }}
              transition={{ type:'spring', stiffness:350, damping:34 }}
              style={{
                position:'fixed', top:0, right:0, bottom:0,
                width:'min(320px,85vw)',
                zIndex:61,
                background: dark
                  ? 'linear-gradient(180deg,rgba(18,11,4,0.98),rgba(26,15,6,0.98))'
                  : 'linear-gradient(180deg,rgba(253,246,234,0.98),rgba(245,228,200,0.98))',
                backdropFilter:'blur(24px)',
                borderLeft:'1px solid rgba(212,168,42,0.18)',
                boxShadow:'-8px 0 40px rgba(0,0,0,0.2)',
                display:'flex', flexDirection:'column',
                padding:'1.5rem 1rem',
              }}>
              {/* Drawer header */}
              <div style={{
                display:'flex', alignItems:'center',
                justifyContent:'space-between',
                paddingBottom:'1.25rem',
                marginBottom:'1.5rem',
                position:'relative',
              }}>
                <div style={{
                  position:'absolute', bottom:0, left:'10%', right:'10%', height:1,
                  background:'linear-gradient(90deg,transparent,rgba(212,168,42,0.2),transparent)',
                  opacity:0.3,
                }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }} ref={mobileNameDropdownRef}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <FlowSymbol size={26}/>
                    <span style={{
                      ...wordmarkStyle,
                      fontSize:'1.15rem',
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
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                          width: 230, zIndex: 100,
                          borderRadius: 16,
                          background: dark
                            ? 'rgba(22, 14, 6, 0.96)'
                            : 'rgba(253, 248, 235, 0.98)',
                          backdropFilter: 'blur(32px) saturate(1.4)',
                          WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
                          border: '1px solid rgba(212,168,42,0.22)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
                          padding: '6px',
                          pointerEvents: 'auto',
                        }}
                      >
                        <div style={{
                          fontSize: '9px',
                          fontFamily: "'Cinzel', serif",
                          letterSpacing: '0.12em',
                          color: dark ? 'rgba(212,168,42,0.6)' : 'rgba(138,90,18,0.6)',
                          padding: '6px 8px 4px',
                          borderBottom: '1px solid rgba(212,168,42,0.1)',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                        }}>
                          Select Sanctuary Name
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {Object.entries(BRANDING_OPTIONS).map(([key, opt]) => {
                            const isSelected = selectedBranding === key
                            const requiredPrana = BRANDING_LOCKS[key] || 0
                            const userPrana = user?.pranaPoints || 0
                            const isLocked = requiredPrana > userPrana
                            return (
                              <motion.button
                                key={key}
                                whileHover={{ backgroundColor: dark ? 'rgba(212,168,42,0.08)' : 'rgba(212,168,42,0.06)' }}
                                onClick={() => {
                                  if (isLocked) {
                                    notif(`🔒 Unlock ${opt.name} by earning ${requiredPrana} Prana Points! Complete all daily rituals.`, 'info')
                                    setMobileNameDropdownOpen(false)
                                    return
                                  }
                                  setSelectedBranding(key)
                                  localStorage.setItem('fwa_selected_branding', key)
                                  setMobileNameDropdownOpen(false)
                                }}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  padding: '6px 8px',
                                  borderRadius: 10,
                                  background: isSelected
                                    ? (dark ? 'rgba(212,168,42,0.14)' : 'rgba(212,168,42,0.1)')
                                    : 'transparent',
                                  border: isSelected
                                    ? '1px solid rgba(212,168,42,0.25)'
                                    : '1px solid transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                  transition: 'all 0.2s ease',
                                  opacity: isLocked ? 0.55 : 1,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <span style={{
                                    fontFamily: opt.fontFamily,
                                    fontSize: '0.85rem',
                                    fontWeight: opt.fontWeight,
                                    fontStyle: opt.fontStyle,
                                    letterSpacing: opt.letterSpacing,
                                    textTransform: opt.textTransform || 'none',
                                    color: isSelected
                                      ? (dark ? '#ffe090' : '#8a5a12')
                                      : (dark ? '#e8d5a8' : '#5c3d1e'),
                                  }}>
                                    {opt.name}
                                  </span>
                                  {isLocked && <span style={{ fontSize: '0.6rem', color: dark ? 'rgba(212,168,42,0.7)' : 'rgba(138,90,18,0.7)' }}>🔒 {requiredPrana}</span>}
                                </div>
                                <span style={{
                                  fontFamily: "'Lora', serif",
                                  fontStyle: 'italic',
                                  fontSize: '0.58rem',
                                  color: dark ? 'rgba(212,168,42,0.5)' : 'rgba(92,61,30,0.5)',
                                  marginTop: 1,
                                }}>
                                  {opt.meaning}
                                </span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button type="button" whileTap={{ scale:0.88 }}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    width:30, height:30, borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:'1px solid rgba(212,168,42,0.22)',
                    background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                    color: dark ? '#d9b96a' : '#6b4c12',
                    cursor:'pointer',
                  }} aria-label="Close menu">
                  <X size={13}/>
                </motion.button>
              </div>

              <nav style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
                {NAV.map(item => (
                  <MobileNavItem key={item.to} {...item} onClick={() => setMobileOpen(false)}/>
                ))}
              </nav>

              {/* Drawer footer */}
              <div style={{
                paddingTop:'1.25rem',
                position:'relative',
                display:'flex', flexDirection:'column', gap:10,
              }}>
                <div style={{
                  position:'absolute', top:0, left:'10%', right:'10%', height:1,
                  background:'linear-gradient(90deg,transparent,rgba(212,168,42,0.2),transparent)',
                  opacity:0.3,
                }}/>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <motion.button type="button" whileTap={{ scale:0.88 }} onClick={toggle}
                    style={{
                      flex:1, display:'flex', alignItems:'center',
                      justifyContent:'center', gap:8,
                      padding:'9px 14px', borderRadius:999,
                      border:'1px solid rgba(212,168,42,0.22)',
                      background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                      color: dark ? '#d9b96a' : '#6b4c12',
                      fontFamily:"'Cinzel',serif", fontSize:'0.7rem', letterSpacing:'0.08em',
                      cursor:'pointer',
                    }}>
                    {dark ? <Sun size={12}/> : <Moon size={12}/>}
                    {dark ? 'Light Mode' : 'Dark Mode'}
                  </motion.button>
                  <motion.button type="button" whileTap={{ scale:0.88 }} onClick={() => { setMobileOpen(false); setGalleryOpen(true); }}
                    style={{
                      width:38, height:38, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'1px solid rgba(212,168,42,0.22)',
                      background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                      color: dark ? '#d9b96a' : '#6b4c12',
                      cursor:'pointer',
                    }} aria-label="Open achievements">
                    <Award size={13}/>
                  </motion.button>
                  <motion.button type="button" whileTap={{ scale:0.88 }} onClick={toggleMute}
                    style={{
                      width:38, height:38, borderRadius:'50%',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      border:'1px solid rgba(212,168,42,0.22)',
                      background: isMuted ? 'rgba(127,29,29,0.1)' : dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                      color: isMuted ? '#b91c1c' : dark ? '#d9b96a' : '#6b4c12',
                      cursor:'pointer',
                    }}>
                    {isMuted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
                  </motion.button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                  <NotificationsButton />
                </div>

                {isAuthenticated ? (
                  <>
                    {/* Profile section in mobile */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
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
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {user?.name || 'User'}
                        </div>
                        <div style={{
                          fontSize: '0.62rem',
                          color: dark ? 'rgba(212,168,42,0.5)' : 'rgba(92,61,30,0.45)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
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
                          gap: 6
                        }}>
                          <span>✨ {user.xp || '—'} XP</span>
                          <span style={{ color: dark ? 'rgba(212,168,42,0.3)' : 'rgba(92,61,30,0.2)' }}>|</span>
                          <span style={{ color: '#E8622A' }}>🪷 {user.pranaPoints || '—'} Prana</span>
                        </div>
                      </div>
                    </div>

                    <NavLink to="/profile" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '10px 18px', borderRadius: 999,
                        fontFamily: "'Cinzel',serif", fontSize: '0.7rem',
                        fontWeight: 600, letterSpacing: '0.08em',
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

                    <div onClick={() => { logout(); setMobileOpen(false); navigate('/') }}
                      style={{
                        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                        padding:'10px 18px', borderRadius:999,
                        fontFamily:"'Cinzel',serif", fontSize:'0.7rem',
                        fontWeight:600, letterSpacing:'0.08em',
                        color: '#b45a3c',
                        textTransform:'uppercase',
                        background: dark ? 'rgba(180,60,40,0.06)' : 'rgba(180,60,40,0.04)',
                        border:'1px solid rgba(180,60,40,0.15)',
                        cursor:'pointer',
                      }}>
                      <LogOut size={11}/>
                      Logout
                    </div>
                  </>
                ) : (
                  <NavLink to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration:'none' }}>
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                      padding:'10px 18px', borderRadius:999,
                      fontFamily:"'Cinzel',serif", fontSize:'0.7rem',
                      fontWeight:600, letterSpacing:'0.08em',
                      color: dark ? '#f5e6c8' : '#5c3d1e',
                      textTransform:'uppercase',
                      background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.35)',
                      border:'1px solid rgba(212,168,42,0.22)',
                      cursor:'pointer',
                    }}>
                      <LogIn size={11}/>
                      Sign In
                    </div>
                  </NavLink>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: dark ? 'rgba(16, 10, 4, 0.93)' : 'rgba(253, 246, 227, 0.94)',
        backdropFilter: 'blur(28px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
        borderTop: `1px solid ${glassBorder}`,
        boxShadow: dark ? '0 -8px 32px rgba(0,0,0,0.5)' : '0 -8px 32px rgba(92,61,30,0.06)',
        zIndex: 49,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '2px 8px env(safe-area-inset-bottom) 8px',
        pointerEvents: 'auto',
      }}>
        <BottomTab to="/" label="Sanctuary" icon={Compass} />
        <BottomTab to="/habits" label="Sadhana" icon={Flame} />
        <BottomTab to="/journal" label="Chintan" icon={BookOpen} />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            padding: '4px 8px',
            color: dark ? 'rgba(232, 196, 106, 0.55)' : 'rgba(92, 61, 30, 0.55)',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Menu size={18} />
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '8px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            marginTop: '1px'
          }}>More</span>
        </button>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none !important;
          }
          .desktop-top-nav {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
          .desktop-top-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
