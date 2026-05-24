import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  dbGetBadges,
  dbGetUserBadges,
  dbFindUserById,
  dbUpdateUserStats
} from '../db.js';
import { evaluateAchievements } from '../services/AchievementEngine.js';

const router = express.Router();

// All badge routes require auth
router.use(authMiddleware);

// GET /api/badges — Retrieve all badges with current user progress
router.get('/', async (req, res) => {
  try {
    const allBadges = await dbGetBadges();
    const userBadges = await dbGetUserBadges(req.userId);
    const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));

    const response = allBadges.map(badge => {
      const userBadge = userBadgeMap.get(badge.badgeId);
      return {
        badgeId: badge.badgeId,
        title: badge.title,
        description: badge.description,
        imageFilename: badge.imageFilename,
        category: badge.category,
        rarity: badge.rarity,
        targetProgress: badge.targetProgress,
        progress: userBadge ? userBadge.progress : 0,
        isUnlocked: userBadge ? userBadge.isUnlocked : false,
        unlockedAt: userBadge ? userBadge.unlockedAt : null
      };
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error('GET badges route error:', err);
    return res.status(500).json({ error: 'Failed to retrieve badges status' });
  }
});

// POST /api/badges/track — Track client activity and run achievements evaluation
router.post('/track', async (req, res) => {
  try {
    const { actionType, metadata } = req.body;
    const user = await dbFindUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentStats = user.stats || {
      sankalpaCount: 0,
      breathingCount: 0,
      wisdomCount: 0,
      booksOpened: [],
      sunriseActivities: 0,
      midnightJournals: 0
    };

    const statsUpdates = {};
    let shouldUpdate = false;

    // Handle activity logging
    if (actionType === 'wisdom_read') {
      statsUpdates.wisdomCount = (currentStats.wisdomCount || 0) + 1;
      shouldUpdate = true;
    } else if (actionType === 'breathing_completed') {
      statsUpdates.breathingCount = (currentStats.breathingCount || 0) + 1;
      shouldUpdate = true;
    } else if (actionType === 'sankalpa_completed') {
      statsUpdates.sankalpaCount = (currentStats.sankalpaCount || 0) + 1;
      shouldUpdate = true;
    } else if (actionType === 'book_opened' && metadata?.bookId) {
      const opened = new Set(currentStats.booksOpened || []);
      if (!opened.has(metadata.bookId)) {
        opened.add(metadata.bookId);
        statsUpdates.booksOpened = Array.from(opened);
        shouldUpdate = true;
      }
    } else if (actionType === 'sunrise_activity') {
      statsUpdates.sunriseActivities = (currentStats.sunriseActivities || 0) + 1;
      shouldUpdate = true;
    } else if (actionType === 'midnight_journal') {
      statsUpdates.midnightJournals = (currentStats.midnightJournals || 0) + 1;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      await dbUpdateUserStats(req.userId, statsUpdates);
    }

    // Evaluate badges
    const newlyUnlockedBadgeIds = await evaluateAchievements(req.userId);
    let unlockedBadgesDetails = [];
    
    if (newlyUnlockedBadgeIds.length > 0) {
      const allBadges = await dbGetBadges();
      unlockedBadgesDetails = allBadges
        .filter(b => newlyUnlockedBadgeIds.includes(b.badgeId))
        .map(b => ({
          badgeId: b.badgeId,
          title: b.title,
          description: b.description,
          imageFilename: b.imageFilename,
          category: b.category,
          rarity: b.rarity
        }));
    }

    return res.status(200).json({
      success: true,
      newlyUnlocked: unlockedBadgesDetails
    });
  } catch (err) {
    console.error('POST track badges error:', err);
    return res.status(500).json({ error: 'Failed to process tracked action' });
  }
});

// POST /api/badges/check — Trigger explicit check of achievements
router.post('/check', async (req, res) => {
  try {
    const newlyUnlockedBadgeIds = await evaluateAchievements(req.userId);
    let unlockedBadgesDetails = [];
    
    if (newlyUnlockedBadgeIds.length > 0) {
      const allBadges = await dbGetBadges();
      unlockedBadgesDetails = allBadges
        .filter(b => newlyUnlockedBadgeIds.includes(b.badgeId))
        .map(b => ({
          badgeId: b.badgeId,
          title: b.title,
          description: b.description,
          imageFilename: b.imageFilename,
          category: b.category,
          rarity: b.rarity
        }));
    }

    return res.status(200).json({
      success: true,
      newlyUnlocked: unlockedBadgesDetails
    });
  } catch (err) {
    console.error('POST check badges error:', err);
    return res.status(500).json({ error: 'Failed to evaluate achievements' });
  }
});

export default router;
