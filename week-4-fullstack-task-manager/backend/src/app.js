import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

// CLIENT_URL can hold one or several allowed frontend URLs (comma separated).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // no origin = tools like Postman / curl
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json())

// Make sure the database is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})

app.get('/', (req, res) => res.json({ success: true, message: 'Task Manager API is running' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
