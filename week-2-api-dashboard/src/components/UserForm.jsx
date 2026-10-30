import { useState } from 'react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function UserForm({ initialUser, saving, onSubmit, onCancel }) {
  const isEditing = Boolean(initialUser)

  const [values, setValues] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    city: initialUser?.address?.city || '',
    company: initialUser?.company?.name || '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const found = {}
    if (values.name.trim().length < 2) found.name = 'Name must be at least 2 characters.'
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = 'Enter a valid email address.'
    if (!values.city.trim()) found.city = 'City is required.'
    if (!values.company.trim()) found.company = 'Company is required.'
    return found
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // Convert flat form values into the same shape the API uses
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: { city: values.city.trim() },
      company: { name: values.company.trim() },
    })
  }

  const renderField = (name, label, type = 'text') => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
      />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  )

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
      {renderField('name', 'Full name')}
      {renderField('email', 'Email', 'email')}
      {renderField('phone', 'Phone (optional)')}
      {renderField('city', 'City')}
      {renderField('company', 'Company')}
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Employee'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default UserForm
