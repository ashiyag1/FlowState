import User from './models/User.js'
import WaterLog from './models/WaterLog.js'
import Habit from './models/Habit.js'
import HabitDone from './models/HabitDone.js'
import JournalEntry from './models/JournalEntry.js'
import Badge from './models/Badge.js'
import UserBadge from './models/UserBadge.js'

// Re-export Mongoose schemas & models for routes
export { User, WaterLog, Habit, HabitDone, JournalEntry, Badge, UserBadge }

// Re-export DEFAULT_BADGES configuration
export { DEFAULT_BADGES } from './db/badgesConfig.js'

// Re-export connectDB connection routine
export { connectDB } from './db/connection.js'

// Re-export User Repository methods
export {
  dbCreateUser,
  dbFindUserByEmail,
  dbFindUserById,
  dbUpdateUserProfile,
  dbUpdateUserAvatar,
  dbChangePassword,
  dbDeleteUser,
  dbAdjustUserPoints,
  dbUpdateUserStats
} from './db/userRepository.js'

// Re-export Water Repository methods
export {
  dbGetWater,
  dbSaveWaterGoal,
  dbAddWaterEntry,
  dbRemoveWaterEntry,
  dbClearWaterToday
} from './db/waterRepository.js'

// Re-export Habit Repository methods
export {
  dbGetHabits,
  dbAddHabit,
  dbDeleteHabit,
  dbToggleHabit
} from './db/habitRepository.js'

// Re-export Journal Repository methods
export {
  dbGetJournal,
  dbAddJournalEntry,
  dbDeleteJournalEntry,
  dbGetMoodTrends
} from './db/journalRepository.js'

// Re-export Badge Repository methods
export {
  dbGetBadges,
  dbGetUserBadges,
  dbSaveUserBadge,
  dbSaveUserBadges
} from './db/badgeRepository.js'
