import { useState, useEffect } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

const STORAGE_KEY = 'aurex-week1-tasks'

// Read saved tasks once, when the app first loads
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function App() {
  // All task data lives HERE (single source of truth).
  // Child components receive data and functions through props.
  const [tasks, setTasks] = useState(loadTasks)

  // Keep localStorage in sync whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title) => {
    const newTask = { id: Date.now(), title, completed: false }
    setTasks((prev) => [newTask, ...prev])
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <div className="container">
      <Header total={tasks.length} completed={completedCount} />
      <main className="card">
        <TaskForm tasks={tasks} onAddTask={addTask} />
        <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </main>
    </div>
  )
}

export default App
