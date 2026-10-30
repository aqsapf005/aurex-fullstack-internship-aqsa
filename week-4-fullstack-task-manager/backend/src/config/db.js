import mongoose from 'mongoose'

// On Vercel the code runs as short-lived serverless functions that can be re-used.
// We cache the connection so every request does not open a brand-new one.
const cache = globalThis.__mongooseCache || (globalThis.__mongooseCache = { promise: null })

const connectDB = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing')
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing')

  if (mongoose.connection.readyState === 1) return // already connected

  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URI).then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}`)
      return conn
    })
  }
  try {
    await cache.promise
  } catch (error) {
    cache.promise = null // allow a retry on the next request
    throw error
  }
}

export default connectDB
