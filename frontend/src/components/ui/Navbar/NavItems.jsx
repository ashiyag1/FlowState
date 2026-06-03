import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export function NavItem({ to, label }) {
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

export function MobileNavItem({ to, label, sub, onClick }) {
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

export function BottomTab({ to, label, icon: Icon }) {
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
