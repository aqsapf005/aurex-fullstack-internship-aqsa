import TaskItem from './TaskItem'

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  // Conditional rendering: show a message when there is nothing to display
  if (tasks.length === 0) {
    return <p className="empty">Nothing here. Add your first task above!</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // "key" helps React track which item is which when the list changes
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
