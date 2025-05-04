export default {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  expiresIn: '7d', // Token hết hạn sau 7 ngày
}
