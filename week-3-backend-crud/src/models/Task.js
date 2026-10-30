import mongoose from 'mongoose'

// Schema = the shape and rules of a document. Model = the tool to work with the "tasks" collection.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be 100 characters or less'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be 500 characters or less'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium or high',
      },
      default: 'medium',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
)

const Task = mongoose.model('Task', taskSchema)
export default Task
