import express from 'express'
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// All user routes are protected by verifyToken middleware
router.use(verifyToken)

// GET: Fetch all users (with optional filters/pagination)
router.get('/', getUsers)

// GET: Get user details by ID
router.get('/:id', getUserById)

// PUT: Update user by ID
router.put('/:id', updateUser)

// DELETE: Delete user by ID
router.delete('/:id', deleteUser)

export default router
