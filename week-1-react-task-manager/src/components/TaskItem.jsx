function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.completed ? 'done' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-title">{task.title}</span>
      </label>
      <button className="btn-danger" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}

export default TaskItem
