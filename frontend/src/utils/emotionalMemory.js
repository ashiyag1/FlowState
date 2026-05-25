import { today as getToday } from './index'

function getTimeOfDay(date = new Date()) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

function daysBetween(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00`)
  const to = new Date(`${toDate}T00:00:00`)
  return Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24))
}

function isLateEntry(entry) {
  if (!entry?.time) return false
  const raw = entry.time.toUpperCase()
  const isPM = raw.includes('PM')
  const isAM = raw.includes('AM')
  const [hourPart] = raw.replace(/[^\d:]/g, '').split(':')
  let hour = Number.parseInt(hourPart, 10)
  if (Number.isNaN(hour)) return false

  if (isPM && hour < 12) hour += 12
  if (isAM && hour === 12) hour = 0
  return hour >= 21 || hour < 4
}

function stablePick(items, seed = 0) {
  return items[Math.abs(seed) % items.length]
}

export function getEmotionalReflection(journal = [], habitDone = {}) {
  const now = new Date()
  const tod = getTimeOfDay(now)
  const todayStr = getToday()

  const journalDates = journal.map(entry => entry.date).filter(Boolean)
  const habitDates = Object.keys(habitDone).filter(date => {
    const completions = habitDone[date] || {}
    return Object.keys(completions).length > 0
  })
  const allActiveDates = [...new Set([...journalDates, ...habitDates])].sort()

  const lastActiveStr = allActiveDates[allActiveDates.length - 1]
  const daysAway = lastActiveStr ? daysBetween(lastActiveStr, todayStr) : 0
  let isReturning = daysAway >= 3

  const welcomeKey = `fwa_welcome_seen_${todayStr}`
  const welcomeAlreadySeen = typeof window !== 'undefined' && sessionStorage.getItem(welcomeKey)
  if (isReturning && welcomeAlreadySeen) {
    isReturning = false
  } else if (isReturning && typeof window !== 'undefined') {
    sessionStorage.setItem(welcomeKey, 'true')
  }

  const recentEntries = journal.slice(0, 6)
  const recentMoods = recentEntries.map(entry => String(entry.mood || '').toLowerCase()).filter(Boolean)
  const lateNightCount = journal.filter(isLateEntry).length
  const recentEntryCount = journal.filter(entry => {
    if (!entry.date) return false
    const entryDate = new Date(`${entry.date}T00:00:00`)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  }).length

  const heavyMoodCount = recentMoods.filter(mood =>
    ['tired', 'sad', 'anxious', 'stressed', 'low', 'overwhelmed'].some(marker => mood.includes(marker))
  ).length
  const calmMoodCount = recentMoods.filter(mood =>
    ['calm', 'reflective', 'grateful', 'happy'].some(marker => mood.includes(marker))
  ).length
  const isConsistent = recentEntryCount >= 4 || allActiveDates.length >= 7
  const hasHeavyLogs = heavyMoodCount >= 2
  const lateNightPattern = lateNightCount >= 2

  const returningLines = [
    "You're back. Nothing to catch up on.",
    "A gentle return is still a return.",
    "No catching up required. Start here.",
    "Glad you made it back today."
  ]

  const lateLines = [
    "You tend to arrive when the world quiets down.",
    "The quiet hours seem to suit you.",
    "One small thing is enough tonight.",
    "No pressure tonight."
  ]

  const heavyLines = [
    "Set something down.",
    "You don't need to solve everything tonight.",
    "A quieter place for loud thoughts.",
    "Rest your thoughts for now."
  ]

  const consistentLines = [
    "A steady rhythm is building.",
    "Small returns become safe rituals.",
    "Your quiet practice is taking shape.",
    "A gentle pace is sustainable."
  ]

  const nightLines = [
    "The world can wait a little.",
    "Stay awhile. Breathe slowly.",
    "Tonight does not need to be fixed.",
    "Long day? Rest here."
  ]

  const dayLines = [
    "Move at your own pace today.",
    "One calm minute is enough.",
    "There is room to begin softly.",
    "No need to perform."
  ]

  const seed = now.getDate() + recentEntryCount + lateNightCount + daysAway
  const primaryLine = isReturning
    ? stablePick(returningLines, daysAway)
    : lateNightPattern && tod === 'night'
      ? stablePick(lateLines, seed)
      : hasHeavyLogs
        ? stablePick(heavyLines, seed)
        : isConsistent
          ? stablePick(consistentLines, seed)
          : stablePick(tod === 'night' ? nightLines : dayLines, seed)

  const rotationPool = [
    primaryLine,
    ...(isReturning ? returningLines : []),
    ...(lateNightPattern ? lateLines : []),
    ...(hasHeavyLogs ? heavyLines : []),
    ...(isConsistent ? consistentLines : []),
    ...(tod === 'night' ? nightLines : dayLines)
  ]
  const heroLines = [...new Set(rotationPool)].slice(0, 9)

  const sanctuaryNotes = tod === 'night'
    ? [
        "The page is quieter after dark.",
        "No performance. Just space to breathe.",
        "One step is enough tonight."
      ]
    : [
        "A gentle return is still a return.",
        "Take only what you need.",
        "No need to rush."
      ]

  return {
    message: primaryLine,
    heroLines,
    sanctuaryNote: stablePick(sanctuaryNotes, seed),
    isReturning,
    daysAway,
    tod,
    lateNightPattern,
    hasHeavyLogs,
    isConsistent,
    calmMoodCount,
    recentEntryCount
  }
}
