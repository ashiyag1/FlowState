import mongoose from 'mongoose'

const WaterLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  waterGoal: { type: Number, default: 2500 },
  logs: { type: Map, of: [{ id: String, ml: Number, label: String, time: String }], default: {} }
})

export default mongoose.models.WaterLog || mongoose.model('WaterLog', WaterLogSchema)
