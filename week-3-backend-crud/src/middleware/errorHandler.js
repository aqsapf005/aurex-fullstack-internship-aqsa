// Runs when no route matched
export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`))
}

// Central error handler: every error in the app ends up here
export const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || 'Server error'

  // Mongoose validation failed (e.g. title too short)
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }
  // Invalid ObjectId, e.g. /api/tasks/abc
  if (err.name === 'CastError') {
    status = 400
    message = `Invalid ${err.path}: ${err.value}`
  }
  // Duplicate value on a unique field
  if (err.code === 11000) {
    status = 409
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`
  }
  // Broken JSON in the request body
  if (err.type === 'entity.parse.failed') {
    status = 400
    message = 'Invalid JSON in request body'
  }

  if (status === 500) console.error(err)

  res.status(status).json({
    success: false,
    message: status === 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message,
  })
}
