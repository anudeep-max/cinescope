import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  }

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Cine<span>Scope</span><b>▰</b>
      </div>

      {/* Desktop Nav */}
      <nav className={`nav-links ${mobileOpen ? 'nav-open' : ''}`}>
        <a
          className={activePage === 'home' ? 'active' : ''}
          onClick={() => { navigate('/'); setMobileOpen(false); }}
        >
          ⌂ Home
        </a>
        <a
          className={activePage === 'discover' ? 'active' : ''}
          onClick={() => { navigate('/discover'); setMobileOpen(false); }}
        >
          ◉ Discover
        </a>
        <a
          className={activePage === 'watchlist' ? 'active' : ''}
          onClick={() => { navigate('/watchlist'); setMobileOpen(false); }}
        >
          ♡ Watchlist
        </a>
      </nav>

      {/* Right Actions */}
      <div className="nav-actions">
        <button
          id="nav-search-btn"
          aria-label="Search"
          onClick={() => setSearchOpen(s => !s)}
          className={searchOpen ? 'nav-btn-active' : ''}
        >
          ⌕
        </button>
        <button id="nav-profile-btn" aria-label="Profile">●</button>
        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Floating search bar */}
      {searchOpen && (
        <form className="nav-search-bar" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>
          <input
            autoFocus
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search movies..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button type="submit">Go</button>
        </form>
      )}
    </header>
  );
}
