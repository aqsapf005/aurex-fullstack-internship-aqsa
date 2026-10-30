import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register({ onSwitch }) {
  const { register } = useAuth()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const validate = () => {
    const found = {}
    if (values.name.trim().length < 2) found.name = 'Name must be at least 2 characters.'
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = 'Enter a valid email address.'
    if (values.password.length < 6) found.password = 'Password must be at least 6 characters.'
    if (values.confirm !== values.password) found.confirm = 'Passwords do not match.'
    return found
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      await register(values.name.trim(), values.email.trim(), values.password)
    } catch (err) {
      setServerError(err.message)
      setSubmitting(false)
    }
  }

  const renderField = (name, label, type = 'text', autoComplete) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={values[name]} onChange={handleChange} autoComplete={autoComplete} />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create account</h1>
        <p className="muted auth-sub">Start organizing your tasks</p>

        {serverError && <div className="banner banner-error">{serverError}</div>}

        {renderField('name', 'Name', 'text', 'name')}
        {renderField('email', 'Email', 'email', 'email')}
        {renderField('password', 'Password', 'password', 'new-password')}
        {renderField('confirm', 'Confirm password', 'password', 'new-password')}

        <button type="submit" className="btn-primary full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="switch-text">
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={onSwitch}>
            Log in
          </button>
        </p>
      </form>
    </div>
  )
}

export default Register
