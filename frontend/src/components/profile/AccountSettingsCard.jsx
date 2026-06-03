import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, MapPin, Lock, Eye, EyeOff } from 'lucide-react'
import { useNotif } from '../../components/system/NotificationPopup'

const inputBase =
  'w-full rounded-xl px-4 py-3 text-sm border bg-white/70 backdrop-blur-sm placeholder:text-mist-dark/40 ' +
  'focus:outline-none focus:ring-2 focus:ring-saffron/25 focus:border-saffron/50 transition-all duration-300 ' +
  'dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/30 dark:border-gold/15 border-gold/20'

export function AccountSettingsCard({
  user,
  onUpdateProfile,
  onChangePassword
}) {
  const notif = useNotif()
  const [locationVal, setLocationVal] = useState('')
  const [showPwSection, setShowPwSection] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  useEffect(() => {
    if (user) {
      setLocationVal(user.location || '')
    }
  }, [user])

  const handleLocationSave = async () => {
    if (locationVal === (user?.location || '')) return
    const res = await onUpdateProfile({ location: locationVal })
    if (res.success) {
      notif('Location updated ✦', 'success')
    } else {
      notif(res.error || 'Failed to update location', 'error')
    }
  }

  const handlePasswordChange = async () => {
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
    const res = await onChangePassword(currentPw, newPw)
    if (res.success) {
      notif('Password changed successfully ✦', 'success')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setShowPwSection(false)
    } else {
      notif(res.error || 'Failed to change password', 'error')
    }
  }

  return (
    <div
      className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-gold/50 text-xs">✦</span>
        <Shield size={15} className="text-gold/60" />
        <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-gold dark:text-gold-lt"
          style={{ fontFamily: "'Cinzel', serif" }}>
          Account
        </h3>
      </div>

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
    </div>
  )
}
export default AccountSettingsCard
