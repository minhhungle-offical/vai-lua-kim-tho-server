import express from 'express'
import { login, signUp, getProfile } from '../controllers/auth.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// POST /api/auth/login
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'HI',
  })
})

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/signup
router.post('/signup', signUp)

// GET /api/auth/me (yêu cầu token)
router.get('/profile', verifyToken, getProfile)

export default router
