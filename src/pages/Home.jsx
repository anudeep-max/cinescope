import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import Loading from '../components/Loading';
import { fetchTrending, searchMovies } from '../api/omdb';

export default function Home({ watchlist, onToggleWatchlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [trendingLoading, setTrendingLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const scrollRef = useRef(null);

  // Fetch trending on mount
  useEffect(() => {
    setTrendingLoading(true);
    fetchTrending()
      .then(movies => setTrending(movies || []))
      .catch(() => setTrendingError('Could not load trending movies.'))
      .finally(() => setTrendingLoading(false));
  }, []);

  // Run search if initial query present
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function runSearch(query) {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      setSearchParams({});
      return;
    }
    setSearchParams({ q: query });
    setSearchLoading(true);
    setSearchError(null);
    try {
      const data = await searchMovies(query);
      setSearchResults(data.results || []);
      if ((data.results || []).length === 0) setSearchError('no-results');
    } catch {
      setSearchError('api-error');
    } finally {
      setSearchLoading(false);
    }
  }

  // Trending scroll helpers
  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  }
  function scrollRight() {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  }

  const isSearchMode = Boolean(searchQuery);

  return (
    <div className="page">
      <div className="app-shell">
        <Navbar activePage="home" />

        <main>
          {/* ── Hero ─────────────────────────────────────────── */}
          <section className="hero">
            <div className="hero-content">
              <div className="eyebrow">DISCOVER · RATE · WATCH</div>

              <h1>
                Find your next<br />
                <span>movie.</span>
              </h1>

              <p>
                Discover movies, check ratings, and find out where you can watch them.
              </p>

              <SearchBar onSearch={runSearch} initialValue={initialQuery} />
            </div>
          </section>

          {/* ── Search Results ───────────────────────────────── */}
          {isSearchMode && (
            <section className="results-section">
              <div className="section-header">
                <h2>
                  Results for <span className="highlight">"{searchQuery}"</span>
                </h2>
                <button
                  className="clear-search"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchParams({}); }}
                  id="clear-search-btn"
                >
                  ✕ Clear
                </button>
              </div>

              {searchLoading && <Loading message="Searching…" />}

              {!searchLoading && searchError === 'no-results' && (
                <div className="empty-state">
                  <span>🎬</span>
                  <p>No movies found for "{searchQuery}"</p>
                  <small>Try a different title or keyword</small>
                </div>
              )}

              {!searchLoading && searchError === 'api-error' && (
                <div className="empty-state error">
                  <span>⚠️</span>
                  <p>Something went wrong. Check your API key or network.</p>
                </div>
              )}

              {!searchLoading && !searchError && searchResults.length > 0 && (
                <div className="movie-grid">
                  {searchResults.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={m => setSelectedMovieId(m.id)}
                      watchlist={watchlist}
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Trending ─────────────────────────────────────── */}
          {!isSearchMode && (
            <section className="trending">
              <div className="trending-header">
                <h2>Trending Movies</h2>
                <div className="trending-actions">
                  <span>🔥 Popular right now</span>
                  <button onClick={scrollLeft} aria-label="Scroll left" id="scroll-left-btn">‹</button>
                  <button onClick={scrollRight} aria-label="Scroll right" id="scroll-right-btn">›</button>
                </div>
              </div>

              {trendingLoading && <Loading message="Loading trending movies…" />}

              {!trendingLoading && trendingError && (
                <div className="empty-state error">
                  <span>⚠️</span>
                  <p>{trendingError}</p>
                </div>
              )}

              {!trendingLoading && !trendingError && (
                <div className="trending-scroll" ref={scrollRef}>
                  {trending.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={m => setSelectedMovieId(m.id)}
                      watchlist={watchlist}
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </main>

        {/* ── Movie Details Modal ───────────────────────────── */}
        {selectedMovieId && (
          <MovieDetails
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            watchlist={watchlist}
            onToggleWatchlist={onToggleWatchlist}
          />
        )}
      </div>
    </div>
  );
}
