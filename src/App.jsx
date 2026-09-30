import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Watchlist from './pages/Watchlist';
import './index.css';

// ── LocalStorage watchlist persistence ───────────────────────────────────────
const STORAGE_KEY = 'cinescope_watchlist';

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage quota exceeded — ignore silently
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [watchlist, setWatchlist] = useState(loadWatchlist);

  // Persist watchlist to localStorage on every change
  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  function handleToggleWatchlist(movie) {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      return exists ? prev.filter(m => m.id !== movie.id) : [...prev, movie];
    });
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          }
        />
        <Route
          path="/discover"
          element={
            <Discover
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          }
        />
        <Route
          path="/watchlist"
          element={
            <Watchlist
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
