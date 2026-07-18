import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { getWaterDetails, updateWater, deleteWaterLogs } from '../controllers/waterController.js'

const router = express.Router()

router.use(authMiddleware)

// GET water details
router.get('/', getWaterDetails)

// POST water updates
router.post('/', updateWater)

// DELETE water logs
router.delete('/', deleteWaterLogs)

export default router
