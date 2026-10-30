import mongoose from 'mongoose'
import Task from '../models/Task.js'

// Express 4 does not catch errors from async functions, so we wrap them.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Only allow these fields from the request body (ignore anything else)
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

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(pickFields(req.body))
  res.status(201).json({ success: true, task })
})

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.status(200).json({ success: true, count: tasks.length, tasks })
})

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findById(req.params.id)
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, task })
})

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    new: true, // return the updated document
    runValidators: true, // apply schema rules on update too
  })
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, task })
})

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  checkId(req.params.id, res)
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) taskNotFound(res)
  res.status(200).json({ success: true, message: 'Task deleted' })
})
