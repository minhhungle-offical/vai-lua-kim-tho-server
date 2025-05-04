import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên không được để trống'],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: 6,
      select: false, // Không trả về password khi find()
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    avatar: {
      type: String, // Link ảnh
      default: '',
    },
    deleted: {
      type: Boolean,
      default: false, // Dùng cho soft-delete
      select: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
)

// Index cho tìm kiếm nhanh
userSchema.index({ name: 'text', email: 'text' })

const User = mongoose.model('User', userSchema)
export default User
