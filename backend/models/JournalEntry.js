import mongoose from 'mongoose'

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  text: { type: String, required: true },
  mood: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

JournalEntrySchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema)
