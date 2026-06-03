import { useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useNotif } from '../components/system/NotificationPopup'
import PageLayout from '../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useWellness } from '../context/WellnessContext'
import { computeArchetype, computeWellnessScore } from '../utils/soulArchetype'

// Extracted Subcomponents
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard'
import PranaTierCard from '../components/profile/PranaTierCard'
import SoulIdentityCard from '../components/profile/SoulIdentityCard'
import PreferencesSettingsCard from '../components/profile/PreferencesSettingsCard'
import AccountSettingsCard from '../components/profile/AccountSettingsCard'
import DangerZoneCard from '../components/profile/DangerZoneCard'

const getLocalYYYYMMDD = (d = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

export default function ProfilePage() {
  const { user, updateProfile, updateAvatar, changePassword, deleteAccount, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const { isMuted, toggleMute } = useSoundEffects()
  const { journal, habitDone, habits, todayTotal, waterGoal } = useWellness()
  const notif = useNotif()
  const navigate = useNavigate()

  // Archetype + wellness score
  const { archetype } = useMemo(() => computeArchetype(journal), [journal])
  const todayStr = getLocalYYYYMMDD()
  const habitsCompletedToday = Object.keys(habitDone[todayStr] || {}).length
  
  const journalCycle = useMemo(() => {
    const dates = [...new Set(journal.map(e => e.date))].sort().reverse()
    let count = 0
    let expectedDates = []
    
    for (let i = 0; i < dates.length * 2 + 2; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      expectedDates.push(getLocalYYYYMMDD(d))
    }
    
    let expectedIdx = 0
    if (!dates.includes(expectedDates[expectedIdx])) {
      expectedIdx++
      if (!dates.includes(expectedDates[expectedIdx])) {
        expectedIdx++
      }
    }
    
    if (dates.includes(expectedDates[expectedIdx])) {
      while (true) {
        if (dates.includes(expectedDates[expectedIdx])) {
          count++
          expectedIdx++
        } else {
          if (dates.includes(expectedDates[expectedIdx + 1])) {
            expectedIdx++ // skip forgiven rest day
          } else {
            break // 2-day gap breaks cycle
          }
        }
      }
    }
    return count
  }, [journal])

  const waterPct = waterGoal > 0 ? Math.min(todayTotal / waterGoal, 1) : 0
  const wellnessScore = useMemo(() => computeWellnessScore({
    journalStreak: journalCycle,
    totalJournalEntries: journal.length,
    habitsCompletedToday,
    totalHabits: habits.length,
    waterPct,
  }), [journalCycle, journal.length, habitsCompletedToday, habits.length, waterPct])

  const handleProfileUpdate = useCallback(async (data) => {
    return await updateProfile(data)
  }, [updateProfile])

  const handleAvatarUpdate = useCallback(async (base64) => {
    return await updateAvatar(base64)
  }, [updateAvatar])

  const handleRemoveAvatar = useCallback(async () => {
    return await updateAvatar('')
  }, [updateAvatar])

  const handlePasswordChange = useCallback(async (currentPw, newPw) => {
    return await changePassword(currentPw, newPw)
  }, [changePassword])

  const handleDeleteAccount = useCallback(async () => {
    const res = await deleteAccount()
    if (res.success) {
      notif('Account deleted. Farewell ✦', 'info')
      navigate('/')
    } else {
      notif(res.error || 'Failed to delete account', 'error')
    }
  }, [deleteAccount, notif, navigate])

  const notifEnabled = user?.preferences?.notificationsEnabled !== false
  const handleNotifToggle = useCallback(async () => {
    const newVal = !notifEnabled
    const res = await updateProfile({ preferences: { notificationsEnabled: newVal } })
    if (!res.success) {
      notif(res.error || 'Failed to update preferences', 'error')
    }
  }, [notifEnabled, updateProfile, notif])

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
          {/* PROFILE HEADER CARD */}
          <motion.div variants={fadeUp}>
            <ProfileHeaderCard
              user={user}
              onUpdateAvatar={handleAvatarUpdate}
              onRemoveAvatar={handleRemoveAvatar}
              onUpdateProfile={handleProfileUpdate}
            />
          </motion.div>

          <GoldDivider />

          {/* PRANA & XP PROGRESS CARD */}
          <motion.div variants={fadeUp}>
            <PranaTierCard
              dark={dark}
              user={user}
            />
          </motion.div>

          <GoldDivider />

          {/* SOUL IDENTITY & SCORE CARD */}
          <motion.div variants={fadeUp}>
            <SoulIdentityCard
              dark={dark}
              archetype={archetype}
              wellnessScore={wellnessScore}
              journalCycle={journalCycle}
              totalJournalEntries={journal.length}
              habitsCompletedToday={habitsCompletedToday}
              totalHabits={habits.length}
              waterPct={waterPct}
            />
          </motion.div>

          <GoldDivider />

          {/* PREFERENCES SWITCHES CARD */}
          <motion.div variants={fadeUp}>
            <PreferencesSettingsCard
              dark={dark}
              toggleTheme={toggle}
              isMuted={isMuted}
              toggleMute={toggleMute}
              notifEnabled={notifEnabled}
              onToggleNotifications={handleNotifToggle}
            />
          </motion.div>

          <GoldDivider />

          {/* ACCOUNT SECURITY CARD */}
          <motion.div variants={fadeUp}>
            <AccountSettingsCard
              user={user}
              onUpdateProfile={handleProfileUpdate}
              onChangePassword={handlePasswordChange}
            />
          </motion.div>

          <GoldDivider />

          {/* IRREVERSIBLE DANGER ZONE CARD */}
          <motion.div variants={fadeUp}>
            <DangerZoneCard
              onDeleteAccount={handleDeleteAccount}
            />
          </motion.div>

          {/* Bottom Logout */}
          <motion.div variants={fadeUp} className="text-center pt-2 pb-8">
            <button
              onClick={() => { logout(); navigate('/') }}
              className="inline-flex items-center gap-2 text-sm text-mist-dark/40 dark:text-sand-lt/30 hover:text-saffron dark:hover:text-gold transition-colors"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.06em', fontSize: '0.72rem' }}
            >
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
