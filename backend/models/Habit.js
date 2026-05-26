import mongoose from 'mongoose'

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

HabitSchema.index({ userId: 1 })

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema)
