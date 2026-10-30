import { useState, useEffect, useMemo } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from './api/usersApi'
import Navbar from './components/Navbar'
import SearchFilter from './components/SearchFilter'
import UserList from './components/UserList'
import UserDetails from './components/UserDetails'
import UserForm from './components/UserForm'
import Loader from './components/Loader'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

// JSONPlaceholder is a FAKE API: POST/PUT/DELETE return a success response
// but nothing is saved on the server. Only users 1-10 exist there, so for
// users we create locally (id > 10) we update the screen without calling the API.
const SERVER_USER_LIMIT = 10

function App() {
  // ----- data state -----
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // ----- UI state -----
  const [view, setView] = useState('dashboard') // 'dashboard' | 'form'
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }

  // GET request when the app loads (and again when the user presses "Retry")
  useEffect(() => {
    let ignore = false // prevents state updates after unmount / re-run

    async function loadUsers() {
      setLoading(true)
      setError('')
      try {
        const data = await getUsers()
        if (!ignore) setUsers(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUsers()
    return () => {
      ignore = true
    }
  }, [reloadKey])

  // Derived data: unique cities for the filter dropdown
  const cities = useMemo(
    () => [...new Set(users.map((u) => u.address?.city).filter(Boolean))].sort(),
    [users]
  )

  // Derived data: apply search + filter
  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.company?.name || '').toLowerCase().includes(term)
      const matchesCity = city === 'all' || user.address?.city === city
      return matchesSearch && matchesCity
    })
  }, [users, search, city])

  const showNotice = (type, text) => {
    setNotice({ type, text })
    setTimeout(() => setNotice(null), 4000)
  }

  // POST (create) or PUT (update)
  const handleSave = async (formData) => {
    setSaving(true)
    try {
      if (editingUser) {
        if (editingUser.id <= SERVER_USER_LIMIT) {
          await updateUser(editingUser.id, { ...editingUser, ...formData })
        }
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u))
        )
        showNotice('success', 'Employee updated successfully.')
      } else {
        await createUser(formData)
        // The fake API always answers with id 11, so we create our own unique id
        const nextId = Math.max(0, ...users.map((u) => u.id)) + 1
        setUsers((prev) => [{ ...formData, id: nextId }, ...prev])
        showNotice('success', 'Employee added successfully.')
      }
      setEditingUser(null)
      setView('dashboard')
    } catch (err) {
      showNotice('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // DELETE
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return
    try {
      if (user.id <= SERVER_USER_LIMIT) {
        await deleteUser(user.id)
      }
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      if (selectedUser?.id === user.id) setSelectedUser(null)
      showNotice('success', 'Employee deleted.')
    } catch (err) {
      showNotice('error', err.message)
    }
  }

  const startEdit = (user) => {
    setEditingUser(user)
    setSelectedUser(null)
    setView('form')
  }

  const goTo = (nextView) => {
    setEditingUser(null)
    setView(nextView)
  }

  const clearFilters = () => {
    setSearch('')
    setCity('all')
  }

  return (
    <div className="container">
      <Navbar view={view} onNavigate={goTo} total={users.length} />

      {notice && (
        <div className={`banner banner-${notice.type}`}>{notice.text}</div>
      )}

      {view === 'form' ? (
        <UserForm
          key={editingUser ? editingUser.id : 'new'}
          initialUser={editingUser}
          saving={saving}
          onSubmit={handleSave}
          onCancel={() => goTo('dashboard')}
        />
      ) : (
        <main>
          {loading && <Loader text="Loading employees..." />}

          {!loading && error && (
            <ErrorMessage
              message={error}
              onRetry={() => setReloadKey((key) => key + 1)}
            />
          )}

          {!loading && !error && (
            <>
              <SearchFilter
                search={search}
                onSearchChange={setSearch}
                city={city}
                onCityChange={setCity}
                cities={cities}
                resultCount={visibleUsers.length}
              />
              <UserList
                users={visibleUsers}
                hasAnyUsers={users.length > 0}
                onView={setSelectedUser}
                onEdit={startEdit}
                onDelete={handleDelete}
                onClearFilters={clearFilters}
              />
            </>
          )}
        </main>
      )}

      {selectedUser && (
        <UserDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}

export default App
