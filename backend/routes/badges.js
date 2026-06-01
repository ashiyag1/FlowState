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
    const { actionType, metadata, localDate: clientLocalDate } = req.body;
    const user = await dbFindUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const localDate = clientLocalDate || new Date().toISOString().slice(0, 10);
    const currentStats = user.stats || {
      sankalpaDates: [],
      breathingDates: [],
      wisdomDates: [],
      booksOpened: [],
      sunriseDates: [],
      midnightJournalDates: []
    };

    const sankalpaDates = Array.isArray(currentStats.sankalpaDates) ? currentStats.sankalpaDates : [];
    const breathingDates = Array.isArray(currentStats.breathingDates) ? currentStats.breathingDates : [];
    const wisdomDates = Array.isArray(currentStats.wisdomDates) ? currentStats.wisdomDates : [];
    const booksOpened = Array.isArray(currentStats.booksOpened) ? currentStats.booksOpened : [];
    const sunriseDates = Array.isArray(currentStats.sunriseDates) ? currentStats.sunriseDates : [];
    const midnightJournalDates = Array.isArray(currentStats.midnightJournalDates) ? currentStats.midnightJournalDates : [];
    const pagesRead = Array.isArray(currentStats.pagesRead) ? currentStats.pagesRead : [];

    const statsUpdates = {};
    let shouldUpdate = false;

    // Handle activity logging
    if (actionType === 'wisdom_read') {
      if (!wisdomDates.includes(localDate)) {
        wisdomDates.push(localDate);
        statsUpdates.wisdomDates = wisdomDates;
        shouldUpdate = true;
      }
    } else if (actionType === 'breathing_completed') {
      if (!breathingDates.includes(localDate)) {
        breathingDates.push(localDate);
        statsUpdates.breathingDates = breathingDates;
        shouldUpdate = true;
      }
    } else if (actionType === 'sankalpa_completed') {
      if (!sankalpaDates.includes(localDate)) {
        sankalpaDates.push(localDate);
        statsUpdates.sankalpaDates = sankalpaDates;
        shouldUpdate = true;
      }
    } else if (actionType === 'book_opened' && metadata?.bookId !== undefined) {
      const bookId = String(metadata.bookId);
      const normalizedBooks = booksOpened.map(String);
      if (!normalizedBooks.includes(bookId)) {
        booksOpened.push(bookId);
        statsUpdates.booksOpened = booksOpened;
        shouldUpdate = true;
      }
    } else if (actionType === 'sunrise_activity') {
      if (!sunriseDates.includes(localDate)) {
        sunriseDates.push(localDate);
        statsUpdates.sunriseDates = sunriseDates;
        shouldUpdate = true;
      }
    } else if (actionType === 'midnight_journal') {
      if (!midnightJournalDates.includes(localDate)) {
        midnightJournalDates.push(localDate);
        statsUpdates.midnightJournalDates = midnightJournalDates;
        shouldUpdate = true;
      }
    } else if (actionType === 'page_read' && metadata?.bookId !== undefined && metadata?.page !== undefined) {
      const pageKey = `${metadata.bookId}_${metadata.page}`;
      if (!pagesRead.includes(pageKey)) {
        pagesRead.push(pageKey);
        statsUpdates.pagesRead = pagesRead;
        shouldUpdate = true;
      }
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
