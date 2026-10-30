// All communication with the REST API lives in this one file.
// API used: JSONPlaceholder (free fake REST API) -> https://jsonplaceholder.typicode.com/users
const BASE_URL = 'https://jsonplaceholder.typicode.com/users'

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=UTF-8' }

async function request(url, options) {
  let response
  try {
    response = await fetch(url, options)
  } catch {
    // fetch() only rejects when the network itself fails
    throw new Error('Network error. Please check your internet connection.')
  }
  if (!response.ok) {
    // fetch() does NOT reject on 404/500, so we check response.ok ourselves
    throw new Error(`Request failed (HTTP ${response.status})`)
  }
  return response.json()
}

// GET    /users
export const getUsers = () => request(BASE_URL)

// POST   /users
export const createUser = (user) =>
  request(BASE_URL, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(user),
  })

// PUT    /users/:id
export const updateUser = (id, user) =>
  request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(user),
  })

// DELETE /users/:id
export const deleteUser = (id) =>
  request(`${BASE_URL}/${id}`, { method: 'DELETE' })
