import {
  dbFindUserById,
  dbGetWater,
  dbGetHabits,
  dbGetJournal,
  dbGetUserBadges,
  dbSaveUserBadge
} from '../db.js';

// Helper to compute consecutive active days across a set of dates
function computeMaxConsecutiveDays(dateStrings) {
  if (dateStrings.size === 0) return 0;
  
  // Sort dates ascending
  const sorted = Array.from(dateStrings)
    .map(d => new Date(d))
    .sort((a, b) => a - b);
    
  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate = null;
  
  for (const date of sorted) {
    if (!prevDate) {
      currentStreak = 1;
    } else {
      const diffTime = Math.abs(date - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        currentStreak = 1;
      }
    }
    prevDate = date;
  }
  
  return Math.max(maxStreak, currentStreak);
}

export async function evaluateAchievements(userId) {
  // 1. Fetch user & stats
  const user = await dbFindUserById(userId);
  if (!user) throw new Error('User not found');
  
  const stats = user.stats || {
    sankalpaDates: [],
    breathingDates: [],
    wisdomDates: [],
    booksOpened: [],
    sunriseDates: [],
    midnightJournalDates: [],
    pagesRead: []
  };

  const sankalpaDates = Array.isArray(stats.sankalpaDates) ? stats.sankalpaDates : [];
  const breathingDates = Array.isArray(stats.breathingDates) ? stats.breathingDates : [];
  const wisdomDates = Array.isArray(stats.wisdomDates) ? stats.wisdomDates : [];
  const booksOpened = Array.isArray(stats.booksOpened) ? stats.booksOpened : [];
  const sunriseDates = Array.isArray(stats.sunriseDates) ? stats.sunriseDates : [];
  const midnightJournalDates = Array.isArray(stats.midnightJournalDates) ? stats.midnightJournalDates : [];
  const pagesRead = Array.isArray(stats.pagesRead) ? stats.pagesRead : [];

  // 2. Fetch water logs
  const waterData = await dbGetWater(userId);
  const waterGoal = waterData.waterGoal || 2500;
  const waterLogs = waterData.logs || {};
  
  let waterSuccessDays = 0;
  const waterDates = new Set();
  for (const [dateStr, entries] of Object.entries(waterLogs)) {
    const totalMl = (entries || []).reduce((sum, e) => sum + e.ml, 0);
    if (totalMl >= waterGoal) {
      waterSuccessDays++;
    }
    if ((entries || []).length > 0) {
      waterDates.add(dateStr);
    }
  }

  // 3. Fetch habits and streaks
  const habitData = await dbGetHabits(userId);
  const habitDone = habitData.habitDone || {};
  
  let maxHabitStreak = 0;
  let maxHabitsInADay = 0;
  const habitDates = new Set();
  
  for (const [dateStr, completions] of Object.entries(habitDone)) {
    const count = Object.keys(completions || {}).length;
    if (count > 0) {
      habitDates.add(dateStr);
      if (count > maxHabitsInADay) {
        maxHabitsInADay = count;
      }
    }
  }
  
  // Calculate habit streak (consecutive days where at least 1 habit was completed)
  maxHabitStreak = computeMaxConsecutiveDays(habitDates);

  // 4. Fetch journal entries
  const journalEntries = await dbGetJournal(userId);
  const journalDates = new Set(journalEntries.map(e => e.date));
  const journalCount = journalDates.size;

  // 5. Calculate Cosmic Rhythm & Wisdom Streaks
  const maxWisdomStreak = computeMaxConsecutiveDays(new Set(wisdomDates));

  const allActivityDates = new Set([
    ...waterDates,
    ...habitDates,
    ...journalDates,
    ...breathingDates,
    ...sankalpaDates,
    ...wisdomDates
  ]);
  
  const maxCosmicStreak = computeMaxConsecutiveDays(allActivityDates);

  // 6. Define computed metrics for each badge
  const metrics = {
    "3_day_streak": maxHabitStreak,
    "journalled_10_times": journalCount,
    "hydration_sage": waterSuccessDays,
    "wisdom_seeker": new Set(booksOpened.map(String)).size,
    "cosmic_rhythm": maxCosmicStreak,
    "sunrise_consistency": sunriseDates.length,
    "third_eye_open": maxWisdomStreak,
    "the_unshaken": maxHabitStreak,
    "Sankalpa_keeper": sankalpaDates.length,
    "calm_mind": breathingDates.length,
    "daily_journaling_30_times": journalCount,
    "discipline_builder": maxHabitsInADay,
    "focus_monk": breathingDates.length,
    "midnight_reflector": midnightJournalDates.length,
    "first_water_logged": waterDates.size,
    "first_ritual_logged": habitDates.size,
    "first_journal_logged": journalCount,
    "first_page_read": pagesRead.length
  };

  // 7. Get existing badges & evaluate
  const userBadges = await dbGetUserBadges(userId);
  const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));
  
  const badgeDefinitions = [
    { id: "3_day_streak", target: 3 },
    { id: "journalled_10_times", target: 10 },
    { id: "hydration_sage", target: 5 },
    { id: "wisdom_seeker", target: 3 },
    { id: "cosmic_rhythm", target: 7 },
    { id: "sunrise_consistency", target: 3 },
    { id: "third_eye_open", target: 21 },
    { id: "the_unshaken", target: 10 },
    { id: "Sankalpa_keeper", target: 5 },
    { id: "calm_mind", target: 5 },
    { id: "daily_journaling_30_times", target: 30 },
    { id: "discipline_builder", target: 5 },
    { id: "focus_monk", target: 10 },
    { id: "midnight_reflector", target: 3 },
    { id: "first_water_logged", target: 1 },
    { id: "first_ritual_logged", target: 1 },
    { id: "first_journal_logged", target: 1 },
    { id: "first_page_read", target: 1 }
  ];

  const newlyUnlocked = [];
  
  for (const badgeDef of badgeDefinitions) {
    const currentProgress = metrics[badgeDef.id] || 0;
    const existing = userBadgeMap.get(badgeDef.id);
    
    const wasUnlocked = existing?.isUnlocked || false;
    const shouldUnlock = currentProgress >= badgeDef.target;
    
    const updates = {
      progress: Math.min(currentProgress, badgeDef.target),
      targetProgress: badgeDef.target
    };

    if (shouldUnlock && !wasUnlocked) {
      updates.isUnlocked = true;
      updates.unlockedAt = new Date().toISOString();
      
      const saved = await dbSaveUserBadge(userId, badgeDef.id, updates);
      newlyUnlocked.push(badgeDef.id);
    } else if (existing?.progress !== updates.progress) {
      // Just update progress
      await dbSaveUserBadge(userId, badgeDef.id, updates);
    }
  }

  return newlyUnlocked;
}
