import mongoose from 'mongoose'

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Copy .env.example to .env and fill it in.')
    process.exit(1)
  }
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Add a long random string to your .env file.')
    process.exit(1)
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
