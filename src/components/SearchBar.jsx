import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <span className="search-icon">⌕</span>
      <input
        id="hero-search-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search for a movie, TV show or actor..."
        aria-label="Search movies"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      <button type="submit" id="hero-search-btn">
        Search <span>›</span>
      </button>
    </form>
  );
}
