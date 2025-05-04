import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import jwtConfig from '../config/jwt.js'
import { successResponse, errorResponse } from '../utils/responseHandler.js'

// POST: Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email and not deleted (select password explicitly)
    const user = await User.findOne({ email, deleted: false }).select('+password')
    if (!user) return errorResponse(res, 'Tài khoản không tồn tại', null, 404)

    // Check user status (active, pending, etc.)
    if (user.status !== 'active') {
      return errorResponse(res, `Tài khoản đang ở trạng thái: ${user.status}`, null, 403)
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return errorResponse(res, 'Mật khẩu không đúng', null, 401)

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    })

    // Remove password before sending response
    const { password: _, ...userData } = user.toObject()

    return successResponse(res, 'Đăng nhập thành công', {
      token,
      user: userData,
    })
  } catch (error) {
    return errorResponse(res, 'Lỗi khi đăng nhập', error)
  }
}

// POST: Register a new account
export const signUp = async (req, res) => {
  try {
    const { email, password, ...body } = req.body

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return errorResponse(res, 'Email đã được sử dụng', null, 400)
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      ...body,
    })

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    })

    // Exclude password from user data
    const { password: _, ...userData } = newUser.toObject()

    return successResponse(
      res,
      'Đăng ký thành công',
      {
        token,
        user: userData,
      },
      null,
      201,
    )
  } catch (error) {
    return errorResponse(res, 'Lỗi khi đăng ký tài khoản', error)
  }
}

// GET: Lấy thông tin người dùng từ token
export const getProfile = async (req, res) => {
  try {
    if (!req.user) return errorResponse(res, 'Không tìm thấy người dùng từ token', null, 404)

    return successResponse(res, 'Lấy thông tin người dùng thành công', req.user)
  } catch (error) {
    return errorResponse(res, 'Lỗi khi lấy thông tin người dùng', error)
  }
}
