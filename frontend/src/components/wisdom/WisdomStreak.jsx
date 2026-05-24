import { useWisdom } from '../../context/WisdomContext'
import { useTheme } from '../../context/ThemeContext'

export default function WisdomStreak() {
  const { getStreakDays, getStreakCount } = useWisdom()
  const { dark } = useTheme()
  const streakDays = getStreakDays()
  const count = getStreakCount()

  return (
    <div className="card bg-white/60 dark:bg-white/[0.03] border-gold/20 dark:border-gold/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 select-none">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-xl animate-bounce">🔥</span>
        <div>
          <div className="text-base font-extrabold text-sandalwood dark:text-gold leading-none">
            {count} Day Streak
          </div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-mist-dark/60 dark:text-ocean-lt/40 mt-1">
            Keep the flame alive
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 justify-between">
        {streakDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border
                ${day.done 
                  ? 'bg-gradient-to-br from-gold to-gold/70 border-gold text-white dark:text-ink shadow-sm' 
                  : 'bg-black/5 dark:bg-white/[0.02] border-gold/15 dark:border-gold/5 text-mist-dark/45 dark:text-ocean-lt/30'
                }`}
            >
              {day.done ? '✓' : day.label[0]}
            </div>
            <span className="text-[9px] font-bold text-mist-dark/50 dark:text-ocean-lt/35">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}