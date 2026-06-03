import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Mail, Calendar, Edit3, Trash2 } from 'lucide-react'
import { useNotif } from '../../components/system/NotificationPopup'

const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm border bg-white/70 backdrop-blur-sm placeholder:text-mist-dark/40 ' +
  'focus:outline-none focus:ring-2 focus:ring-saffron/25 focus:border-saffron/50 transition-all duration-300 ' +
  'dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30 dark:border-gold/15 border-gold/20'

export function ProfileHeaderCard({
  user,
  onUpdateAvatar,
  onRemoveAvatar,
  onUpdateProfile
}) {
  const notif = useNotif()
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [bioVal, setBioVal] = useState('')

  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setNameVal(user.name || '')
      setBioVal(user.bio || '')
    }
  }, [user])

  // Focus name input when editing
  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      const res = await onUpdateAvatar(base64)
      if (res.success) {
        notif('Avatar updated ✦', 'success')
      } else {
        notif(res.error || 'Failed to update avatar', 'error')
      }
    }
    reader.readAsDataURL(file)
  }, [onUpdateAvatar, notif])

  const handleNameSave = useCallback(async () => {
    setEditingName(false)
    if (!nameVal.trim() || nameVal.trim() === user?.name) return
    const res = await onUpdateProfile({ name: nameVal.trim() })
    if (res.success) {
      notif('Name updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update name', 'error')
      setNameVal(user?.name || '')
    }
  }, [nameVal, user, onUpdateProfile, notif])

  const handleBioSave = useCallback(async () => {
    if (bioVal === (user?.bio || '')) return
    const res = await onUpdateProfile({ bio: bioVal })
    if (res.success) {
      notif('Bio updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update bio', 'error')
    }
  }, [bioVal, user, onUpdateProfile, notif])

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'
  const joinedDate = user?.joinedAt || user?.createdAt
    ? new Date(user.joinedAt || user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div
      className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
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
              onClick={async () => {
                const res = await onRemoveAvatar()
                if (res.success) {
                  notif('Avatar removed ✦', 'success')
                } else {
                  notif(res.error || 'Failed to remove avatar', 'error')
                }
              }}
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
    </div>
  )
}
export default ProfileHeaderCard
