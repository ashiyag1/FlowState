import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useWellness } from '../context/WellnessContext'
import { pct as calcPct } from '../utils'

import SankalpaCard from '../components/dashboard/SankalpaCard'
import DateCard from '../components/dashboard/DateCard'
import StatCard from '../components/StatCard'
import LotusRow from '../components/LotusRow'
import TambaaVessel from '../icons/TambaaVessel'
import DiyaLamp from '../icons/DiyaLamp'
import BreathingPortal from '../components/BreathingPortal'

import realLotusImg from '../assets/dashboard/real-lotus.webp'
import realDiyaImg from '../assets/dashboard/real-diya.webp'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
})

const FEATURES = [
  { to: '/water', title: 'Water Tracker', desc: 'Log every sip. Watch your progress fill beautifully through the day.', accent: '#7EC8E3' },
  { to: '/habits', title: 'Habit Calendar', desc: 'Build rituals that stick. Track streaks on a beautiful grid calendar.', accent: '#2D6A4F' },
  { to: '/journal', title: 'Daily Journal', desc: 'Capture thoughts, gratitude, and intentions in your calm private space.', accent: '#E87722' },
  { to: '/quotes', title: 'Wisdom Quotes', desc: 'Fresh quotes from Chanakya, Vivekananda, Gita & Indian sages — daily.', accent: '#c9a84c' },
]

function LotusDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '2.8rem auto', maxWidth: 560 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      <img src={realLotusImg} alt="" aria-hidden style={{ width: 32, height: 32, objectFit: 'contain', opacity: 0.5 }} />
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
    </div>
  )
}

function DiyaDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '2.8rem auto', maxWidth: 480 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,200,80,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <DiyaLamp size={34} />
      </div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
    </div>
  )
}

export default function DailyFlow() {
  const { dark } = useTheme()
  const { waterGoal, todayTotal, habits, todayHabitDone } = useWellness()
  const waterPct = calcPct(todayTotal, waterGoal)
  const doneCount = habits.filter(h => todayHabitDone[h.id]).length

  return (
    <section>
      {/* ── SECTION INTRO ── */}
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '2.2rem' }}
      >
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.28em',
          color: dark ? '#c9b080' : '#8B5E2F', textTransform: 'uppercase', marginBottom: 8,
        }}>
          {'\u2726'} Your Daily Flow {'\u2726'}
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.6rem,3.8vw,2.4rem)',
          fontWeight: 500, color: dark ? '#e8d9b5' : '#5C3D1E', lineHeight: 1.3, maxWidth: 600,
          margin: '0 auto', fontStyle: 'italic', letterSpacing: '0.02em',
        }}>
          A calm sacred space reflecting your inner rhythm.
        </h2>
      </motion.div>

      <LotusDivider />

      {/* ── BREATHING PORTAL (full-width) ── */}
      <motion.div
        variants={fadeUp(0.03)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <BreathingPortal />
      </motion.div>

      {/* ── SANKALPA (full-width) ── */}
      <motion.div
        variants={fadeUp(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{ marginBottom: '2.8rem' }}
      >
        <SankalpaCard />
      </motion.div>

      {/* ── DAILY PRACTICE GRID (three-column spread) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.2rem] mb-[1.2rem] items-stretch">
        <motion.div
          variants={fadeUp(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <DateCard />
        </motion.div>

        <motion.div
          variants={fadeUp(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <TambaaVessel
            todayTotal={todayTotal}
            waterGoal={waterGoal}
            waterPct={waterPct}
          />
        </motion.div>

        <motion.div
          variants={fadeUp(0.16)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <StatCard
            type="habits"
            icon={
              <span className="fs-real-icon fs-real-icon--lotus">
                <img src={realLotusImg} alt="Pink lotus flower" />
              </span>
            }
            value={doneCount}
            unit={`/ ${habits.length}`}
            label="Habits completed"
            sub="Keep going, you're doing great!"
            to="/habits"
            bottomSlot={<LotusRow done={doneCount} total={habits.length} />}
          />
        </motion.div>
      </div>

      <DiyaDivider />

      {/* ── EXPLORE (staggered editorial features) ── */}
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{ marginBottom: '1.8rem', textAlign: 'center' }}
      >
        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: '0.68rem', letterSpacing: '0.28em',
          color: dark ? '#c9b080' : '#8B5E2F', textTransform: 'uppercase', marginBottom: 4,
        }}>
          {'\u2726'} Explore Your Practice {'\u2726'}
        </p>
        <p style={{
          fontFamily: "'Lora', serif", fontSize: '0.85rem', fontStyle: 'italic',
          color: dark ? '#7a6a50' : '#a09070',
        }}>
          Discover tools to nurture your wellness journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.to}
            variants={fadeUp(i * 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Link to={f.to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <div 
                className="fs-gold-corner-card"
                style={{
                  position: 'relative',
                  padding: '1.5rem 1.25rem',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${f.accent}, transparent)`,
                }} />
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '1.22rem',
                  fontWeight: 600, color: dark ? '#e8d9b5' : '#5C3D1E',
                  margin: '0 0 0.4rem', lineHeight: 1.3,
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: "'Lora', serif", fontSize: '0.78rem',
                  color: dark ? '#c9b080' : '#8B5E2F',
                  lineHeight: 1.6, margin: '0 0 0.8rem',
                }}>{f.desc}</p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: "'Cinzel', serif", fontSize: '0.62rem',
                  fontWeight: 700, color: f.accent, letterSpacing: '0.08em',
                }}>
                  Explore <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── CLOSING: AFFIRMATION ── */}
      <motion.div
        variants={fadeUp(0.20)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{
          marginTop: '2.5rem',
          padding: '2rem 0 0.5rem',
          borderTop: dark
            ? '1px solid rgba(201,168,76,0.08)'
            : '1px solid rgba(201,168,76,0.16)',
        }}
      >
        <div style={{
          padding: '1.2rem 1.6rem',
          borderRadius: '16px',
          background: dark
            ? 'rgba(40,30,15,0.35)'
            : 'rgba(201,168,76,0.06)',
          border: dark ? '1px solid rgba(201,168,76,0.08)' : '1px solid rgba(201,168,76,0.14)',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            fontStyle: 'italic',
            color: dark ? '#e8d9b5' : '#5C3D1E',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            "Peace flows when you do."
          </p>
        </div>
      </motion.div>

      {/* ── HOVER STYLES ── */}
      <style>{`
        .fs-daily-feature-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 12px 40px rgba(92,61,30,0.1);
        }
        .dark .fs-daily-feature-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
      `}</style>
    </section>
  )
}
