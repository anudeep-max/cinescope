import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import MovieDetails from '../components/MovieDetails';
import Loading from '../components/Loading';
import { fetchGenres, discoverMovies } from '../api/omdb';

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '7.5', label: '7.5+' },
  { value: '8', label: '8+' },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [
  { value: '', label: 'Any Year' },
  ...Array.from({ length: 10 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  }),
];

export default function Discover({ watchlist, onToggleWatchlist }) {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');

  // Load genres
  useEffect(() => {
    fetchGenres()
      .then(data => setGenres(data.genres || []))
      .catch(() => {});
  }, []);

  // Discover on filter/page change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const genreObj = genres.find(g => g.id === selectedGenre);
    const genreQuery = genreObj ? genreObj.query : 'movie';

    discoverMovies({
      genreQuery,
      year,
      page,
    })
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(Math.ceil((data.totalResults || 0) / 10) || 1);
      })
      .catch(() => setError('Failed to load movies. Check your API key.'))
      .finally(() => setLoading(false));
  }, [selectedGenre, year, page, genres]);

  return (
    <div className="page">
      <div className="app-shell">
        <Navbar activePage="discover" />

        <main className="discover-main">
          <div className="discover-header">
            <h1>Discover <span className="gradient-text">Movies</span></h1>
            <p>Filter by genre or release year — powered by OMDB.</p>
          </div>

          {/* Filters */}
          <div className="filters-bar glass-card">
            {/* Genre */}
            <div className="filter-group">
              <label htmlFor="filter-genre">Genre</label>
              <select
                id="filter-genre"
                value={selectedGenre}
                onChange={e => { setSelectedGenre(e.target.value); setPage(1); }}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="filter-group">
              <label htmlFor="filter-year">Year</label>
              <select
                id="filter-year"
                value={year}
                onChange={e => { setYear(e.target.value); setPage(1); }}
              >
                {YEAR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {loading && <Loading message="Discovering movies…" />}

          {!loading && error && (
            <div className="empty-state error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <div className="empty-state">
              <span>🎬</span>
              <p>No movies match your filters.</p>
              <small>Try adjusting the genre or year.</small>
            </div>
          )}

          {!loading && !error && movies.length > 0 && (
            <>
              <MovieGrid
                movies={movies}
                onSelect={m => setSelectedMovieId(m.id)}
                watchlist={watchlist}
                onToggleWatchlist={onToggleWatchlist}
              />

              {/* Pagination */}
              <div className="pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  id="page-prev-btn"
                >
                  ‹ Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  id="page-next-btn"
                >
                  Next ›
                </button>
              </div>
            </>
          )}
        </main>

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
