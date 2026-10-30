import express from 'express'
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect) // every task route below requires a valid JWT

router.route('/').get(getTasks).post(createTask)
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask)

export default router
