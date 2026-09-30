import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onSelect, watchlist, onToggleWatchlist, className = '' }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className={`movie-grid ${className}`}>
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelect={onSelect}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
}
