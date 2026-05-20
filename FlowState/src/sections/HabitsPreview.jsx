import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import SectionHeading from '../components/SectionHeading'
import OrnateDivider from '../components/OrnateDivider'

function HabitRow({ habit, done, dark }) {
  return (
    <div className="fs-habit-row">
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        background: done ? 'linear-gradient(135deg, #2D6A4F, #1B4332)' : 'transparent',
        border: done ? 'none' : '2px solid rgba(201,168,76,0.32)',
        color: 'white',
        transition: 'all 0.3s',
        transform: done ? 'scale(1.1)' : 'scale(1)',
      }}>
        {done && '✓'}
      </div>
      <span style={{
        flex: 1,
        fontSize: 14,
        fontFamily: "'Lora', serif",
        color: done ? (dark ? 'rgba(200,180,140,0.3)' : 'rgba(92,61,30,0.38)') : (dark ? '#c9b080' : '#5C3D1E'),
        textDecoration: done ? 'line-through' : 'none',
      }}>
        {habit.icon} {habit.name}
      </span>
      {done && (
        <span style={{
          fontSize: 10,
          color: dark ? '#4a9a6a' : '#2D6A4F',
          fontWeight: 700,
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.1em',
        }}>
          done ✦
        </span>
      )}
    </div>
  )
}

export default function HabitsPreview() {
  const { dark } = useTheme()
  const { habits, todayHabitDone } = useWellness()

  if (!habits.length) return null

  const doneCount   = habits.filter(h => todayHabitDone[h.id]).length
  const visibleList = habits.slice(0, 5)
  const remaining   = habits.length - 5

  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1 }}
      style={{ marginBottom: '3.5rem' }}
    >
      <SectionHeading
        eyebrow="Habits & Streaks"
        title="Today's"
        accent="practice."
        accentColor={dark ? '#4a9a6a' : '#2D6A4F'}
      />
      <OrnateDivider symbol="🌸" />

      <div style={{
        background: dark ? 'rgba(40,30,15,0.5)' : 'rgba(253,246,227,0.72)',
        borderRadius: 20,
        border: dark ? '1px solid rgba(201,168,76,0.1)' : '1px solid rgba(201,168,76,0.28)',
        padding: '1.5rem',
        boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(92,61,30,0.09)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.3rem',
              color: dark ? '#e8d9b5' : '#5C3D1E',
              fontWeight: 600,
              margin: 0,
            }}>
              Today's Habits
            </h3>
            <p style={{
              fontSize: 11,
              color: dark ? '#c9b080' : '#8B5E2F',
              fontFamily: "'Lora', serif",
              margin: '2px 0 0',
            }}>
              {doneCount} of {habits.length} completed
            </p>
          </div>
          <Link
            to="/habits"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 10,
              color: dark ? '#c9b080' : '#8B5E2F',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              padding: '5px 12px',
              borderRadius: 999,
              border: dark ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(201,168,76,0.38)',
              background: dark ? 'rgba(40,30,15,0.5)' : 'rgba(201,168,76,0.09)',
            }}
          >
            View All →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleList.map(habit => (
            <HabitRow key={habit.id} habit={habit} done={!!todayHabitDone[habit.id]} dark={dark} />
          ))}
          {remaining > 0 && (
            <Link
              to="/habits"
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: dark ? '#c9b080' : '#8B5E2F',
                fontFamily: "'Lora', serif",
                fontStyle: 'italic',
                textDecoration: 'none',
                padding: '6px',
              }}
            >
              +{remaining} more — view all →
            </Link>
          )}
        </div>
      </div>
    </motion.section>
  )
}
