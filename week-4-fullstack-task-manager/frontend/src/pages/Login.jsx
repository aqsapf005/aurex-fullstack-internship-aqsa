import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login({ onSwitch }) {
  const { login } = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = {}
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = 'Enter a valid email address.'
    if (!values.password) found.password = 'Password is required.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await login(values.email.trim(), values.password)
      // On success AuthContext sets "user" and App shows the Dashboard automatically
    } catch (err) {
      setServerError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="muted auth-sub">Log in to manage your tasks</p>

        {serverError && <div className="banner banner-error">{serverError}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={values.password} onChange={handleChange} autoComplete="current-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn-primary full" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="switch-text">
          Don&rsquo;t have an account?{' '}
          <button type="button" className="link-btn" onClick={onSwitch}>
            Register
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
