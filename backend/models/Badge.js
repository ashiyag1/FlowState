import mongoose from 'mongoose'

const BadgeSchema = new mongoose.Schema({
  badgeId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageFilename: { type: String, required: true },
  category: { type: String, required: true }, // streaks, wisdom, journaling, rituals, wellness, legendary
  rarity: { type: String, required: true }, // Common, Uncommon, Rare, Legendary
  targetProgress: { type: Number, required: true }
})

export default mongoose.models.Badge || mongoose.model('Badge', BadgeSchema)
