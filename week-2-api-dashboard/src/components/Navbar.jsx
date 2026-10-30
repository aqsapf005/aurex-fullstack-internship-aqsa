function Navbar({ view, onNavigate, total }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <h1>Employee Dashboard</h1>
        <span className="muted">{total} employees</span>
      </div>
      <div className="nav-links">
        <button
          className={view === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={view === 'form' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => onNavigate('form')}
        >
          + Add Employee
        </button>
      </div>
    </nav>
  )
}

export default Navbar
