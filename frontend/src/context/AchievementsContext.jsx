import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useWellness } from './WellnessContext';
import { today as getToday, Store } from '../utils';

const AchievementsContext = createContext(null);

const FRONTEND_DEFAULT_BADGES = [
  {
    badgeId: "3_day_streak",
    title: "3 Day Streak",
    description: "Maintain a habit streak of 3 days.",
    imageFilename: "3_day_streak.webp",
    category: "streaks",
    rarity: "Common",
    targetProgress: 3
  },
  {
    badgeId: "journalled_10_times",
    title: "Journalled 10 Times",
    description: "Write journal entries on 10 different days.",
    imageFilename: "journalled_10_times.webp",
    category: "journaling",
    rarity: "Common",
    targetProgress: 10
  },
  {
    badgeId: "hydration_sage",
    title: "Hydration Sage",
    description: "Meet your water goals on 5 different days.",
    imageFilename: "hydration_sage.webp",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "wisdom_seeker",
    title: "Wisdom Seeker",
    description: "Open and read from 3 different books in Wisdom Library.",
    imageFilename: "wisdom_seeker.webp",
    category: "wisdom",
    rarity: "Common",
    targetProgress: 3
  },
  {
    badgeId: "cosmic_rhythm",
    title: "Cosmic Rhythm",
    description: "Log wellness activity for 7 consecutive days.",
    imageFilename: "cosmic_rhythm.webp",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 7
  },
  {
    badgeId: "sunrise_consistency",
    title: "Sunrise Consistency",
    description: "Complete habit or breathing before 8 AM on 3 different days.",
    imageFilename: "sunrise_consistency.webp",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 3
  },
  {
    badgeId: "third_eye_open",
    title: "Third Eye Open",
    description: "Read the wisdom section daily for 21 days.",
    imageFilename: "third_eye_open.webp",
    category: "wisdom",
    rarity: "Rare",
    targetProgress: 21
  },
  {
    badgeId: "the_unshaken",
    title: "The Unshaken",
    description: "Maintain a habit streak of 10 days.",
    imageFilename: "the_unshaken.webp",
    category: "legendary",
    rarity: "Legendary",
    targetProgress: 10
  },
  {
    badgeId: "Sankalpa_keeper",
    title: "Sankalpa Keeper",
    description: "Commit to and fulfill Daily Sankalpa on 5 different days.",
    imageFilename: "Sankalpa_keeper.webp",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "calm_mind",
    title: "Calm Mind",
    description: "Practice breathing exercises or meditation on 5 different days.",
    imageFilename: "calm_mind.webp",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "daily_journaling_30_times",
    title: "Daily Reflection Sage",
    description: "Write daily journal entries on 30 different days.",
    imageFilename: "daily_journaling_30_times.webp",
    category: "journaling",
    rarity: "Rare",
    targetProgress: 30
  },
  {
    badgeId: "discipline_builder",
    title: "Discipline Builder",
    description: "Complete at least 5 habits in a single day.",
    imageFilename: "discipline_builder.webp",
    category: "streaks",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "focus_monk",
    title: "Focus Monk",
    description: "Complete breathing portal sessions on 10 different days.",
    imageFilename: "focus_monk.webp",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 10
  },
  {
    badgeId: "midnight_reflector",
    title: "Midnight Reflector",
    description: "Log a night reflection journal entry (after 9 PM) on 3 different days.",
    imageFilename: "midnight_reflector.webp",
    category: "journaling",
    rarity: "Uncommon",
    targetProgress: 3
  },
  {
    badgeId: "first_water_logged",
    title: "Jal Hi Jeevan Hai (No Cap)",
    description: "Logged your first water entry. Stay hydrated, no cap.",
    imageFilename: "first_water_logged.png",
    category: "wellness",
    rarity: "Common",
    targetProgress: 1
  },
  {
    badgeId: "first_ritual_logged",
    title: "No Dard, Only Sadhana",
    description: "Completed your first habit/ritual. No pain, only alignment.",
    imageFilename: "first_ritual_logged.png",
    category: "rituals",
    rarity: "Common",
    targetProgress: 1
  },
  {
    badgeId: "first_journal_logged",
    title: "Spilling the Inner Tea",
    description: "Poured your heart out in your first journal entry.",
    imageFilename: "first_journal_logged.png",
    category: "journaling",
    rarity: "Common",
    targetProgress: 1
  },
  {
    badgeId: "first_page_read",
    title: "Shastri Tiger",
    description: "Read your first page in the Wisdom Library.",
    imageFilename: "first_page_read.png",
    category: "wisdom",
    rarity: "Common",
    targetProgress: 1
  }
];

