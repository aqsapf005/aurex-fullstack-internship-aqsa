import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import taskRoutes from './routes/taskRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

// Middleware (runs on every request, in this order)
app.use(cors())
app.use(express.json()) // parses JSON request bodies into req.body

// Routes
app.get('/', (req, res) => res.json({ success: true, message: 'Tasks API is running' }))
app.use('/api/tasks', taskRoutes)

// Error handling (must come LAST)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
})
