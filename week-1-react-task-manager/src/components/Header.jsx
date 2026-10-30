function Header({ total, completed }) {
  return (
    <header className="app-header">
      <h1>Task Manager</h1>
      <p className="muted">
        {total === 0
          ? 'No tasks yet'
          : `${completed} of ${total} task${total === 1 ? '' : 's'} completed`}
      </p>
    </header>
  )
}

export default Header
