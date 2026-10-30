function UserCard({ user, onView, onEdit, onDelete }) {
  return (
    <article className="card user-card">
      <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
      <h3>{user.name}</h3>
      <p className="muted">{user.email}</p>
      <p>
        <strong>{user.company?.name}</strong>
        <span className="muted"> · {user.address?.city}</span>
      </p>
      <div className="card-actions">
        <button className="btn-secondary" onClick={() => onView(user)}>
          View
        </button>
        <button className="btn-secondary" onClick={() => onEdit(user)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(user)}>
          Delete
        </button>
      </div>
    </article>
  )
}

export default UserCard
