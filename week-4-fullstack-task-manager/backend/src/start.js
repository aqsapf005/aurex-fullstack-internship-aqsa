import 'dotenv/config' // must be first: loads .env before the app reads process.env
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((error) => {
    console.error('Could not start server:', error.message)
    process.exit(1)
  })
