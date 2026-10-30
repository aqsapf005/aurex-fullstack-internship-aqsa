import { useState } from 'react'

function TaskForm({ tasks, onAddTask }) {
  // Controlled input: React state is the single source of truth for the input value
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const validate = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return 'Task title is required.'
    if (trimmed.length < 3) return 'Task title must be at least 3 characters.'
    if (trimmed.length > 100) return 'Task title must be 100 characters or less.'
    const duplicate = tasks.some(
      (task) => task.title.toLowerCase() === trimmed.toLowerCase()
    )
    if (duplicate) return 'This task already exists.'
    return ''
  }

  const handleChange = (event) => {
    setTitle(event.target.value)
    if (error) setError('') // clear the message as soon as the user types again
  }

  const handleSubmit = (event) => {
    event.preventDefault() // stop the browser from reloading the page
    const message = validate(title)
    if (message) {
      setError(message)
      return
    }
    onAddTask(title.trim())
    setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          aria-label="Task title"
        />
        <button type="submit" className="btn-primary">
          Add Task
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </form>
  )
}

export default TaskForm
