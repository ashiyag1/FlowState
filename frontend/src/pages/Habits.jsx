import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWellness } from '../context/WellnessContext'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useAchievements } from '../context/AchievementsContext'
import PageLayout from '../components/ui/PageLayout'
import WaterWidget from '../components/tracker/WaterWidget'
import DailyTasksWidget from '../components/tracker/DailyTasksWidget'
import habitsBg from '../assets/pages/habits_bg.webp'
import { getHinduDetails } from '../utils/hinduCalendar'
import { today as getToday } from '../utils'
import { useNotif } from '../components/system/NotificationPopup'
import { useHomeData } from '../hooks/useHomeData'
import ActiveSadhanaPlayer from '../components/dashboard/ActiveSadhanaPlayer'

// Extracted Subcomponents
import ActiveSadhanasCard from '../components/tracker/Habits/ActiveSadhanasCard'
import LunarCalendarCard from '../components/tracker/Habits/LunarCalendarCard'
import LunarFactCarousel from '../components/tracker/Habits/LunarFactCarousel'

export default function Habits() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { habits, addHabit, deleteHabit, habitDone, toggleHabit, getStreak } = useWellness()
  const { trackEvent } = useAchievements()
  const { playHabitSound } = useSoundEffects()
  const { dark } = useTheme()
  const notif = useNotif()

  const {
    activePractice,
    timerSeconds,
    viewMode,
    isReflectionTime,
    todayRitual,
    userName,
    selectedSankalpa,
    handleBeginActivePractice,
    handleCompleteActivePractice,
    cancelPractice,
    setSankalpaPanelOpen
  } = useHomeData()

  const [calDate, setCalDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date().getDate())
  const [currentInsightIdx, setCurrentInsightIdx] = useState(0)

  const todayStr = getToday()
  const todayDone = habitDone[todayStr] || {}
  const doneCount = habits.filter(h => todayDone[h.id]).length

  const calYear = calDate.getFullYear()
  const calMonth = calDate.getMonth()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const clampedSelectedDay = Math.min(selectedDay, daysInMonth)
  
  const isoForDay = (d) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const bestStreak = habits?.length > 0 ? Math.max(0, ...habits.map(h => getStreak(h.id))) : 0
  const allDoneToday = habits.length > 0 && doneCount === habits.length

  // Selected Day Calculations
  const selectedIso = isoForDay(clampedSelectedDay)
  const selectedHindu = getHinduDetails(selectedIso)
  const selectedDayDone = habitDone[selectedIso] || {}
  const selectedDoneCount = habits.filter(h => selectedDayDone[h.id]).length

  const handleAdd = (habitData) => {
    if (!isAuthenticated) {
      notif('Please sign in to save your rituals ✦', 'info')
      return
    }
    addHabit(habitData)
  }

  const handleToggleHabit = (id, dateKey) => {
    if (!isAuthenticated) {
      notif('Please sign in to track your rituals ✦', 'info')
      return
    }
    const alreadyDone = !!(habitDone[dateKey] || {})[id]
    toggleHabit(id, dateKey)
    if (!alreadyDone) {
      playHabitSound()
      trackEvent('habit_toggled')
    }
  }

  const handleDeleteHabit = (e, id) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      notif('Please sign in to modify rituals ✦', 'info')
      return
    }
    deleteHabit(id)
  }

  return (
    <PageLayout>
      {/* Background Cover */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `url(${habitsBg}) center/cover no-repeat`,
        backgroundAttachment: typeof window !== 'undefined' && window.innerWidth < 768 ? 'scroll' : 'fixed',
        filter: dark ? 'brightness(0.35) saturate(0.9)' : 'brightness(0.92) saturate(1.05)',
        opacity: dark ? 0.95 : 0.8,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: '1650px', width: '96%', margin: '0 auto', padding: '4.5rem 1.2rem 4rem'
      }}>
        
        {/* HERO TITLE */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1 inline-block text-gold text-lg"
          >
            🪷
          </motion.div>
          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: '0.62rem', letterSpacing: '0.3em',
            color: '#E8622A', textTransform: 'uppercase', marginBottom: '0.2rem'
          }}>
            ✦ RHYTHMS OF STILLNESS ✦
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2.5rem',
            fontWeight: 400, color: dark ? '#f0e6d0' : '#2D1F0E', lineHeight: 1.1, margin: '0'
          }}>
            Daily Rhythm &amp; Rituals
          </h1>
        </motion.div>

        {/* FORGIVING CYCLES FULL-WIDTH BANNER */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.02, ease: [0.22, 1, 0.36, 1] } }
          }}
          className="w-full p-2.5 px-4 mb-4 rounded-xl text-xs border flex items-center justify-center gap-2"
          style={{
            background: dark ? 'rgba(20,15,10,0.3)' : '#fdf6ec',
            borderColor: dark ? 'rgba(201,168,76,0.15)' : '#e8d5b0',
            color: dark ? '#fcf6e8' : '#2c1a00',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <span>🌙</span>
          <p className="m-0 text-center">
            Forgiving Cycles — Miss 1 day? It's your <strong className="font-semibold" style={{ color: dark ? '#ffeab8' : '#8B6914' }}>Relax Day</strong>. Miss 2? The cycle resets gently. Be gentle with yourself.
          </p>
        </motion.div>

        {/* BENTO BOX LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          
          {/* LEFT PANEL: ACTIONS */}
          <div className="flex flex-col gap-5 w-full">
            
            {/* Suggested Sadhana Player (Mobile only) */}
            <div className="md:hidden">
              <ActiveSadhanaPlayer
                dark={dark}
                activePractice={activePractice}
                timerSeconds={timerSeconds}
                viewMode={viewMode}
                isReflectionTime={isReflectionTime}
                todayRitual={todayRitual}
                userName={userName}
                selectedSankalpa={selectedSankalpa}
                onStartPractice={handleBeginActivePractice}
                onCompletePractice={handleCompleteActivePractice}
                onCancelPractice={cancelPractice}
                onNavigateJournal={() => navigate('/journal')}
                onOpenSankalpaPanel={() => setSankalpaPanelOpen(true)}
                hideReflection={true}
              />
            </div>

            <ActiveSadhanasCard
              dark={dark}
              habits={habits}
              selectedIso={selectedIso}
              selectedDayDone={selectedDayDone}
              allDoneToday={allDoneToday}
              todayStr={todayStr}
              onToggleHabit={handleToggleHabit}
              onDeleteHabit={handleDeleteHabit}
              onAddHabit={handleAdd}
              getStreak={getStreak}
              bestStreak={bestStreak}
            />

            {/* WATER TRACKER WIDGET */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] } }
              }}
            >
              <WaterWidget />
            </motion.div>

            {/* DAILY TASKS WIDGET */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] } }
              }}
            >
              <DailyTasksWidget selectedIso={selectedIso} />
            </motion.div>
          </div>

          {/* RIGHT PANEL: CONTEXT ONLY */}
          <div className="flex flex-col gap-5 w-full lg:max-w-[320px] lg:ml-auto">
            
            {/* LUNAR CALENDAR DATE PICKER & STATS */}
            <LunarCalendarCard
              dark={dark}
              selectedIso={selectedIso}
              selectedHindu={selectedHindu}
              calDate={calDate}
              selectedDay={clampedSelectedDay}
              habits={habits}
              habitDone={habitDone}
              onSetCalDate={(newDate) => {
                setCalDate(newDate)
                const newYear = newDate.getFullYear()
                const newMonth = newDate.getMonth()
                const maxDays = new Date(newYear, newMonth + 1, 0).getDate()
                setSelectedDay(prev => Math.min(prev, maxDays))
              }}
              onSetSelectedDay={setSelectedDay}
            />

            {/* INTEGRATED LUNAR SCIENCE CAROUSEL */}
            <LunarFactCarousel
              currentInsightIdx={currentInsightIdx}
              onSetInsightIdx={setCurrentInsightIdx}
            />

          </div>

        </div>
      </div>
    </PageLayout>
  )
}
