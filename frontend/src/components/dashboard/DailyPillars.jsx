import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import lotusImg from '../../assets/dashboard/lotus.png'

export function DailyPillars({
  dark,
  habitStreak,
  ritualDone,
  waterGoalMet,
  journalToday,
  wisdomRead,
  todayTotal,
  waterGoal,
  onTogglePractice,
  onLogWater,
  onToggleJournal,
  onToggleWisdom
}) {
  const dailyProgress = [ritualDone, waterGoalMet, journalToday, wisdomRead].filter(Boolean).length
  const allDoneToday = dailyProgress === 4

  // Falling lotus petals state for 100% completion celebration (active for 5 seconds)
  const [showCelebration, setShowCelebration] = useState(false)
  const [petals, setPetals] = useState([])

  useEffect(() => {
    if (allDoneToday) {
      setShowCelebration(true)
      const newPetals = Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 12 + Math.random() * 14,
        delay: Math.random() * 1.8,
        duration: 2.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        drift: -15 + Math.random() * 30
      }))
      setPetals(newPetals)

      // Stop the celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setShowCelebration(false)
      setPetals([])
    }
  }, [allDoneToday])

  const glassCardStyle = {
    background: dark ? 'rgba(20, 13, 6, 0.8)' : 'rgba(255, 252, 243, 0.9)',
    border: dark ? '1px solid rgba(200, 169, 110, 0.22)' : '1px solid rgba(200, 169, 110, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 30px rgba(139,105,20,0.07)',
    transition: 'all 0.3s ease',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        ...glassCardStyle,
        borderRadius: '24px',
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: allDoneToday
          ? 'radial-gradient(ellipse at 50% 0%, rgba(200,169,110,0.18) 0%, transparent 60%)'
          : 'radial-gradient(ellipse at 80% 0%, rgba(232,119,34,0.1) 0%, transparent 55%)',
        transition: 'background 1s ease',
      }} />

      {/* Falling Lotus Petals Celebration */}
      <AnimatePresence>
        {showCelebration && petals.map((p) => (
          <motion.div
            key={p.id}
            initial={{ top: '-10%', left: `${p.x}%`, rotate: p.rotation, opacity: 0 }}
            animate={{
              top: '110%',
              left: `${p.x + p.drift}%`,
              rotate: p.rotation + 360,
              opacity: [0, 1, 1, 0]
            }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'linear',
              repeat: Infinity
            }}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 10,
              fontSize: `${p.size}px`,
              userSelect: 'none'
            }}
          >
            🌸
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Always display the progress tracker state */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Streak displays on left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.img
                src={lotusImg}
                alt="Streak Lotus"
                initial={{ scale: 0.2, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{
                  type: 'spring',
                  stiffness: 160,
                  damping: 10
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(232, 98, 42, 0.15))'
                }}
              />
              <span className="font-display text-2xl font-bold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>
                {habitStreak || 0}
              </span>
            </div>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? '#c8a96e' : '#8b7355', fontWeight: 700, marginTop: '4px', fontFamily: 'sans-serif' }}>
              DAY STREAK
            </span>
          </div>

          <div style={{ width: '1px', height: '48px', background: 'rgba(200,169,110,0.2)', flexShrink: 0 }} />

          {/* 4 checklist tracker columns */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center', minWidth: '240px' }}>
            {[
              { label: 'PRACTICE', done: ritualDone, emoji: '🧘', action: onTogglePractice },
              { label: 'WATER', done: waterGoalMet, emoji: '💧', action: onLogWater },
              { label: 'JOURNAL', done: journalToday, emoji: '✍️', action: onToggleJournal },
              { label: 'WISDOM', done: wisdomRead, emoji: '📖', action: onToggleWisdom }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  whileHover={{ scale: 1.1, cursor: 'pointer' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.action}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    border: item.done
                      ? '1.5px solid #c9933a'
                      : '1px solid rgba(200,169,110,0.22)',
                    background: item.done
                      ? 'rgba(201,147,58,0.14)'
                      : 'transparent',
                    color: item.done ? '#c8a96e' : 'rgba(200,169,110,0.4)',
                    transition: 'all 0.3s'
                  }}
                >
                  {item.done ? '✓' : item.emoji}
                </motion.div>
                <span style={{ fontSize: '9px', fontWeight: 600, color: item.done ? '#c8a96e' : (dark ? 'rgba(245,230,200,0.4)' : '#8b7355'), fontFamily: 'sans-serif' }}>
                  {item.label}
                </span>
                {item.label === 'WATER' && (
                  <span style={{ fontSize: '9px', color: item.done ? '#c8a96e' : (dark ? 'rgba(245,230,200,0.5)' : '#8b7355'), fontFamily: 'sans-serif', marginTop: '2px' }}>
                    {todayTotal}/{waterGoal}ml
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom dynamic status bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          marginTop: '4px',
          fontSize: '11px',
          color: allDoneToday
            ? (dark ? '#ffeab8' : '#3d2600')
            : (dark ? 'rgba(245,230,200,0.5)' : '#8b7355'),
          fontFamily: 'sans-serif',
          borderTop: '1px solid rgba(200,169,110,0.1)',
          paddingTop: '12px',
          fontWeight: allDoneToday ? 600 : 400,
          textAlign: 'center',
        }}>
          {allDoneToday ? (
            <span>✨ Beautifully done! All 4 daily pillars completed · streak updated to {habitStreak || 1} days! 🪷</span>
          ) : (
            <span>💡 Complete these 4 daily pillars to maintain your streak. Click any circle to log progress.</span>
          )}
        </div>
      </div>

      {/* Bottom Progress Line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: dark ? 'rgba(200, 169, 110, 0.12)' : 'rgba(200, 169, 110, 0.2)',
      }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${(dailyProgress / 4) * 100}%` }}
          transition={{ type: 'spring', stiffness: 70, damping: 15 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #c9933a 0%, #e8622a 100%)',
            boxShadow: '0 0 6px rgba(232, 98, 42, 0.4)'
          }}
        />
      </div>
    </motion.div>
  )
}
export default DailyPillars
