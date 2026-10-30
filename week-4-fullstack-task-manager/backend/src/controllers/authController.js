import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import generateToken from '../utils/generateToken.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })

const fail = (res, status, message) => {
  res.status(status)
  throw new Error(message)
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) fail(res, 400, 'Name, email and password are required')
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    fail(res, 400, 'Invalid input')
  }
  if (!EMAIL_PATTERN.test(email.trim())) fail(res, 400, 'Please enter a valid email')
  if (password.length < 6) fail(res, 400, 'Password must be at least 6 characters')

  const normalizedEmail = email.trim().toLowerCase()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) fail(res, 409, 'An account with this email already exists')

  // Hash the password: 10 = "salt rounds" (how much work the hashing does)
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword })

  res.status(201).json({ success: true, token: generateToken(user._id), user: publicUser(user) })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    fail(res, 400, 'Email and password are required')
  }

  // password has select:false, so we must ask for it explicitly
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password')

  // Same message for "no such user" and "wrong password" so attackers can't tell which emails exist
  if (!user) fail(res, 401, 'Invalid email or password')
  const matches = await bcrypt.compare(password, user.password)
  if (!matches) fail(res, 401, 'Invalid email or password')

  res.status(200).json({ success: true, token: generateToken(user._id), user: publicUser(user) })
})

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: publicUser(req.user) })
})
