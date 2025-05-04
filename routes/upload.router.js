import express from 'express'
import upload from '../middlewares/upload.middleware.js'
import { uploadAvatar } from '../controllers/upload.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Auth required to upload avatar
router.post('/avatar', verifyToken, upload.single('avatar'), uploadAvatar)

export default router
