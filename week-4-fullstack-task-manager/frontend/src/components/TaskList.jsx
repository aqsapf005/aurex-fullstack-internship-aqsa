import TaskItem from './TaskItem'

function TaskList({ tasks, filtersActive, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="card empty">
        {filtersActive
          ? 'No tasks match these filters.'
          : 'No tasks yet. Add your first task above!'}
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
