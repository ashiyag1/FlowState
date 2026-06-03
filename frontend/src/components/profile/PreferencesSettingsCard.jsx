import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Volume2, VolumeX, Bell, BellOff } from 'lucide-react'

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

export function PreferencesSettingsCard({
  dark,
  toggleTheme,
  isMuted,
  toggleMute,
  notifEnabled,
  onToggleNotifications
}) {
  return (
    <div
      className="rounded-2xl border border-gold/15 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl shadow-xl p-6 md:p-8"
      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 60px rgba(212,168,42,0.03)' }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-gold/50 text-xs">✦</span>
        <Sun size={15} className="text-gold/60" />
        <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-gold dark:text-gold-lt"
          style={{ fontFamily: "'Cinzel', serif" }}>
          Preferences
        </h3>
      </div>

      <div className="divide-y divide-gold/10">
        <ToggleSwitch
          checked={dark}
          onChange={toggleTheme}
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
          onChange={onToggleNotifications}
          iconOn={Bell}
          iconOff={BellOff}
          label="Notifications"
          sublabel="Reminders for rituals and hydration"
        />
      </div>
    </div>
  )
}
export default PreferencesSettingsCard
