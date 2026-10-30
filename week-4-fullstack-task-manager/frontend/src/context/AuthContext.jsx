import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiRequest, getToken, setToken, clearToken, setUnauthorizedHandler } from '../api/client'

// Context lets any component read the logged-in user without passing props through every level.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // If a token is already stored, we first ask the server "who am I?" before showing the UI
  const [checking, setChecking] = useState(Boolean(getToken()))

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  // If the API ever answers 401, log out automatically
  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  // On first load: restore the session from the saved token
  useEffect(() => {
    if (!getToken()) return
    let ignore = false
    apiRequest('/auth/me')
      .then((data) => {
        if (!ignore) setUser(data.user)
      })
      .catch(() => {
        if (!ignore) clearToken()
      })
      .finally(() => {
        if (!ignore) setChecking(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password }, auth: false })
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    })
    setToken(data.token)
    setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