export function getBadgeImageUrl(imageFilename) {
  // Handles auto-mapping using Vite URL constructor
  return new URL(`../assets/badges/${imageFilename}`, import.meta.url).href;
}

// Local helper to compute consecutive active days across a set of dates
function computeMaxConsecutiveDaysLocal(dateStrings) {
  if (dateStrings.size === 0) return 0;
  
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

export function AchievementsProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const wellness = useWellness(); // waterLog, habitDone, journal, waterGoal, habits, etc.
  
  const [badges, setBadges] = useState([]);
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [activeUnlockBadge, setActiveUnlockBadge] = useState(null);
  const [isFreshUnlock, setIsFreshUnlock] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const isFetchingRef = useRef(false);

  // Load badges
  const loadBadges = useCallback(async () => {
    if (isAuthenticated && token) {
      isFetchingRef.current = true;
      try {
        const res = await fetch('/api/v1/badges', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBadges(data);
        }
      } catch (err) {
        console.error('Failed to fetch backend badges:', err);
      } finally {
        isFetchingRef.current = false;
      }
    } else {
      // Guest mode: load badges progress from local storage
      const localBadgesProgress = Store.get('fwa_local_badges', {});
      const merged = FRONTEND_DEFAULT_BADGES.map(badge => {
        const local = localBadgesProgress[badge.badgeId] || { progress: 0, isUnlocked: false, unlockedAt: null };
        return {
          ...badge,
          progress: local.progress,
          isUnlocked: local.isUnlocked,
          unlockedAt: local.unlockedAt
        };
      });
      setBadges(merged);
    }
  }, [isAuthenticated, token]);

  // Sync badges on authentication status changes
  useEffect(() => {
    loadBadges();
  }, [isAuthenticated, loadBadges]);

  // Trigger server-side badge evaluation sweep on load or after login sync
  const triggerServerCheck = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch('/api/v1/badges/check', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
          showUnlockPopups(data.newlyUnlocked);
        }
        await loadBadges();
      }
    } catch (err) {
      console.error('Failed to run server achievements check:', err);
    }
  }, [isAuthenticated, token, loadBadges]);

  // Sync local client achievements to backend upon login
  useEffect(() => {
    if (isAuthenticated && token) {
      const localStats = Store.get('fwa_local_stats');
      if (localStats) {
        // Sync stats one by one or trigger a server check
        async function syncStats() {
          try {
            // Sync each unique wisdom date so server can compute streak properly
            const wisdomDatesToSync = localStats.wisdomDates || [];
            for (const dateStr of wisdomDatesToSync) {
              await fetch('/api/v1/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'wisdom_read', localDate: dateStr })
              });
            }
            if (localStats.breathingCount) {
              await fetch('/api/v1/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'breathing_completed' })
              });
            }
            if (localStats.sankalpaCount) {
              await fetch('/api/v1/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'sankalpa_completed' })
              });
            }
            if (localStats.booksOpened && localStats.booksOpened.length > 0) {
              for (const bookId of localStats.booksOpened) {
                await fetch('/api/v1/badges/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ actionType: 'book_opened', metadata: { bookId } })
                });
              }
            }
            // Clear local stats once synced
            Store.del('fwa_local_stats');
            Store.del('fwa_local_badges');
            triggerServerCheck();
          } catch (e) {
            console.error('Failed syncing local stats to backend:', e);
          }
        }
        syncStats();
      } else {
        triggerServerCheck();
      }
    }
  }, [isAuthenticated, token, triggerServerCheck]);

  // Display toast and modals for newly unlocked badges
  const showUnlockPopups = (newBadges) => {
    newBadges.forEach((badge, idx) => {
      // 1. Queue Toast notification
      setTimeout(() => {
        addToast(badge);
      }, idx * 1200);

      // 2. Open Unlock Modal (show the first one immediately, others can queue/open)
      if (idx === 0) {
        setActiveUnlockBadge(badge);
      }
    });
  };

  const addToast = (badge) => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, badge }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Evaluate achievements locally (for guest users)
  const evaluateLocalAchievements = useCallback((actionType, metadata = {}) => {
    const todayStr = getToday();
    const stats = Store.get('fwa_local_stats', {
      sankalpaCount: 0,
      breathingCount: 0,
      wisdomDates: [],
      booksOpened: [],
      sunriseActivities: 0,
      midnightJournals: 0,
      pagesRead: []
    });

    const now = new Date();
    const currentHour = now.getHours();

    // 1. Process local stats increment
    if (actionType === 'wisdom_read') {
      // Track unique dates for wisdom streak
      const wisdomDates = new Set(stats.wisdomDates || []);
      wisdomDates.add(todayStr);
      stats.wisdomDates = Array.from(wisdomDates);
    } else if (actionType === 'breathing_completed') {
      stats.breathingCount = (stats.breathingCount || 0) + 1;
    } else if (actionType === 'sankalpa_completed') {
      stats.sankalpaCount = (stats.sankalpaCount || 0) + 1;
    } else if (actionType === 'book_opened' && metadata.bookId) {
      // Track unique books opened
      const books = new Set(stats.booksOpened || []);
      books.add(metadata.bookId);
      stats.booksOpened = Array.from(books);
    } else if (actionType === 'sunrise_activity') {
      stats.sunriseActivities = (stats.sunriseActivities || 0) + 1;
    } else if (actionType === 'midnight_journal') {
      stats.midnightJournals = (stats.midnightJournals || 0) + 1;
    } else if (actionType === 'page_read' && metadata.bookId !== undefined && metadata.page !== undefined) {
      const pages = new Set(stats.pagesRead || []);
      pages.add(`${metadata.bookId}_${metadata.page}`);
      stats.pagesRead = Array.from(pages);
    }
    
    Store.set('fwa_local_stats', stats);

    // 2. Retrieve wellness logs from context
    const waterLog = wellness.waterLog || {};
    const waterGoal = wellness.waterGoal || 2500;
    const habitDone = wellness.habitDone || {};
    const journal = wellness.journal || [];

    // Evaluate water goals met
    let waterSuccessDays = 0;
    const waterDates = new Set();
    for (const [dateStr, entries] of Object.entries(waterLog)) {
      const totalMl = (entries || []).reduce((sum, e) => sum + e.ml, 0);
      if (totalMl >= waterGoal) waterSuccessDays++;
      if ((entries || []).length > 0) waterDates.add(dateStr);
    }

    // Evaluate habits
    let maxHabitsInADay = 0;
    const habitDates = new Set();
    for (const [dateStr, completions] of Object.entries(habitDone)) {
      const count = Object.keys(completions || {}).length;
      if (count > 0) {
        habitDates.add(dateStr);
        if (count > maxHabitsInADay) maxHabitsInADay = count;
      }
    }
    const maxHabitStreak = computeMaxConsecutiveDaysLocal(habitDates);

    // Evaluate journal entries
    const journalCount = journal.length;
    const journalDates = new Set(journal.map(e => e.date));

    // Cosmic rhythm (any active days)
    const allActivityDates = new Set([...waterDates, ...habitDates, ...journalDates]);
    const maxCosmicStreak = computeMaxConsecutiveDaysLocal(allActivityDates);

    // Compute local wisdom streak
    const wisdomDatesSet = new Set(stats.wisdomDates || []);
    const maxWisdomStreakLocal = computeMaxConsecutiveDaysLocal(wisdomDatesSet);

    // Metrics lookup — STRICTLY mapped to badge definitions:
    // wisdom_seeker = 3 different books opened
    // third_eye_open = 21 consecutive days reading wisdom section
    const metrics = {
      "3_day_streak": maxHabitStreak,
      "journalled_10_times": journalCount,
      "hydration_sage": waterSuccessDays,
      "wisdom_seeker": (stats.booksOpened || []).length,   // 3 unique books
      "cosmic_rhythm": maxCosmicStreak,
      "sunrise_consistency": stats.sunriseActivities,
      "third_eye_open": maxWisdomStreakLocal,               // 21-day wisdom streak
      "the_unshaken": maxHabitStreak,
      "Sankalpa_keeper": stats.sankalpaCount,
      "calm_mind": stats.breathingCount,
      "daily_journaling_30_times": journalCount,
      "discipline_builder": maxHabitsInADay,
      "focus_monk": stats.breathingCount,
      "midnight_reflector": stats.midnightJournals,
      "first_water_logged": waterDates.size,
      "first_ritual_logged": habitDates.size,
      "first_journal_logged": journalCount,
      "first_page_read": (stats.pagesRead || []).length
    };

    const localBadgesProgress = Store.get('fwa_local_badges', {});
    const newlyUnlockedLocal = [];

    const badgeDefinitions = [
      { id: "3_day_streak", target: 3 },
      { id: "journalled_10_times", target: 10 },
      { id: "hydration_sage", target: 5 },
      { id: "wisdom_seeker", target: 3 },    // 3 different books
      { id: "cosmic_rhythm", target: 7 },
      { id: "sunrise_consistency", target: 3 },
      { id: "third_eye_open", target: 21 },  // 21-day wisdom reading streak
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

    badgeDefinitions.forEach(badgeDef => {
      const currentProgress = metrics[badgeDef.id] || 0;
      const existing = localBadgesProgress[badgeDef.id] || { progress: 0, isUnlocked: false, unlockedAt: null };
      
      const shouldUnlock = currentProgress >= badgeDef.target;
      const wasUnlocked = existing.isUnlocked;

      const updatedBadge = {
        progress: Math.min(currentProgress, badgeDef.target),
        isUnlocked: wasUnlocked || shouldUnlock,
        unlockedAt: wasUnlocked ? existing.unlockedAt : (shouldUnlock ? new Date().toISOString() : null)
      };

      localBadgesProgress[badgeDef.id] = updatedBadge;

      if (shouldUnlock && !wasUnlocked) {
        const fullBadgeDetails = FRONTEND_DEFAULT_BADGES.find(b => b.badgeId === badgeDef.id);
        newlyUnlockedLocal.push(fullBadgeDetails);
      }
    });

    Store.set('fwa_local_badges', localBadgesProgress);

    // Show unlock notifications locally
    if (newlyUnlockedLocal.length > 0) {
      showUnlockPopups(newlyUnlockedLocal);
    }

    // Reload state representation
    loadBadges();
  }, [wellness, loadBadges]);

  // Track event entry point (called by components)
  const trackEvent = useCallback(async (actionType, metadata = {}) => {
    // BUG 11 FIX: Guest users now run through local achievement evaluation
    // instead of silently returning with no badge progress tracked
    if (!isAuthenticated || !token) {
      evaluateLocalAchievements(actionType, metadata);
      return;
    }


    const currentHour = new Date().getHours();
    
    // Automatically trigger specific stats when related events happen
    let additionalEvents = [];
    if (actionType === 'habit_toggled' || actionType === 'breathing_completed') {
      if (currentHour < 8) {
        additionalEvents.push('sunrise_activity');
      }
    }
    if (actionType === 'journal_added') {
      if (currentHour >= 21 || currentHour < 4) {
        additionalEvents.push('midnight_journal');
      }
      if (currentHour < 8 && currentHour >= 4) {
        additionalEvents.push('sunrise_activity');
      }
    }

    try {
      const todayStr = getToday();
      // Log the main activity
      const res = await fetch('/api/v1/badges/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ actionType, metadata, localDate: todayStr })
      });
      
      let allNewlyUnlocked = [];

      if (res.ok) {
        const data = await res.json();
        if (data.newlyUnlocked && data.newlyUnlocked.length > 0) {
          allNewlyUnlocked.push(...data.newlyUnlocked);
        }
      }

      // Log secondary events like sunrise or midnight journals
      for (const evt of additionalEvents) {
        const subRes = await fetch('/api/v1/badges/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ actionType: evt, localDate: todayStr })
        });
        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.newlyUnlocked && subData.newlyUnlocked.length > 0) {
            allNewlyUnlocked.push(...subData.newlyUnlocked);
          }
        }
      }

      if (allNewlyUnlocked.length > 0) {
        setIsFreshUnlock(true);
        showUnlockPopups(allNewlyUnlocked);
      }

      await loadBadges();
    } catch (err) {
      console.error('Failed to log tracked action to server:', err);
    }
  }, [isAuthenticated, token, loadBadges]);

  return (
    <AchievementsContext.Provider value={{
      badges,
      isGalleryOpen,
      setGalleryOpen,
      activeUnlockBadge,
      setActiveUnlockBadge,
      isFreshUnlock,
      setIsFreshUnlock,
      toasts,
      removeToast,
      trackEvent,
      refreshAchievements: loadBadges
    }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export const useAchievements = () => {
  const ctx = useContext(AchievementsContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementsProvider');
  return ctx;
};
