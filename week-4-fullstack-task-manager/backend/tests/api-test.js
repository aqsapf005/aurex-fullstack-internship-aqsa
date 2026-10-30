// Automated API checks for the Week 4 requirements.
// 1) Start the server (npm run dev)   2) In another terminal: npm run test:api
// Needs Node 18+ (built-in fetch). Reads JWT_SECRET from .env to craft an expired token.
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const BASE = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api`
const stamp = Date.now()
const userA = { name: 'Test A', email: `a_${stamp}@test.com`, password: 'secret123' }
const userB = { name: 'Test B', email: `b_${stamp}@test.com`, password: 'secret123' }

let passed = 0
let failed = 0

async function call(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  let data = null
  try { data = await res.json() } catch { /* empty body */ }
  return { status: res.status, data }
}

function check(name, condition, extra = '') {
  if (condition) { passed++; console.log(`  PASS  ${name}`) }
  else { failed++; console.log(`  FAIL  ${name} ${extra}`) }
}

async function run() {
  console.log(`\nTesting ${BASE}\n`)

  console.log('Authentication')
  let r = await call('/auth/register', { method: 'POST', body: userA })
  check('Successful registration -> 201 + token', r.status === 201 && !!r.data?.token, JSON.stringify(r.data))
  const tokenA = r.data?.token

  r = await call('/auth/register', { method: 'POST', body: userA })
  check('Duplicate registration -> 409', r.status === 409)

  r = await call('/auth/register', { method: 'POST', body: { name: 'X', email: 'bad', password: '1' } })
  check('Invalid registration data -> 400', r.status === 400)

  r = await call('/auth/login', { method: 'POST', body: { email: userA.email, password: userA.password } })
  check('Correct login -> 200 + token', r.status === 200 && !!r.data?.token)

  r = await call('/auth/login', { method: 'POST', body: { email: userA.email, password: 'wrongpass' } })
  check('Incorrect password -> 401', r.status === 401)

  r = await call('/auth/login', { method: 'POST', body: { email: `nobody_${stamp}@test.com`, password: 'secret123' } })
  check('Unknown email (invalid login) -> 401', r.status === 401)

  console.log('\nAuthorization')
  r = await call('/tasks')
  check('Protected route without token -> 401', r.status === 401)

  r = await call('/tasks', { token: tokenA })
  check('Protected route with valid token -> 200', r.status === 200)

  r = await call('/tasks', { token: 'not.a.real.token' })
  check('Invalid token -> 401', r.status === 401)

  const decoded = jwt.decode(tokenA)
  const expired = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: -10 })
  r = await call('/tasks', { token: expired })
  check('Expired token -> 401', r.status === 401)

  r = await call('/auth/me', { token: tokenA })
  check('GET /auth/me returns the user', r.status === 200 && r.data?.user?.email === userA.email)

  console.log('\nTask CRUD')
  r = await call('/tasks', { method: 'POST', token: tokenA, body: { title: 'Write tests', priority: 'high' } })
  check('Create task -> 201', r.status === 201 && !!r.data?.task?._id)
  const taskId = r.data?.task?._id

  r = await call('/tasks', { method: 'POST', token: tokenA, body: { title: 'ab' } })
  check('Create task with invalid title -> 400', r.status === 400)

  r = await call('/tasks', { token: tokenA })
  check('Read tasks -> contains the new task', r.status === 200 && r.data.tasks.some((t) => t._id === taskId))

  r = await call(`/tasks/${taskId}`, { method: 'PUT', token: tokenA, body: { title: 'Write more tests' } })
  check('Update task -> 200', r.status === 200 && r.data.task.title === 'Write more tests')

  r = await call(`/tasks/${taskId}`, { method: 'PUT', token: tokenA, body: { completed: true } })
  check('Complete task -> completed is true', r.status === 200 && r.data.task.completed === true)

  r = await call('/tasks?status=completed', { token: tokenA })
  check('Filter status=completed returns it', r.status === 200 && r.data.tasks.some((t) => t._id === taskId))

  r = await call('/tasks?status=pending', { token: tokenA })
  check('Filter status=pending does not return it', r.status === 200 && !r.data.tasks.some((t) => t._id === taskId))

  console.log('\nData isolation (User B must not touch User A\'s task)')
  r = await call('/auth/register', { method: 'POST', body: userB })
  const tokenB = r.data?.token
  check('User B registered', r.status === 201 && !!tokenB)

  r = await call('/tasks', { token: tokenB })
  check('User B list does not contain A\'s task', r.status === 200 && !r.data.tasks.some((t) => t._id === taskId))

  r = await call(`/tasks/${taskId}`, { token: tokenB })
  check('User B GET A\'s task -> 404', r.status === 404)

  r = await call(`/tasks/${taskId}`, { method: 'PUT', token: tokenB, body: { title: 'Hacked title' } })
  check('User B PUT A\'s task -> 404', r.status === 404)

  r = await call(`/tasks/${taskId}`, { method: 'DELETE', token: tokenB })
  check('User B DELETE A\'s task -> 404', r.status === 404)

  console.log('\nCleanup')
  r = await call(`/tasks/${taskId}`, { method: 'DELETE', token: tokenA })
  check('Delete task (owner) -> 200', r.status === 200)

  r = await call(`/tasks/${taskId}`, { token: tokenA })
  check('Deleted task is gone -> 404', r.status === 404)

  console.log(`\n${passed} passed, ${failed} failed`)
  console.log('Note: "Logout" is a frontend action (the token is removed in the browser) - test it manually in the UI.')
  process.exit(failed ? 1 : 0)
}

run().catch((err) => {
  console.error('Could not reach the API. Is the server running?', err.message)
  process.exit(1)
})
