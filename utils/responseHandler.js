// utils/responseHandler.js

export const successResponse = (res, message, data = null, pagination = null, code = 200) => {
  const response = {
    success: true,
    message,
    data,
  }

  if (pagination) response.pagination = pagination

  return res.status(code).json(response)
}

export const errorResponse = (res, message = 'Lỗi hệ thống', error = null, code = 500) => {
  return res.status(code).json({
    success: false,
    message,
    error: error?.message || error || 'Không xác định',
  })
}
