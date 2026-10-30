import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    // OWNERSHIP: every task belongs to exactly one user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
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
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium or high',
      },
      default: 'medium',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
