import jwt from 'jsonwebtoken'

// The token payload only holds the user id. Never put the password or secrets inside a JWT.
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

export default generateToken
