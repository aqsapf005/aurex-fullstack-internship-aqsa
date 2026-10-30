// One place for every request to our backend.
// It adds the JWT automatically and turns errors into readable messages.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const TOKEN_KEY = 'aurex_token'

// NOTE: localStorage is simple and fine for learning, but any JavaScript on the page can read it
// (XSS risk). Production apps often use httpOnly cookies instead. Follow your mentor's guidance.
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// AuthContext registers a function here so a 401 response can log the user out
let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    // Token missing / expired / invalid -> force logout (but not for login/register calls)
    if (response.status === 401 && auth && token && onUnauthorized) onUnauthorized()
    throw new Error(data?.message || `Request failed (HTTP ${response.status})`)
  }
  return data
}
