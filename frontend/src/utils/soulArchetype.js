/**
 * Computes a soul archetype from mood history.
 * Archetypes: Dreamer, Warrior, Seeker, Restorer
 */

export const ARCHETYPES = {
  Dreamer: {
    id: 'Dreamer',
    emoji: '🌙',
    tagline: 'You live between the lines.',
    desc: 'Introspective, imaginative — you find meaning in the quiet moments others rush past.',
    moods: ['Reflective', 'Calm'],
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.3)',
    color: '#818cf8',
  },
  Warrior: {
    id: 'Warrior',
    emoji: '🔥',
    tagline: 'You show up, every single day.',
    desc: 'Driven and grateful — you channel energy into action and count your wins.',
    moods: ['Energized', 'Grateful', 'Happy'],
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.3)',
    color: '#fb923c',
  },
  Seeker: {
    id: 'Seeker',
    emoji: '🧭',
    tagline: 'Always becoming. Never done.',
    desc: 'Curious and ever-evolving — your moods shift but your journaling stays steady.',
    moods: [],  // default if moods are mixed + frequent journaling
    gradient: 'linear-gradient(135deg, #10b981, #0ea5e9)',
    glow: 'rgba(16,185,129,0.3)',
    color: '#34d399',
  },
  Restorer: {
    id: 'Restorer',
    emoji: '🌿',
    tagline: 'Rest is your revolution.',
    desc: 'Gentle and regenerating — you embrace stillness and know healing takes time.',
    moods: ['Tired', 'Calm'],
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
    glow: 'rgba(100,116,139,0.25)',
    color: '#94a3b8',
  },
}

/**
 * @param {Array} journal - array of journal entries with { mood, date }
 * @returns { archetype: object, topMood: string, totalEntries: number }
 */
export function computeArchetype(journal = []) {
  const totalEntries = journal.length

  const moodCounts = {}
  for (const e of journal) {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
  }

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
  const uniqueMoods = Object.keys(moodCounts).length

  // Seeker: journals a lot but no single dominant mood (mixed moods)
  if (totalEntries >= 5 && uniqueMoods >= 4) {
    return { archetype: ARCHETYPES.Seeker, topMood, totalEntries }
  }

  // Dreamer: mostly reflective or calm
  if (topMood === 'Reflective' || topMood === 'Calm') {
    return { archetype: ARCHETYPES.Dreamer, topMood, totalEntries }
  }

  // Warrior: mostly energized, grateful, happy
  if (topMood === 'Energized' || topMood === 'Grateful' || topMood === 'Happy') {
    return { archetype: ARCHETYPES.Warrior, topMood, totalEntries }
  }

  // Restorer: mostly tired or calm
  if (topMood === 'Tired') {
    return { archetype: ARCHETYPES.Restorer, topMood, totalEntries }
  }

  // Default — new user or no moods tracked yet
  return { archetype: ARCHETYPES.Seeker, topMood, totalEntries }
}

/**
 * Computes a wellness score 0–100 based on habits, journal, and streak.
 * @param {number} journalStreak
 * @param {number} totalJournalEntries
 * @param {number} habitsCompletedToday - number of habits done today
 * @param {number} totalHabits - total habits user has set up
 * @param {number} waterPct - water goal completion 0–1
 */
export function computeWellnessScore({ journalStreak = 0, totalJournalEntries = 0, habitsCompletedToday = 0, totalHabits = 0, waterPct = 0 }) {
  const streakScore  = Math.min(journalStreak * 4, 30)       // max 30 pts
  const journalScore = Math.min(totalJournalEntries * 2, 25)  // max 25 pts
  const habitScore   = totalHabits > 0 ? Math.round((habitsCompletedToday / totalHabits) * 25) : 0 // max 25 pts
  const waterScore   = Math.round(waterPct * 20)              // max 20 pts
  return Math.min(streakScore + journalScore + habitScore + waterScore, 100)
}
