export const errorHandler = (err) => {
  const statusCode = err.statusCode || 400
      return res.status(statusCode).json({
        success: false,
        message: err.message
      })
}