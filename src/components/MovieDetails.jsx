import { useEffect, useState } from 'react';
import { fetchMovieDetails, posterUrl } from '../api/omdb';
import Loading from './Loading';

const FALLBACK_POSTER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1035"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff44" font-size="14" font-family="sans-serif">No Image</text></svg>';

// Source-label map for ratings
const RATING_SOURCE = {
  'Internet Movie Database': 'IMDb',
  'Rotten Tomatoes': 'RT',
  'Metacritic': 'MC',
};

export default function MovieDetails({ movieId, onClose, watchlist, onToggleWatchlist }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(null);
    setMovie(null);

    fetchMovieDetails(movieId)
      .then(data => {
        if (!data) setError('Movie not found.');
        else setMovie(data);
      })
      .catch(() => setError('Failed to load movie details. Please try again.'))
      .finally(() => setLoading(false));
  }, [movieId]);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const inWatchlist = movie && watchlist?.some(w => w.id === movie.id);

  // JustWatch search URL for this movie
  const justWatchUrl = movie?.title
    ? `https://www.justwatch.com/in/search?q=${encodeURIComponent(movie.title)}`
    : null;

  if (!movieId) return null;

  return (
    <div className="details-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="details-modal" role="dialog" aria-modal="true" aria-label="Movie details">
        <button className="details-close" onClick={onClose} aria-label="Close">✕</button>

        {loading && <Loading message="Loading movie details…" />}

        {error && (
          <div className="details-error">
            <p>⚠️ {error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        )}

        {movie && !loading && (
          <>
            {/* Hero backdrop — OMDB has no backdrop; use a stylised gradient with poster */}
            <div className="details-backdrop omdb-backdrop">
              <div
                className="omdb-backdrop-blur"
                style={{ backgroundImage: movie.poster_path ? `url(${movie.poster_path})` : undefined }}
              />
              <div className="details-backdrop-overlay" />
            </div>

            {/* Content */}
            <div className="details-content">
              {/* Poster */}
              <div className="details-poster">
                <img
                  src={posterUrl(movie.poster_path) || FALLBACK_POSTER}
                  alt={`${movie.title} poster`}
                  onError={e => { e.currentTarget.src = FALLBACK_POSTER; }}
                />
                {movie.rated && <span className="rated-badge">{movie.rated}</span>}
              </div>

              {/* Info */}
              <div className="details-info">
                <h2 className="details-title">{movie.title}</h2>

                {/* Stats row */}
                <div className="details-stats">
                  {movie.vote_average > 0 && (
                    <span className="details-rating">
                      ★ {movie.vote_average.toFixed(1)}
                      <small> / 10</small>
                    </span>
                  )}
                  {movie.year && <span className="details-year">{movie.year}</span>}
                  {movie.runtime > 0 && (
                    <span className="details-runtime">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  )}
                  {movie.original_language && (
                    <span className="details-lang">{movie.original_language.toUpperCase()}</span>
                  )}
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="details-genres">
                    {movie.genres.map(g => (
                      <span key={g.id} className="details-genre-tag">{g.name}</span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {movie.overview && (
                  <div className="details-overview">
                    <h4>Overview</h4>
                    <p>{movie.overview}</p>
                  </div>
                )}

                {/* OMDB multi-source ratings */}
                {movie.ratings?.length > 0 && (
                  <div className="omdb-ratings">
                    {movie.ratings.map(r => (
                      <div key={r.Source} className="omdb-rating-pill">
                        <span className="omdb-rating-source">
                          {RATING_SOURCE[r.Source] || r.Source}
                        </span>
                        <span className="omdb-rating-value">{r.Value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Director & Cast */}
                <div className="details-credits">
                  {movie.director && (
                    <p><span className="credit-label">Director</span> {movie.director}</p>
                  )}
                  {movie.actors && (
                    <p><span className="credit-label">Cast</span> {movie.actors}</p>
                  )}
                  {movie.country && (
                    <p><span className="credit-label">Country</span> {movie.country}</p>
                  )}
                  {movie.boxOffice && (
                    <p><span className="credit-label">Box Office</span> {movie.boxOffice}</p>
                  )}
                </div>

                {/* Awards */}
                {movie.awards && (
                  <p className="details-popularity">🏆 {movie.awards}</p>
                )}

                {/* Watchlist button */}
                <button
                  className={`details-wl-btn ${inWatchlist ? 'wl-active' : ''}`}
                  onClick={() => onToggleWatchlist?.(movie)}
                  id="details-watchlist-btn"
                >
                  {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>

                {/* Where to Watch — links to JustWatch since OMDB has no streaming data */}
                <div className="watch-providers">
                  <h3 className="wp-title">Where to Watch</h3>
                  <p className="wp-omdb-notice">
                    Streaming availability is sourced via JustWatch.
                  </p>
                  {justWatchUrl && (
                    <a
                      href={justWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="justwatch-btn"
                      id="justwatch-link"
                    >
                      🎬 Find on JustWatch →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
