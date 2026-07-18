import { jwtVerify } from 'jose'
import { dbFindUserById } from '../db.js'

export default async function authMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET not set — rejecting all requests')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' })
    }

    const token = authHeader.split(' ')[1]
    const secretKey = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secretKey)

    if (!payload || !payload.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' })
    }

    const user = await dbFindUserById(payload.userId)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' })
    }

    req.userId = payload.userId
    next()
  } catch (err) {
    if (err.code === 'ERR_JWT_EXPIRED') {
      // Don't log a full stack trace for normal token expirations
      console.warn(`[Auth Middleware] JWT expired for token. Client needs to re-authenticate.`)
    } else {
      console.error('Authentication middleware error:', err)
    }
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}
