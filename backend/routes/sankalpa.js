import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { generateSankalpa } from '../controllers/sankalpaController.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/generate', generateSankalpa)

export default router
