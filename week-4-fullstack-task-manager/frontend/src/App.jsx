import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Loader from './components/Loader'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const { user, checking } = useAuth()
  const [page, setPage] = useState('login') // 'login' | 'register'

  // Restoring a saved session
  if (checking) return <Loader text="Checking your session..." />

  // Protected UI: the dashboard is only rendered when a user is logged in
  if (user) return <Dashboard />

  return page === 'register' ? (
    <Register onSwitch={() => setPage('login')} />
  ) : (
    <Login onSwitch={() => setPage('register')} />
  )
}

export default App
