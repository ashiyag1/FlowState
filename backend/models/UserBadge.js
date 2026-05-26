import mongoose from 'mongoose'

const UserBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  isUnlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date }
})

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

export default mongoose.models.UserBadge || mongoose.model('UserBadge', UserBadgeSchema)
