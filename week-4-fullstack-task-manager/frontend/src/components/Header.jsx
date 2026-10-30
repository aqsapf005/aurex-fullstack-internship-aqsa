import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="app-header">
      <div>
        <h1>Task Manager</h1>
        <p className="muted">Signed in as {user.name}</p>
      </div>
      <button className="btn-secondary" onClick={logout}>
        Logout
      </button>
    </header>
  )
}

export default Header
