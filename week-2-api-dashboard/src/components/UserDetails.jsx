function UserDetails({ user, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="card modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // clicking inside must not close it
      >
        <h2>{user.name}</h2>
        <dl className="details">
          <dt>Username</dt>
          <dd>{user.username || '-'}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Phone</dt>
          <dd>{user.phone || '-'}</dd>
          <dt>Website</dt>
          <dd>{user.website || '-'}</dd>
          <dt>Company</dt>
          <dd>{user.company?.name || '-'}</dd>
          <dt>City</dt>
          <dd>{user.address?.city || '-'}</dd>
        </dl>
        <button className="btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default UserDetails
