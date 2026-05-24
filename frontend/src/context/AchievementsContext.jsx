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
    imageFilename: "3_day_streak.png",
    category: "streaks",
    rarity: "Common",
    targetProgress: 3
  },
  {
    badgeId: "journalled_10_times",
    title: "Journalled 10 Times",
    description: "Write 10 journal entries.",
    imageFilename: "journalled_10_times.png",
    category: "journaling",
    rarity: "Common",
    targetProgress: 10
  },
  {
    badgeId: "hydration_sage",
    title: "Hydration Sage",
    description: "Meet your water goals on 5 different days.",
    imageFilename: "hydration_sage.png",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "wisdom_seeker",
    title: "Wisdom Seeker",
    description: "Read daily wisdom quotes 5 times.",
    imageFilename: "wisdom_seeker.png",
    category: "wisdom",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "cosmic_rhythm",
    title: "Cosmic Rhythm",
    description: "Log wellness activity for 7 consecutive days.",
    imageFilename: "cosmic_rhythm.png",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 7
  },
  {
    badgeId: "sunrise_consistency",
    title: "Sunrise Consistency",
    description: "Complete habit or breathing before 8 AM on 3 days.",
    imageFilename: "sunrise_consistency.png",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 3
  },
  {
    badgeId: "third_eye_open",
    title: "Third Eye Open",
    description: "Open and read from 3 different books in Wisdom Library.",
    imageFilename: "third_eye_open.png",
    category: "wisdom",
    rarity: "Rare",
    targetProgress: 3
  },
  {
    badgeId: "the_unshaken",
    title: "The Unshaken",
    description: "Maintain a habit streak of 10 days.",
    imageFilename: "the_unshaken.png",
    category: "legendary",
    rarity: "Legendary",
    targetProgress: 10
  },
  {
    badgeId: "Sankalpa_keeper",
    title: "Sankalpa Keeper",
    description: "Commit to and fulfill Daily Sankalpa on 5 days.",
    imageFilename: "Sankalpa_keeper.png",
    category: "rituals",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "calm_mind",
    title: "Calm Mind",
    description: "Practice breathing exercises or meditation 5 times.",
    imageFilename: "calm_mind.png",
    category: "wellness",
    rarity: "Common",
    targetProgress: 5
  },
  {
    badgeId: "daily_journaling_30_times",
    title: "Daily Reflection Sage",
    description: "Write 30 daily journal entries.",
    imageFilename: "daily_journaling_30_times.png",
    category: "journaling",
    rarity: "Rare",
    targetProgress: 30
  },
  {
    badgeId: "discipline_builder",
    title: "Discipline Builder",
    description: "Complete at least 5 habits in a single day.",
    imageFilename: "discipline_builder.png",
    category: "streaks",
    rarity: "Uncommon",
    targetProgress: 5
  },
  {
    badgeId: "focus_monk",
    title: "Focus Monk",
    description: "Complete breathing portal sessions 10 times.",
    imageFilename: "focus_monk.png",
    category: "wellness",
    rarity: "Uncommon",
    targetProgress: 10
  },
  {
    badgeId: "midnight_reflector",
    title: "Midnight Reflector",
    description: "Log a night reflection journal entry (after 9 PM) on 3 days.",
    imageFilename: "midnight_reflector.png",
    category: "journaling",
    rarity: "Uncommon",
    targetProgress: 3
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
  const [toasts, setToasts] = useState([]);
  
  const isFetchingRef = useRef(false);

  // Load badges
  const loadBadges = useCallback(async () => {
    if (isAuthenticated && token) {
      isFetchingRef.current = true;
      try {
        const res = await fetch('/api/badges', {
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
      // Guest mode: load local badges progress
      const localProgress = Store.get('fwa_local_badges', {});
      const merged = FRONTEND_DEFAULT_BADGES.map(badge => {
        const prog = localProgress[badge.badgeId] || {};
        return {
          ...badge,
          progress: prog.progress || 0,
          isUnlocked: prog.isUnlocked || false,
          unlockedAt: prog.unlockedAt || null
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
      const res = await fetch('/api/badges/check', {
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
            // Send track event for accumulated stats
            if (localStats.wisdomCount) {
              await fetch('/api/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'wisdom_read', metadata: { count: localStats.wisdomCount } })
              });
            }
            if (localStats.breathingCount) {
              await fetch('/api/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'breathing_completed' })
              });
            }
            if (localStats.sankalpaCount) {
              await fetch('/api/badges/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ actionType: 'sankalpa_completed' })
              });
            }
            if (localStats.booksOpened && localStats.booksOpened.length > 0) {
              for (const bookId of localStats.booksOpened) {
                await fetch('/api/badges/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ actionType: 'book_opened', metadata: { bookId } })
                });
              }
            }
            // Clear local stats once synced
            Store.remove('fwa_local_stats');
            Store.remove('fwa_local_badges');
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
    const stats = Store.get('fwa_local_stats', {
      sankalpaCount: 0,
      breathingCount: 0,
      wisdomCount: 0,
      booksOpened: [],
      sunriseActivities: 0,
      midnightJournals: 0
    });

    const now = new Date();
    const currentHour = now.getHours();

    // 1. Process local stats increment
    if (actionType === 'wisdom_read') {
      stats.wisdomCount = (stats.wisdomCount || 0) + 1;
    } else if (actionType === 'breathing_completed') {
      stats.breathingCount = (stats.breathingCount || 0) + 1;
    } else if (actionType === 'sankalpa_completed') {
      stats.sankalpaCount = (stats.sankalpaCount || 0) + 1;
    } else if (actionType === 'book_opened' && metadata.bookId) {
      const books = new Set(stats.booksOpened || []);
      books.add(metadata.bookId);
      stats.booksOpened = Array.from(books);
    } else if (actionType === 'sunrise_activity') {
      stats.sunriseActivities = (stats.sunriseActivities || 0) + 1;
    } else if (actionType === 'midnight_journal') {
      stats.midnightJournals = (stats.midnightJournals || 0) + 1;
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

    // Metrics lookup
    const metrics = {
      "3_day_streak": maxHabitStreak,
      "journalled_10_times": journalCount,
      "hydration_sage": waterSuccessDays,
      "wisdom_seeker": stats.wisdomCount,
      "cosmic_rhythm": maxCosmicStreak,
      "sunrise_consistency": stats.sunriseActivities,
      "third_eye_open": stats.booksOpened.length,
      "the_unshaken": maxHabitStreak,
      "Sankalpa_keeper": stats.sankalpaCount,
      "calm_mind": stats.breathingCount,
      "daily_journaling_30_times": journalCount,
      "discipline_builder": maxHabitsInADay,
      "focus_monk": stats.breathingCount,
      "midnight_reflector": stats.midnightJournals
    };

    const localBadgesProgress = Store.get('fwa_local_badges', {});
    const newlyUnlockedLocal = [];

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
    // Perform checks for sunrise/midnight on client side automatically based on clock
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

    // Call server track if authenticated
    if (isAuthenticated && token) {
      try {
        // Log the main activity
        const res = await fetch('/api/badges/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ actionType, metadata })
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
          const subRes = await fetch('/api/badges/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ actionType: evt })
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.newlyUnlocked && subData.newlyUnlocked.length > 0) {
              allNewlyUnlocked.push(...subData.newlyUnlocked);
            }
          }
        }

        if (allNewlyUnlocked.length > 0) {
          showUnlockPopups(allNewlyUnlocked);
        }

        await loadBadges();
      } catch (err) {
        console.error('Failed to log tracked action to server:', err);
      }
    } else {
      // Local tracking evaluation
      evaluateLocalAchievements(actionType, metadata);
      for (const evt of additionalEvents) {
        evaluateLocalAchievements(evt);
      }
    }
  }, [isAuthenticated, token, evaluateLocalAchievements, loadBadges]);

  return (
    <AchievementsContext.Provider value={{
      badges,
      isGalleryOpen,
      setGalleryOpen,
      activeUnlockBadge,
      setActiveUnlockBadge,
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
