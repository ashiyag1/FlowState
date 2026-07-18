import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getBadges, trackActivity, checkAchievements } from '../controllers/badgesController.js';

const router = express.Router();

// All badge routes require auth
router.use(authMiddleware);

// GET /api/badges — Retrieve all badges with current user progress
router.get('/', getBadges);

// POST /api/badges/track — Track client activity and run achievements evaluation
router.post('/track', trackActivity);

// POST /api/badges/check — Trigger explicit check of achievements
router.post('/check', checkAchievements);

export default router;
