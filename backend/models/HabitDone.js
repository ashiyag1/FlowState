import mongoose from 'mongoose'

const HabitDoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  done: { type: Map, of: { type: Map, of: String }, default: {} } // date -> { habitId: time }
})

export default mongoose.models.HabitDone || mongoose.model('HabitDone', HabitDoneSchema)
