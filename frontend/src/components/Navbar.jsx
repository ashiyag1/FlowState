import { NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, LogIn, LogOut, Volume2, VolumeX, Menu, X, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationsButton from './NotificationsButton'

const NAV = [
  { to: '/',        label: 'Home',      sub: 'Sanctuary' },
  { to: '/water',   label: 'Water',     sub: 'Amrit'     },
  { to: '/habits',  label: 'Ritual',    sub: 'Sadhana'   },
  { to: '/journal', label: 'Journal',   sub: 'Chintan'   },
  { to: '/quotes',  label: 'Wisdom',    sub: 'Gyan'      },
  { to: '/heritage', label: 'Heritage', sub: 'Sampada'   },
  { to: '/community', label: 'Sangha',  sub: 'Community' },
]

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

function NavItem({ to, label, sub }) {
  return (
    <NavLink to={to} end={to === '/'} style={{ textDecoration: 'none' }}
      className={({ isActive }) =>
        `relative flex flex-col items-center px-3 py-1.5 rounded-full transition-all duration-300 select-none
         ${isActive ? 'text-[#3d2208] dark:text-[#f5e6c8]' : 'text-[#5c3d1e]/85 dark:text-[#e8c97a]/75 hover:text-[#3d2208] dark:hover:text-[#f5e6c8]'}`
      }>
      {({ isActive }) => (<>
        {isActive && (
          <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,42,0.32), rgba(232,199,122,0.14))',
              border: '1px solid rgba(212,168,42,0.5)',
              boxShadow: '0 0 24px rgba(212,168,42,0.18), 0 4px 12px rgba(180,120,20,0.1), inset 0 1px 0 rgba(255,240,190,0.25)',
            }}
            transition={{ type:'spring', stiffness:400, damping:36 }}/>
        )}
        <span className="relative z-10 text-[0.75rem] font-semibold leading-tight tracking-wider"
          style={{ fontFamily:"'Cinzel',serif" }}>
          {label}
        </span>
        <span className="relative z-10 text-[0.55rem] leading-none opacity-60 mt-0.5"
          style={{ fontFamily:"'Lora',serif", fontStyle:'italic' }}>
          {sub}
        </span>
      </>)}
    </NavLink>
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

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { isMuted, toggleMute } = useSoundEffects()
  const { user, isAuthenticated, logout } = useAuth()
  const [visible,    setVisible]  = useState(true)
  const [scrolled,   setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)

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
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/samarkan');

        @keyframes floatY {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-3px); }
        }
        .nb-float { animation: floatY 4s ease-in-out infinite; }

      `}</style>

      <motion.header
        animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
        transition={{ duration:0.35, ease:[0.4,0,0.2,1] }}
        style={{
          position:'fixed', top:0, left:'50%', zIndex:50,
          x:'-50%',
          paddingTop:'1.25rem',
          pointerEvents:'none',
        }}
      >
        {/* ── DESKTOP CAPSULE ── */}
        <div className="hidden md:flex" style={{
          alignItems:'center', gap:'1.25rem',
          padding:'0.4rem 0.7rem',
          borderRadius:999,
          background: glassBg,
          backdropFilter:'blur(28px) saturate(1.3)',
          WebkitBackdropFilter:'blur(28px) saturate(1.3)',
          border:`1px solid ${glassBorder}`,
          boxShadow: dark ? glassShadowDark : glassShadow,
          transition:'box-shadow 0.4s ease, background 0.3s ease, border 0.3s ease',
          position:'relative',
          pointerEvents:'auto',
        }}>
          {/* Translucent gold highlight line at top of capsule */}
          <span style={{
            position:'absolute', top:-1, left:'20%', right:'20%', height:1,
            background:'linear-gradient(90deg,transparent,rgba(212,168,42,0.18),transparent)',
            pointerEvents:'none', borderRadius:1,
          }}/>

          {/* LEFT — nav */}
          <div style={{ display:'flex', alignItems:'center', gap:1 }}>
            {NAV.map((item, i) => (
              <div key={item.to} style={{ display:'flex', alignItems:'center' }}>
                <NavItem {...item}/>
                {i < NAV.length - 1 && <GoldStar/>}
              </div>
            ))}
          </div>

          {/* CENTRE — brand */}
          <NavLink to="/" style={{ textDecoration:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div className="nb-float" style={{ position:'relative' }}>
                <span style={{
                  position:'absolute', inset:0, borderRadius:'50%',
                  background:'radial-gradient(circle,rgba(212,168,42,0.35) 0%,transparent 70%)',
                  filter:'blur(8px)', transform:'scale(1.4)', opacity:0.4,
                  pointerEvents:'none',
                }}/>
                <FlowSymbol size={28}/>
              </div>
              <span style={{
                ...wordmarkStyle,
                fontSize:'1.28rem',
                color: dark ? '#e8c46a' : '#8a5a12',
              }}>Tarang‑FlowState</span>
            </div>
          </NavLink>

          {/* RIGHT — actions */}
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <motion.button type="button" whileTap={{ scale:0.88 }} onClick={toggle}
              style={{
                width:30, height:30, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(212,168,42,0.22)',
                background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                boxShadow:'0 1px 6px rgba(160,100,10,0.04), inset 0 1px 0 rgba(232,199,122,0.08)',
                color: dark ? '#d9b96a' : '#6b4c12',
                cursor:'pointer', transition:'all 0.25s ease',
              }} aria-label="Toggle theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={dark?'sun':'moon'}
                  initial={{ rotate:-90, opacity:0, scale:0.6 }}
                  animate={{ rotate:0,   opacity:1, scale:1   }}
                  exit={{    rotate:90,  opacity:0, scale:0.6 }}
                  transition={{ duration:0.18 }}>
                  {dark ? <Sun size={12}/> : <Moon size={12}/>}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <NotificationsButton />

            <motion.button type="button" whileTap={{ scale:0.88 }} onClick={toggleMute}
              style={{
                width:30, height:30, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(212,168,42,0.22)',
                background: isMuted
                  ? 'rgba(127,29,29,0.1)'
                  : dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                color: isMuted ? '#b91c1c' : dark ? '#d9b96a' : '#6b4c12',
                cursor:'pointer', transition:'all 0.25s ease',
              }} aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}>
              {isMuted ? <VolumeX size={12}/> : <Volume2 size={12}/>}
            </motion.button>

            {/* Sign In / Logout — softer glass CTA */}
            {isAuthenticated ? (
              <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={logout}
                style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  padding:'5px 12px', borderRadius:999,
                  fontFamily:"'Cinzel',serif", fontSize:'0.64rem',
                  fontWeight:600, letterSpacing:'0.08em',
                  color: dark ? '#f5e6c8' : '#5c3d1e',
                  textTransform:'uppercase',
                  background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                  border:'1px solid rgba(212,168,42,0.22)',
                  boxShadow:'0 1px 4px rgba(160,100,10,0.04)',
                  cursor:'pointer', transition:'all 0.25s ease',
                }}>
                <LogOut size={10}/>
                <span>Logout ({user?.name?.split(' ')[0]})</span>
              </motion.div>
            ) : (
              <NavLink to="/login" style={{ textDecoration:'none' }}>
                <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:5,
                    padding:'5px 12px', borderRadius:999,
                    fontFamily:"'Cinzel',serif", fontSize:'0.64rem',
                    fontWeight:600, letterSpacing:'0.08em',
                    color: dark ? '#f5e6c8' : '#5c3d1e',
                    textTransform:'uppercase',
                    background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                    border:'1px solid rgba(212,168,42,0.22)',
                    boxShadow:'0 1px 4px rgba(160,100,10,0.04)',
                    cursor:'pointer', transition:'all 0.25s ease',
                  }}>
                  <LogIn size={10}/>
                  <span>Sign In</span>
                </motion.div>
              </NavLink>
            )}
          </div>
        </div>

        {/* ── MOBILE CAPSULE ── */}
        <div className="flex md:hidden" style={{
          width:'calc(100% - 1.5rem)',
          maxWidth:480,
          alignItems:'center',
          justifyContent:'space-between',
          padding:'0.45rem 1rem',
          borderRadius:999,
          background: glassBg,
          backdropFilter:'blur(28px) saturate(1.3)',
          WebkitBackdropFilter:'blur(28px) saturate(1.3)',
          border:`1px solid ${glassBorder}`,
          boxShadow: dark ? glassShadowDark : glassShadow,
          transition:'box-shadow 0.4s ease, background 0.3s ease',
          margin:'0 auto',
          pointerEvents:'auto',
        }}>
          <NavLink to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
            <FlowSymbol size={24}/>
            <span style={{
              ...wordmarkStyle, fontSize:'1.15rem',
              color: dark ? '#e8c46a' : '#8a5a12',
            }}>Tarang‑FlowState</span>
          </NavLink>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <NotificationsButton />
            <motion.button type="button" whileTap={{ scale:0.88 }}
              onClick={() => setMobileOpen(true)}
              style={{
                width:30, height:30, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid rgba(212,168,42,0.22)',
                background: dark ? 'rgba(212,168,42,0.08)' : 'rgba(255,255,255,0.4)',
                color: dark ? '#d9b96a' : '#6b4c12',
                cursor:'pointer',
              }} aria-label="Open menu">
              <Menu size={13}/>
            </motion.button>
          </div>
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
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <FlowSymbol size={26}/>
                  <span style={{
                    ...wordmarkStyle, fontSize:'1.15rem',
                    color: dark ? '#e8c46a' : '#8a5a12',
                  }}>Tarang</span>
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

                {isAuthenticated ? (
                  <div onClick={() => { logout(); setMobileOpen(false); }}
                    style={{
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
                    <LogOut size={11}/>
                    Logout ({user?.name?.split(' ')[0]})
                  </div>
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
    </>
  )
}
