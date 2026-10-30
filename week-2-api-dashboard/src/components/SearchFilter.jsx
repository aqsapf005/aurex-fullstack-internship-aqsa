function SearchFilter({
  search,
  onSearchChange,
  city,
  onCityChange,
  cities,
  resultCount,
}) {
  return (
    <section className="card filter-bar">
      <div className="filter-field">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search by name, email or company"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-field">
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p className="muted result-count">{resultCount} result(s)</p>
    </section>
  )
}

export default SearchFilter
