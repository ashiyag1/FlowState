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
    sankalpaCount: 0,
    breathingCount: 0,
    wisdomCount: 0,
    booksOpened: [],
    sunriseActivities: 0,
    midnightJournals: 0
  };

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
  const journalCount = journalEntries.length;
  const journalDates = new Set(journalEntries.map(e => e.date));

  // 5. Calculate Cosmic Rhythm (ANY activity consecutive days streak)
  // Union of all active dates: water, habit, journal, and sankalpa
  // Since sankalpa set/completions are logged in stats, we use dates where user performed at least one activity
  const allActivityDates = new Set([
    ...waterDates,
    ...habitDates,
    ...journalDates
  ]);
  
  const maxCosmicStreak = computeMaxConsecutiveDays(allActivityDates);

  // 6. Define computed metrics for each badge
  const metrics = {
    "3_day_streak": maxHabitStreak,
    "journalled_10_times": journalCount,
    "hydration_sage": waterSuccessDays,
    "wisdom_seeker": stats.wisdomCount || 0,
    "cosmic_rhythm": maxCosmicStreak,
    "sunrise_consistency": stats.sunriseActivities || 0,
    "third_eye_open": (stats.booksOpened || []).length,
    "the_unshaken": maxHabitStreak,
    "Sankalpa_keeper": stats.sankalpaCount || 0,
    "calm_mind": stats.breathingCount || 0,
    "daily_journaling_30_times": journalCount,
    "discipline_builder": maxHabitsInADay,
    "focus_monk": stats.breathingCount || 0,
    "midnight_reflector": stats.midnightJournals || 0
  };

  // 7. Get existing badges & evaluate
  const userBadges = await dbGetUserBadges(userId);
  const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));
  
  const badgeDefinitions = [
    { id: "3_day_streak", target: 3 },
    { id: "journalled_10_times", target: 10 },
    { id: "hydration_sage", target: 5 },
    { id: "wisdom_seeker", target: 5 },
    { id: "cosmic_rhythm", target: 7 },
    { id: "sunrise_consistency", target: 3 },
    { id: "third_eye_open", target: 3 },
    { id: "the_unshaken", target: 10 },
    { id: "Sankalpa_keeper", target: 5 },
    { id: "calm_mind", target: 5 },
    { id: "daily_journaling_30_times", target: 30 },
    { id: "discipline_builder", target: 5 },
    { id: "focus_monk", target: 10 },
    { id: "midnight_reflector", target: 3 }
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
