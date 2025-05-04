import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

// GET: Fetch list of users with pagination, search, and filters
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const query = { deleted: false }

    // Apply search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    // Filter by role
    if (role) query.role = role

    // Filter by status
    if (status) query.status = status

    const totalUsers = await User.countDocuments(query)

    const users = await User.find(query).skip(skip).limit(parseInt(limit)).select('-password')

    return successResponse(res, 'Lấy danh sách người dùng thành công', {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        limit: parseInt(limit),
      },
    })
  } catch (error) {
    return errorResponse(res, 'Lỗi khi lấy danh sách người dùng', error)
  }
}

// GET: Fetch user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user || user.deleted) {
      return errorResponse(res, 'Người dùng không tồn tại', null, 404)
    }

    return successResponse(res, 'Lấy chi tiết người dùng thành công', user)
  } catch (error) {
    return errorResponse(res, 'Lỗi khi lấy thông tin người dùng', error)
  }
}

// PUT: Update user information
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!updatedUser) {
      return errorResponse(res, 'Người dùng không tồn tại', null, 404)
    }

    return successResponse(res, 'Cập nhật người dùng thành công', updatedUser)
  } catch (error) {
    return errorResponse(res, 'Lỗi khi cập nhật người dùng', error)
  }
}

// DELETE: Soft delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true })

    if (!user) {
      return errorResponse(res, 'Người dùng không tồn tại', null, 404)
    }

    return successResponse(res, 'Xóa người dùng thành công')
  } catch (error) {
    return errorResponse(res, 'Lỗi khi xóa người dùng', error)
  }
}
