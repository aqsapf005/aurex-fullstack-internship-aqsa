const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

function FilterBar({ status, onStatusChange, priority, onPriorityChange, count }) {
  return (
    <section className="filter-bar">
      <div className="status-tabs" role="group" aria-label="Filter by status">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={status === option.value ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="priority-filter">
        <label htmlFor="priorityFilter">Priority</label>
        <select id="priorityFilter" value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <p className="muted count">{count} task(s)</p>
    </section>
  )
}

export default FilterBar
