import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET || 'flowstate_secret_key_108'

  try {
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' })
    }

    req.userId = decoded.userId
    next()
  } catch (err) {
    console.error('Authentication middleware error:', err)
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}
