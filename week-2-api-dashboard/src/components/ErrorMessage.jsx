function ErrorMessage({ message, onRetry }) {
  return (
    <div className="banner banner-error error-box" role="alert">
      <p>Something went wrong: {message}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
