import { jwtVerify } from 'jose'

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

    req.userId = payload.userId
    next()
  } catch (err) {
    console.error('Authentication middleware error:', err)
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}
