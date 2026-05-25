import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, User, Mail, MapPin, Lock, Sun, Moon,
  Volume2, VolumeX, Bell, BellOff, Trash2, LogOut,
  Check, X, Edit3, Shield, Eye, EyeOff, Calendar
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useNotif } from '../components/NotificationPopup'
import PageLayout from '../components/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { computeArchetype, computeWellnessScore } from '../utils/soulArchetype'

/* ── Animation Variants ── */
const stagger = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}

/* ── Decorative Elements ── */
function DecoCircle({ className, size, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    <span className="text-gold/40 text-xs">✦</span>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
  </div>
)

/* ── Section Card Wrapper ── */
function SectionCard({ children, className = '' }) {
  return (
    <motion.div variants={fadeUp}>
      <div className={`rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8 ${className}`}
        style={{
          boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)',
        }}>
        {children}
      </div>
    </motion.div>
  )
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className="text-gold/50 text-xs">✦</span>
      {Icon && <Icon size={15} className="text-gold/60" />}
      <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-gold dark:text-gold-lt"
        style={{ fontFamily: "'Cinzel', serif" }}>
        {children}
      </h3>
    </div>
  )
}

/* ── Custom Toggle Switch ── */
function ToggleSwitch({ checked, onChange, iconOn, iconOff, label, sublabel }) {
  const IconOn = iconOn
  const IconOff = iconOff
  return (
    <div className="flex items-center justify-between py-3 group">
      <div>
        <div className="text-sm font-medium text-ink dark:text-sand-lt/90" style={{ fontFamily: "'Lexend', sans-serif" }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-[0.68rem] text-mist-dark/50 dark:text-sand-lt/30 mt-0.5" style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
            {sublabel}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onChange}
        className="relative inline-flex h-7 w-[52px] items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/25"
        style={{
          background: checked
            ? 'linear-gradient(135deg, #C9933A, #E8B96A)'
            : 'rgba(180,160,130,0.2)',
          border: `1px solid ${checked ? 'rgba(212,168,42,0.5)' : 'rgba(180,160,130,0.25)'}`,
          boxShadow: checked ? '0 0 16px rgba(212,168,42,0.2), inset 0 1px 0 rgba(255,240,190,0.3)' : 'none',
        }}
      >
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex items-center justify-center rounded-full bg-white shadow-md"
          style={{
            width: 22, height: 22,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {checked
            ? (IconOn && <IconOn size={11} className="text-[#C9933A]" />)
            : (IconOff && <IconOff size={11} className="text-gray-400" />)
          }
        </motion.div>
      </button>
    </div>
  )
}

/* ── Input Base Style (matches Login.jsx) ── */
const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm border bg-white/70 backdrop-blur-sm placeholder:text-mist-dark/40 ' +
  'focus:outline-none focus:ring-2 focus:ring-saffron/25 focus:border-saffron/50 transition-all duration-300 ' +
  'dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30 dark:border-gold/15 border-gold/20'

/* ── Delete Confirmation Modal ── */
function DeleteModal({ open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-white/95 dark:bg-[#1a0f06]/95 backdrop-blur-xl p-6 md:p-8"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 0 40px rgba(220,60,40,0.08)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Red accent line */}
              <div className="h-1 w-16 mx-auto mb-5 rounded-full" style={{ background: 'linear-gradient(90deg, #dc2626, #ea580c)' }} />

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ background: 'rgba(220,40,40,0.08)', border: '1px solid rgba(220,40,40,0.15)' }}>
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-ink dark:text-sand-lt mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delete Account?
                </h3>
                <p className="text-sm text-mist-dark/60 dark:text-sand-lt/40 mb-6 leading-relaxed" style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  This action is irreversible. All your data, rituals, and journals will be permanently erased.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gold/20 text-ink/70 dark:text-sand-lt/70 hover:bg-gold/5 transition-colors"
                  style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(220,40,40,0.25)',
                  }}
                >
                  Delete Forever
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROFILE PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, setUser, updateProfile, updateAvatar, changePassword, deleteAccount, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const { isMuted, toggleMute } = useSoundEffects()
  const { journal, habitDone, habits, todayTotal, waterGoal } = useWellness()
  const notif = useNotif()
  const navigate = useNavigate()

  // Archetype + wellness score
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])
  const todayStr = new Date().toISOString().slice(0, 10)
  const habitsCompletedToday = Object.keys(habitDone[todayStr] || {}).length
  const journalStreak = useMemo(() => {
    const dates = [...new Set(journal.map(e => e.date))].sort().reverse()
    let count = 0
    const todayDate = new Date()
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(todayDate)
      d.setDate(d.getDate() - i)
      if (dates[i] === d.toISOString().slice(0, 10)) count++
      else break
    }
    return count
  }, [journal])
  const waterPct = waterGoal > 0 ? Math.min(todayTotal / waterGoal, 1) : 0
  const wellnessScore = useMemo(() => computeWellnessScore({
    journalStreak,
    totalJournalEntries: journal.length,
    habitsCompletedToday,
    totalHabits: habits.length,
    waterPct,
  }), [journalStreak, journal.length, habitsCompletedToday, habits.length, waterPct])

  // Local form state
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [bioVal, setBioVal] = useState('')
  const [locationVal, setLocationVal] = useState('')
  const [notifEnabled, setNotifEnabled] = useState(true)

  // Password
  const [showPwSection, setShowPwSection] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false)

  // File input ref
  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)

  // Sync local state with user data
  useEffect(() => {
    if (user) {
      setNameVal(user.name || '')
      setBioVal(user.bio || '')
      setLocationVal(user.location || '')
      setNotifEnabled(user.preferences?.notificationsEnabled !== false)
    }
  }, [user])

  // Focus name input when editing
  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  /* ── Handlers ── */
  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation for JPG, JPEG, and PNG formats
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const fileExt = file.name.split('.').pop().toLowerCase()
    const allowedExts = ['jpg', 'jpeg', 'png']
    if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
      notif('Only JPG, JPEG, and PNG files are allowed', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      notif('Image too large — max 5MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result
      // Optimistic update
      setUser(prev => ({ ...prev, avatar: base64 }))
      const res = await updateAvatar(base64)
      if (res.success) {
        notif('Avatar updated ✦', 'success')
      } else {
        notif(res.error || 'Failed to update avatar', 'error')
      }
    }
    reader.readAsDataURL(file)
  }, [updateAvatar, notif, setUser])

  const handleRemoveAvatar = useCallback(async () => {
    const oldAvatar = user?.avatar || ''
    // Optimistic update
    setUser(prev => ({ ...prev, avatar: '' }))
    const res = await updateAvatar('')
    if (res.success) {
      notif('Avatar removed ✦', 'success')
    } else {
      notif(res.error || 'Failed to remove avatar', 'error')
      // Revert on failure
      setUser(prev => ({ ...prev, avatar: oldAvatar }))
    }
  }, [updateAvatar, notif, setUser, user?.avatar])

  const handleNameSave = useCallback(async () => {
    setEditingName(false)
    if (!nameVal.trim() || nameVal.trim() === user?.name) return
    const res = await updateProfile({ name: nameVal.trim() })
    if (res.success) {
      notif('Name updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update name', 'error')
      setNameVal(user?.name || '')
    }
  }, [nameVal, user, updateProfile, notif])

  const handleBioSave = useCallback(async () => {
    if (bioVal === (user?.bio || '')) return
    const res = await updateProfile({ bio: bioVal })
    if (res.success) {
      notif('Bio updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update bio', 'error')
    }
  }, [bioVal, user, updateProfile, notif])

  const handleLocationSave = useCallback(async () => {
    if (locationVal === (user?.location || '')) return
    const res = await updateProfile({ location: locationVal })
    if (res.success) {
      notif('Location updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update location', 'error')
    }
  }, [locationVal, user, updateProfile, notif])

  const handleNotifToggle = useCallback(async () => {
    const newVal = !notifEnabled
    setNotifEnabled(newVal)
    const res = await updateProfile({ preferences: { notificationsEnabled: newVal } })
    if (!res.success) {
      setNotifEnabled(!newVal)
      notif(res.error || 'Failed to update preferences', 'error')
    }
  }, [notifEnabled, updateProfile, notif])

  const handlePasswordChange = useCallback(async () => {
    if (!currentPw || !newPw) {
      notif('Please fill in all password fields', 'error')
      return
    }
    if (newPw !== confirmPw) {
      notif('New passwords do not match', 'error')
      return
    }
    if (newPw.length < 6) {
      notif('Password must be at least 6 characters', 'error')
      return
    }
    const res = await changePassword(currentPw, newPw)
    if (res.success) {
      notif('Password changed successfully ✦', 'success')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setShowPwSection(false)
    } else {
      notif(res.error || 'Failed to change password', 'error')
    }
  }, [currentPw, newPw, confirmPw, changePassword, notif])

  const handleDeleteAccount = useCallback(async () => {
    const res = await deleteAccount()
    if (res.success) {
      notif('Account deleted. Farewell ✦', 'info')
      navigate('/')
    } else {
      notif(res.error || 'Failed to delete account', 'error')
    }
    setDeleteOpen(false)
  }, [deleteAccount, notif, navigate])

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'
  const joinedDate = user?.joinedAt || user?.createdAt
    ? new Date(user.joinedAt || user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <PageLayout>
      <div className="relative min-h-[calc(100vh-4.75rem)] px-4 pt-28 pb-16 overflow-hidden">
        {/* Decorative background elements */}
        <DecoCircle className="-top-32 -left-32 bg-saffron/10 blur-3xl" size="500px" delay={0} />
        <DecoCircle className="-bottom-40 -right-32 bg-gold/10 blur-3xl" size="550px" delay={0.15} />
        <DecoCircle className="top-1/3 right-1/4 bg-ocean/8 blur-2xl" size="300px" delay={0.3} />

        {/* Floating decorative dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-saffron/20 dark:bg-gold/20"
            style={{
              top: `${18 + i * 13}%`,
              left: `${8 + (i % 3) * 42}%`,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-2xl mx-auto relative z-10 flex flex-col gap-6"
        >
          {/* ═══════════ SECTION 1: Profile Header ═══════════ */}
          <SectionCard>
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative group mb-5">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative"
                  style={{
                    width: 96, height: 96, borderRadius: '50%',
                    border: '2.5px solid rgba(212,168,42,0.4)',
                    boxShadow: '0 0 32px rgba(212,168,42,0.12), 0 8px 24px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #C9933A, #E8B96A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 38,
                      fontWeight: 700,
                      color: '#fff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                      {initial}
                    </span>
                  )}

                  {/* Camera overlay on hover */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      borderRadius: '50%',
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={22} className="text-white" />
                  </motion.div>
                </motion.div>

                {/* Subtle golden glow ring */}
                <div className="absolute -inset-1.5 rounded-full opacity-20 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(212,168,42,0.3) 0%, transparent 70%)',
                    filter: 'blur(6px)',
                  }}
                />

                {user?.avatar && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveAvatar}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-[#1a0f06] border border-gold/30 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 shadow-md z-10 flex items-center justify-center cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </motion.button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name (editable) */}
              <div className="flex items-center gap-2 mb-1.5">
                {editingName ? (
                  <input
                    ref={nameInputRef}
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="text-center text-2xl md:text-3xl font-semibold text-ink dark:text-sand-lt bg-transparent border-b-2 border-gold/30 focus:border-gold/60 outline-none transition-colors px-2 py-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                ) : (
                  <motion.h1
                    className="text-2xl md:text-3xl font-semibold text-ink dark:text-sand-lt cursor-pointer hover:text-gold/80 transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    onClick={() => setEditingName(true)}
                    whileHover={{ scale: 1.01 }}
                  >
                    {user?.name || 'Your Name'}
                  </motion.h1>
                )}
                {!editingName && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-gold/40 hover:text-gold transition-colors p-1"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-1.5 text-mist-dark/50 dark:text-sand-lt/40 text-sm mb-2">
                <Mail size={13} />
                <span>{user?.email || 'email@example.com'}</span>
              </div>

              {/* Member since */}
              {joinedDate && (
                <div className="flex items-center gap-1.5 text-gold/50 dark:text-gold-lt/40 text-xs mt-1"
                  style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                  <Calendar size={11} />
                  <span>Member since {joinedDate}</span>
                </div>
              )}

              {/* Bio */}
              <div className="w-full mt-5">
                <label className="block text-[0.65rem] text-gold/50 dark:text-gold-lt/40 uppercase tracking-widest mb-1.5 text-left"
                  style={{ fontFamily: "'Cinzel', serif" }}>
                  Bio
                </label>
                <textarea
                  value={bioVal}
                  onChange={(e) => setBioVal(e.target.value)}
                  onBlur={handleBioSave}
                  placeholder="Tell us about your journey..."
                  rows={3}
                  className={`${inputBase} resize-none`}
                  style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: 1.7 }}
                />
              </div>
            </div>
          </SectionCard>

          <GoldDivider />

          {/* ═══════════ SOUL ARCHETYPE + WELLNESS SCORE ═══════════ */}
          <SectionCard>
            <SectionTitle>Soul Identity</SectionTitle>
            {/* Archetype display */}
            <div style={{
              padding: '1.1rem 1.4rem',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${archetype.gradient.replace('linear-gradient(135deg,', '').replace(')', '')}20, transparent)`,
              border: `1px solid ${archetype.color}30`,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: 36, filter: `drop-shadow(0 0 12px ${archetype.glow})` }}
              >
                {archetype.emoji}
              </motion.span>
              <div style={{ flex: 1 }}>
                <p className="text-[9px] text-gold/60 uppercase tracking-[0.16em] font-bold font-sans" style={{ marginBottom: 2 }}>Your Soul Type</p>
                <p className="text-xl font-bold" style={{
                  fontFamily: "'Playfair Display', serif",
                  background: archetype.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>{archetype.id}</p>
                <p className="text-xs italic text-ink/60 dark:text-sand-lt/60" style={{ fontFamily: "'Lora', serif", marginTop: 2 }}>
                  {archetype.tagline}
                </p>
                <p className="text-[10px] text-ink/50 dark:text-sand-lt/40 mt-1" style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: 1.5 }}>
                  {archetype.desc}
                </p>
              </div>
            </div>

            {/* Wellness Score */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p className="text-[10px] text-gold/60 uppercase tracking-widest font-bold font-sans">Wellness Score</p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  background: wellnessScore >= 70 ? 'linear-gradient(90deg, #34d399, #10b981)'
                    : wellnessScore >= 40 ? 'linear-gradient(90deg, #c9933a, #e8b96a)'
                    : 'linear-gradient(90deg, #94a3b8, #64748b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                }}>{wellnessScore}<span style={{ fontSize: '0.65rem', opacity: 0.5 }}>/100</span></p>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(201,168,76,0.1)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${wellnessScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  style={{
                    height: '100%', borderRadius: 999,
                    background: wellnessScore >= 70 ? 'linear-gradient(90deg, #34d399, #10b981)'
                      : wellnessScore >= 40 ? 'linear-gradient(90deg, #c9933a, #e8b96a)'
                      : 'linear-gradient(90deg, #94a3b8, #64748b)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '🔥 Streak', value: `${journalStreak}d` },
                  { label: '📖 Entries', value: journal.length },
                  { label: '🌿 Rituals', value: `${habitsCompletedToday}/${habits.length}` },
                  { label: '💧 Hydration', value: `${Math.round(waterPct * 100)}%` },
                ].map(stat => (
                  <div key={stat.label} style={{
                    flex: '1 1 60px',
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.58rem', color: 'rgba(201,168,76,0.6)', margin: 0, letterSpacing: '0.06em' }}>{stat.label}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0', color: dark ? '#f5e6c8' : '#2d1f0e' }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <GoldDivider />

          {/* ═══════════ SECTION 2: Preferences ═══════════ */}
          <SectionCard>
            <SectionTitle icon={Sun}>Preferences</SectionTitle>

            <div className="divide-y divide-gold/10">
              <ToggleSwitch
                checked={dark}
                onChange={toggle}
                iconOn={Moon}
                iconOff={Sun}
                label={dark ? 'Dark Mode' : 'Light Mode'}
                sublabel="Toggle between light and dark themes"
              />

              <ToggleSwitch
                checked={!isMuted}
                onChange={toggleMute}
                iconOn={Volume2}
                iconOff={VolumeX}
                label="Sound Effects"
                sublabel="Crystal chimes, sitar notes, ambient sounds"
              />

              <ToggleSwitch
                checked={notifEnabled}
                onChange={handleNotifToggle}
                iconOn={Bell}
                iconOff={BellOff}
                label="Notifications"
                sublabel="Reminders for rituals and hydration"
              />
            </div>
          </SectionCard>

          <GoldDivider />

          {/* ═══════════ SECTION 3: Account Settings ═══════════ */}
          <SectionCard>
            <SectionTitle icon={Shield}>Account</SectionTitle>

            {/* Location field */}
            <div className="mb-5">
              <label className="block text-[0.65rem] text-gold/50 dark:text-gold-lt/40 uppercase tracking-widest mb-1.5"
                style={{ fontFamily: "'Cinzel', serif" }}>
                Location
              </label>
              <div className="relative group">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
                <input
                  type="text"
                  value={locationVal}
                  onChange={(e) => setLocationVal(e.target.value)}
                  onBlur={handleLocationSave}
                  placeholder="Where are you based?"
                  className={`${inputBase} !pl-10`}
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="border-t border-gold/10 pt-4">
              <button
                onClick={() => setShowPwSection(p => !p)}
                className="flex items-center gap-2 text-sm font-medium text-ink/70 dark:text-sand-lt/60 hover:text-gold transition-colors w-full text-left py-1"
                style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.05em' }}
              >
                <Lock size={14} className="text-gold/50" />
                <span>Change Password</span>
                <motion.span
                  animate={{ rotate: showPwSection ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto text-gold/40"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence>
                {showPwSection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex flex-col gap-3">
                      {/* Current password */}
                      <div>
                        <label className="block text-[0.65rem] text-gold/50 dark:text-gold-lt/40 uppercase tracking-widest mb-1.5"
                          style={{ fontFamily: "'Cinzel', serif" }}>
                          Current Password
                        </label>
                        <div className="relative group">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
                          <input
                            type={showCurrentPw ? 'text' : 'password'}
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            placeholder="••••••••"
                            className={`${inputBase} !pl-10 !pr-10`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-dark/50 hover:text-ink dark:hover:text-white transition-colors"
                          >
                            {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* New password */}
                      <div>
                        <label className="block text-[0.65rem] text-gold/50 dark:text-gold-lt/40 uppercase tracking-widest mb-1.5"
                          style={{ fontFamily: "'Cinzel', serif" }}>
                          New Password
                        </label>
                        <div className="relative group">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
                          <input
                            type={showNewPw ? 'text' : 'password'}
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            placeholder="••••••••"
                            className={`${inputBase} !pl-10 !pr-10`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-dark/50 hover:text-ink dark:hover:text-white transition-colors"
                          >
                            {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm password */}
                      <div>
                        <label className="block text-[0.65rem] text-gold/50 dark:text-gold-lt/40 uppercase tracking-widest mb-1.5"
                          style={{ fontFamily: "'Cinzel', serif" }}>
                          Confirm New Password
                        </label>
                        <div className="relative group">
                          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-dark/60 group-focus-within:text-saffron transition-colors duration-300" />
                          <input
                            type={showNewPw ? 'text' : 'password'}
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            placeholder="••••••••"
                            className={`${inputBase} !pl-10`}
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePasswordChange}
                        className="mt-1 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-saffron to-gold text-white text-sm font-semibold tracking-wide shadow-glow-saffron hover:shadow-lg hover:shadow-saffron/30 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.08em' }}
                      >
                        <Shield size={14} />
                        Update Password
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          <GoldDivider />

          {/* ═══════════ SECTION 4: Danger Zone ═══════════ */}
          <SectionCard className="!border-red-500/10 dark:!border-red-500/8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-red-500/50 text-xs">✦</span>
              <Trash2 size={14} className="text-red-500/50" />
              <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-red-500/70 dark:text-red-400/60"
                style={{ fontFamily: "'Cinzel', serif" }}>
                Danger Zone
              </h3>
            </div>

            <p className="text-sm text-mist-dark/50 dark:text-sand-lt/30 mb-4 leading-relaxed"
              style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
              Once you delete your account, there is no going back. All your rituals, journals, and progress will be permanently removed.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDeleteOpen(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/5 hover:border-red-500/30 transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em' }}
            >
              <Trash2 size={14} />
              Delete Account
            </motion.button>
          </SectionCard>

          {/* Bottom Logout */}
          <motion.div variants={fadeUp} className="text-center pt-2 pb-8">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="inline-flex items-center gap-2 text-sm text-mist-dark/40 dark:text-sand-lt/30 hover:text-saffron dark:hover:text-gold transition-colors"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em', fontSize: '0.72rem' }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </motion.div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </PageLayout>
  )
}
