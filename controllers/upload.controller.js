import { successResponse, errorResponse } from '../utils/responseHandler.js'

// POST: Upload avatar image
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return errorResponse(res, 'Không tìm thấy file hợp lệ', null, 400)
    }

    return successResponse(res, 'Tải ảnh thành công', {
      url: req.file.path,
    })
  } catch (error) {
    return errorResponse(res, 'Lỗi khi tải ảnh lên Cloudinary', error)
  }
}
