import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import jwtConfig from '../config/jwt.js'

// Middleware to verify JWT token from Authorization header
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Check if Authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid or missing token' })
    }

    // Extract token from header
    const token = authHeader.split(' ')[1]

    // Verify token and decode payload
    const decoded = jwt.verify(token, jwtConfig.secret)

    // Find user by decoded ID and exclude password from result
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found from token' })
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error })
  }
}
