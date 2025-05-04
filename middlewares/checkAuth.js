import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Middleware to check user authentication
const checkAuth = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1]

    if (!token)
      return res
        .status(401)
        .json({ message: 'Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục.' })

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Attach decoded user data to request
    next()
  } catch (error) {
    res.status(403).json({ message: 'Xác thực thất bại! Token không hợp lệ hoặc đã hết hạn.' })
  }
}

export default checkAuth
