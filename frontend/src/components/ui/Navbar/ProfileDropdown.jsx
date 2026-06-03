import React from 'react'
import { motion } from 'framer-motion'
import { User as UserIcon, Download, LogOut } from 'lucide-react'

/* ── Avatar component (shared between desktop & mobile) ── */
export function ProfileAvatar({ user, size = 30, onClick, style = {} }) {
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

export function ProfileDropdown({
  dark,
  user,
  onClose,
  logout,
  navigate
}) {
  return (
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
          onClick={() => { onClose(); navigate('/profile') }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 10px', borderRadius: 10,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
        >
          <UserIcon size={13} style={{ color: dark ? '#d9b96a' : '#8a5a12', flexShrink: 0 }} />
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
            onClose()
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
          onClick={() => { onClose(); logout(); navigate('/') }}
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
  )
}
