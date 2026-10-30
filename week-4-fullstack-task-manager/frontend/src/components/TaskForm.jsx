import { useState } from 'react'

function TaskForm({ editingTask, saving, onSave, onCancelEdit }) {
  const isEditing = Boolean(editingTask)

  const [values, setValues] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'medium',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = {}
    const title = values.title.trim()
    if (!title) found.title = 'Title is required.'
    else if (title.length < 3) found.title = 'Title must be at least 3 characters.'
    else if (title.length > 100) found.title = 'Title must be 100 characters or less.'
    if (values.description.length > 500) found.description = 'Description must be 500 characters or less.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const ok = await onSave({
      title,
      description: values.description.trim(),
      priority: values.priority,
    })
    // Only clear the form after a successful CREATE (edit mode closes via the "key" change)
    if (ok && !isEditing) setValues({ title: '', description: '', priority: 'medium' })
  }

  return (
    <form className="card task-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Edit task' : 'Add a task'}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" value={values.title} onChange={handleChange} placeholder="What needs to be done?" />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows="2" value={values.description} onChange={handleChange} />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-row">
        <div className="field priority-field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add task'}
          </button>
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default TaskForm
