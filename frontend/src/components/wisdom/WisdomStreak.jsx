import { useMemo } from 'react'
import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'

const MILESTONES = [
  { days: 3, emoji: '🌱', label: 'Seed planted' },
  { days: 7, emoji: '🌿', label: 'Growing steady' },
  { days: 14, emoji: '🌳', label: 'Rooted' },
  { days: 21, emoji: '🔥', label: 'On fire' },
  { days: 30, emoji: '👑', label: 'Legendary' },
  { days: 60, emoji: '🏛️', label: 'Timeless' },
  { days: 100, emoji: '🌟', label: 'Enlightened' },
]

function getMilestone(count) {
  let reached = null
  let next = MILESTONES[0]
  for (const m of MILESTONES) {
    if (count >= m.days) reached = m
  }
  for (let i = 0; i < MILESTONES.length; i++) {
    if (count < MILESTONES[i].days) { next = MILESTONES[i]; break }
  }
  return { reached, next }
}

export default function WisdomStreak() {
  const { getStreakDays, getStreakCount } = useWisdom()
  const { dark } = useTheme()
  const streakDays = getStreakDays()
  const count = getStreakCount()
  const { reached, next } = useMemo(() => getMilestone(count), [count])
  const weeklyActive = streakDays.filter(d => d.done).length
  const progressToNext = next ? Math.round((count / next.days) * 100) : 100

  const getMessage = () => {
    if (count >= 30) return { head: 'Unstoppable', sub: `${count} days. You're literally built different.` }
    if (count >= 21) return { head: 'On Fire', sub: `${count}-day streak. Pure discipline.` }
    if (count >= 14) return { head: 'Locked In', sub: `${count} days strong. This is elite.` }
    if (count >= 7) return { head: 'Getting Solid', sub: `${count}-day streak. Momentum is real.` }
    if (count >= 3) return { head: 'Building', sub: `${count} days in a row. Keep showing up.` }
    if (count >= 1) return { head: 'Day 1 Energy', sub: 'Every streak starts somewhere. You\'re in motion.' }
    return { head: 'Ready?', sub: 'Open a book today to start your streak.' }
  }

  const msg = getMessage()

  return (
    <div style={{
      borderRadius: 16,
      background: dark ? 'rgba(15,10,5,0.5)' : 'rgba(255,252,246,0.7)',
      border: `1px solid ${dark ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.18)'}`,
      overflow: 'hidden',
    }}>
      {/* Streak Hero */}
      <div style={{
        padding: '16px 14px 10px',
        textAlign: 'center',
        background: dark
          ? 'linear-gradient(180deg, rgba(201,147,58,0.08) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(201,147,58,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${dark ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.12)'}`,
      }}>
        <div style={{
          fontSize: count >= 7 ? '1.6rem' : '1.3rem',
          lineHeight: 1, marginBottom: 2,
          filter: count >= 7 ? 'drop-shadow(0 0 8px rgba(232,98,42,0.4))' : 'none',
        }}>
          {count >= 21 ? '🔥' : count >= 7 ? '🔥' : count >= 3 ? '💪' : '🌱'}
        </div>
        <div style={{
          fontSize: '1.5rem', fontWeight: 800,
          background: count >= 14
            ? 'linear-gradient(135deg, #E8622A, #C9933A)'
            : 'none',
          WebkitBackgroundClip: count >= 14 ? 'text' : 'unset',
          WebkitTextFillColor: count >= 14 ? 'transparent' : 'unset',
          color: count >= 14 ? 'transparent' : (dark ? '#FBF6EE' : '#1C1208'),
          lineHeight: 1.2,
        }}>
          {count}
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: '9px', letterSpacing: '0.12em',
          textTransform: 'uppercase', fontWeight: 700,
          color: dark ? 'rgba(201,147,58,0.7)' : 'rgba(139,94,47,0.6)',
        }}>
          day streak
        </div>

        {/* Message */}
        <p style={{
          fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.7rem',
          color: dark ? 'rgba(252,246,232,0.5)' : 'rgba(92,61,30,0.5)',
          margin: '6px 0 0', lineHeight: 1.3,
        }}>
          {msg.sub}
        </p>
      </div>

      {/* Milestone progress */}
      {next && (
        <div style={{ padding: '10px 14px 6px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,
          }}>
            <span style={{
              fontSize: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: dark ? 'rgba(201,176,128,0.4)' : 'rgba(139,94,47,0.4)',
            }}>
              {reached ? reached.emoji : '🌱'} {reached ? reached.label : 'Starting'} &rarr; {next.emoji} {next.label}
            </span>
            <span style={{
              fontSize: '8px', fontWeight: 600,
              color: dark ? 'rgba(201,147,58,0.5)' : 'rgba(139,94,47,0.45)',
            }}>
              {count}/{next.days} days
            </span>
          </div>
          <div style={{
            height: 4, borderRadius: 2, overflow: 'hidden',
            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${progressToNext}%`,
              background: progressToNext >= 80
                ? 'linear-gradient(90deg, #C9933A, #E8B96A)'
                : progressToNext >= 40
                  ? 'linear-gradient(90deg, #E8622A, #C9933A)'
                  : 'linear-gradient(90deg, rgba(201,147,58,0.3), rgba(201,147,58,0.5))',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Weekly Calendar Strip */}
      <div style={{ padding: '8px 10px 12px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,
        }}>
          <span style={{
            fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: dark ? 'rgba(201,176,128,0.35)' : 'rgba(139,94,47,0.35)',
          }}>
            This Week
          </span>
          <span style={{
            fontSize: '7px', fontWeight: 600,
            color: dark ? 'rgba(201,147,58,0.4)' : 'rgba(139,94,47,0.35)',
          }}>
            {weeklyActive}/7 active
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {streakDays.map((day, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8px', fontWeight: 700,
                background: day.done
                  ? 'linear-gradient(135deg, #C9933A, #E8B96A)'
                  : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                border: `1.5px solid ${
                  day.done ? '#C9933A' :
                      (dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)')
                }`,
                color: day.done ? '#fff' : 'transparent',
                boxShadow: day.done ? '0 0 8px rgba(201,147,58,0.25)' : 'none',
                opacity: day.future ? 0.4 : 1,
              }}>
                {day.done ? '✓' : ''}
              </div>
              <span style={{
                fontSize: '6px', fontWeight: 600,
                opacity: day.future ? 0.4 : 1,
                color: day.done
                  ? (dark ? 'rgba(201,147,58,0.5)' : 'rgba(139,94,47,0.4)')
                  : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'),
              }}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
