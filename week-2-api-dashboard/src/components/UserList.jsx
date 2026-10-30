import UserCard from './UserCard'

function UserList({
  users,
  hasAnyUsers,
  onView,
  onEdit,
  onDelete,
  onClearFilters,
}) {
  // Empty state
  if (users.length === 0) {
    return (
      <div className="card empty">
        {hasAnyUsers ? (
          <>
            <p>No employees match your search or filter.</p>
            <button className="btn-secondary" onClick={onClearFilters}>
              Clear filters
            </button>
          </>
        ) : (
          <p>There are no employees yet. Use “Add Employee” to create one.</p>
        )}
      </div>
    )
  }

  return (
    <div className="user-grid">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default UserList
