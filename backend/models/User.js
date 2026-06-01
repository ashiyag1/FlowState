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
    notificationsEnabled: { type: Boolean, default: true }
  },
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
