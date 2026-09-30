import { posterUrl } from '../api/omdb';

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><rect width="200" height="300" fill="%231a1035"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff44" font-size="14" font-family="sans-serif">No Image</text></svg>';

export default function MovieCard({ movie, onSelect, watchlist = [], onToggleWatchlist }) {
  const poster = posterUrl(movie.poster_path) || FALLBACK;
  // Only show rating if available (detail fetches have it; search results don't)
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
  // Year from normalized field (works for both search results and detail objects)
  const year = movie.year || movie.release_date?.match(/\d{4}/)?.[0] || '—';
  // Genres are embedded in the movie object (array of {id, name} or empty [])
  const movieGenres = (movie.genres || [])
    .slice(0, 2)
    .map(g => (typeof g === 'string' ? g : g.name))
    .filter(Boolean);

  const inWatchlist = watchlist.some(w => w.id === movie.id);

  function handleWatchlist(e) {
    e.stopPropagation();
    onToggleWatchlist?.(movie);
  }

  return (
    <article
      className="movie-card"
      onClick={() => onSelect?.(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect?.(movie)}
      aria-label={`${movie.title} movie card`}
    >
      {/* Poster */}
      <div className="card-poster">
        <img
          src={poster}
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={e => { e.currentTarget.src = FALLBACK; }}
        />
        <div className="card-overlay" />

        {/* Rating badge — only shown when available */}
        {rating && (
          <div className="rating-badge">
            <span className="star">★</span> {rating}
          </div>
        )}

        {/* Watchlist toggle */}
        <button
          className={`wl-btn ${inWatchlist ? 'wl-active' : ''}`}
          onClick={handleWatchlist}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {inWatchlist ? '✓' : '+'}
        </button>
      </div>

      {/* Info */}
      <div className="card-info">
        <h3 className="card-title">{movie.title}</h3>
        <p className="card-meta">
          <span>{year}</span>
          {movieGenres.length > 0 && <span className="genre-dot">·</span>}
          {movieGenres.map((g, i) => (
            <span key={i} className="genre-tag">{g}</span>
          ))}
        </p>
      </div>
    </article>
  );
}
