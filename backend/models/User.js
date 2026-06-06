import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  xp: { type: Number, default: 0 },
  pranaPoints: { type: Number, default: 0 },
  preferences: {
    theme: { type: String, default: 'light' },
    soundEnabled: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    lastRitualDate: { type: String, default: '' },
    wisdomJarCount: { type: Number, default: 0 },
    wisdomJarDate: { type: String, default: '' },
    hasReadLetter: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false }
  },
  activeSankalpa: { type: mongoose.Schema.Types.Mixed, default: 'calm' },
  dailySankalpa: {
    text: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    dateSet: { type: String, default: '' }
  },
  wisdom: { type: mongoose.Schema.Types.Mixed, default: {} },
  stats: {
    sankalpaDates: { type: [String], default: [] },
    breathingDates: { type: [String], default: [] },
    wisdomDates: { type: [String], default: [] },
    booksOpened: { type: [String], default: [] },
    sunriseDates: { type: [String], default: [] },
    midnightJournalDates: { type: [String], default: [] },
    pagesRead: { type: [String], default: [] }
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
