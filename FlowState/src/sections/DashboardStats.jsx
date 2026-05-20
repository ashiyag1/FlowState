import { motion } from 'framer-motion'
import { useWellness } from '../context/WellnessContext'
import { pct as calcPct } from '../utils'

import StatCard from '../components/StatCard'
import LotusRow from '../components/LotusRow'
import SectionHeading from '../components/SectionHeading'
import OrnateDivider from '../components/OrnateDivider'

import SankalpaCard from '../components/dashboard/SankalpaCard'
import DateCard from '../components/dashboard/DateCard'

import realLotusImg from '../assets/dashboard/real-lotus.png'

import { useSoundEffects } from '../hooks/useSoundEffects'

import TambaaVessel from '../icons/TambaaVessel'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 26 },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  },
})

export default function DashboardStats() {
  const {
    waterGoal,
    todayTotal,
    habits,
    todayHabitDone,
  } = useWellness()

  const {
    playHydrationSound,
    playHabitSound,
  } = useSoundEffects()

  const waterPct = calcPct(todayTotal, waterGoal)

  const doneCount =
    habits.filter(h => todayHabitDone[h.id]).length

  return (
    <section style={{ marginBottom: '3.5rem' }}>
      <motion.div
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionHeading
          eyebrow="Today at a Glance"
          title="Your day,"
          accent="beautifully tracked."
        />
      </motion.div>

      <OrnateDivider />

      <div className="fs-dashboard-stats-grid">

        {/* SANKALPA — full-width feature */}
        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ gridColumn: '1 / -1' }}
        >
          <SankalpaCard />
        </motion.div>

        {/* WATER */}
        <TambaaVessel
          todayTotal={todayTotal}
          waterGoal={waterGoal}
          waterPct={waterPct}
          onClick={playHydrationSound}
        />

        {/* HABITS */}
        <motion.div
          variants={fadeUp(0.10)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <StatCard
            type="habits"
            icon={
              <span className="fs-real-icon fs-real-icon--lotus">
                <img
                  src={realLotusImg}
                  alt="Pink lotus flower"
                />
              </span>
            }
            value={doneCount}
            unit={`/ ${habits.length}`}
            label="Habits completed"
            sub="Keep going, you're doing great!"
            to="/habits"
            onClick={playHabitSound}
            bottomSlot={
              <LotusRow
                done={doneCount}
                total={habits.length}
              />
            }
          />
        </motion.div>

        {/* DATE */}
        <motion.div
          variants={fadeUp(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <DateCard />
        </motion.div>

      </div>
    </section>
  )
}