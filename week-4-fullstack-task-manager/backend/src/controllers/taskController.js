import mongoose from 'mongoose'
import Task from '../models/Task.js'
import asyncHandler from '../utils/asyncHandler.js'

const pickFields = (body) => {
  const allowed = ['title', 'description', 'completed', 'priority']
  const data = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  return data
}

const checkId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400)
    throw new Error('Invalid task id')
  }
}

const taskNotFound = (res) => {
  res.status(404)
  throw new Error('Task not found')
}

// DATA ISOLATION: every query below includes { user: req.user._id }.
// If a task exists but belongs to someone else, we answer 404 (as if it did not exist).

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...pickFields(req.body), user: req.user._id })
  res.status(201).json({ success: true, task })
})

// GET /api/tasks?status=completed|pending&priority=low|medium|high
export const getTasks = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }

  const { status, priority } = req.query
  if (status === 'completed') filter.completed = true
  else if (status === 'pending') filter.completed = false
  else if (status !== undefined && status !== 'all') {
    res.status(400)
    throw new Error('status must be all, completed or pending')
  }

  if (priority !== undefined && priority !== 'all') {
    if (!['low', 'medium', 'high'].includes(priority)) {
      res.status(400)
      throw new Error('priority must be low, medium or high')
    }
    filter.priority = priority
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 })
  res.status(200).json({ success: true, count: tasks.length, tasks })
})

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, task })
})

// PUT /api/tasks/:id  (edit fields or mark complete with { "completed": true })
export const updateTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pickFields(req.body),
    { new: true, runValidators: true }
  )
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, task })
})

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, message: 'Task deleted' })
})
