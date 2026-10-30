import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'

// Put this before any route that must be private.
// Expects the header:  Authorization: Bearer <token>
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  const token = header.split(' ')[1]
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    res.status(401)
    throw new Error(error.name === 'TokenExpiredError' ? 'Token expired, please log in again' : 'Invalid token')
  }

  const user = await User.findById(decoded.id)
  if (!user) {
    res.status(401)
    throw new Error('User no longer exists')
  }

  req.user = user // later code (controllers) can now use req.user
  next()
})
