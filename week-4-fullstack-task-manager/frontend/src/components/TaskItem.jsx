function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <li className={`card task-item ${task.completed ? 'done' : ''}`}>
      <input
        className="task-checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'completed'}`}
      />
      <div className="task-body">
        <div className="task-top">
          <span className="task-title">{task.title}</span>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        </div>
        {task.description && <p className="muted task-desc">{task.description}</p>}
      </div>
      <div className="task-actions">
        <button className="btn-secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
