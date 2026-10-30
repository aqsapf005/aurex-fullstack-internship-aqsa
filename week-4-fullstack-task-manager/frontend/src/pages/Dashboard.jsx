import { useState, useEffect } from 'react'
import { apiRequest } from '../api/client'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import FilterBar from '../components/FilterBar'
import TaskList from '../components/TaskList'
import Loader from '../components/Loader'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all') // all | pending | completed
  const [priority, setPriority] = useState('all') // all | low | medium | high
  const [editingTask, setEditingTask] = useState(null)
  const [saving, setSaving] = useState(false)

  // Load tasks from the backend (again whenever a filter changes).
  // The filtering itself is done by the server through query parameters.
  useEffect(() => {
    let ignore = false

    async function loadTasks() {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)
        if (priority !== 'all') params.set('priority', priority)
        const query = params.toString()
        const data = await apiRequest(`/tasks${query ? `?${query}` : ''}`)
        if (!ignore) setTasks(data.tasks)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadTasks()
    return () => {
      ignore = true
    }
  }, [status, priority])

  // Does a task belong in the list for the current filters?
  const matchesFilters = (task) =>
    (status === 'all' || (status === 'completed') === task.completed) &&
    (priority === 'all' || task.priority === priority)

  // Create or edit (the form is used for both)
  const handleSave = async (formData) => {
    setSaving(true)
    setError('')
    try {
      if (editingTask) {
        const data = await apiRequest(`/tasks/${editingTask._id}`, { method: 'PUT', body: formData })
        setTasks((prev) =>
          prev.map((t) => (t._id === data.task._id ? data.task : t)).filter(matchesFilters)
        )
        setEditingTask(null)
      } else {
        const data = await apiRequest('/tasks', { method: 'POST', body: formData })
        if (matchesFilters(data.task)) setTasks((prev) => [data.task, ...prev])
      }
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task) => {
    setError('')
    try {
      const data = await apiRequest(`/tasks/${task._id}`, {
        method: 'PUT',
        body: { completed: !task.completed },
      })
      setTasks((prev) =>
        prev.map((t) => (t._id === data.task._id ? data.task : t)).filter(matchesFilters)
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setError('')
    try {
      await apiRequest(`/tasks/${task._id}`, { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => t._id !== task._id))
      if (editingTask?._id === task._id) setEditingTask(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const filtersActive = status !== 'all' || priority !== 'all'

  return (
    <div className="container">
      <Header />

      <TaskForm
        // "key" resets the form's internal state when we switch between add and edit
        key={editingTask ? editingTask._id : 'new'}
        editingTask={editingTask}
        saving={saving}
        onSave={handleSave}
        onCancelEdit={() => setEditingTask(null)}
      />

      {error && <div className="banner banner-error">{error}</div>}

      <FilterBar
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        count={tasks.length}
      />

      {loading ? (
        <Loader text="Loading your tasks..." />
      ) : (
        <TaskList
          tasks={tasks}
          filtersActive={filtersActive}
          onToggle={handleToggle}
          onEdit={setEditingTask}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default Dashboard
