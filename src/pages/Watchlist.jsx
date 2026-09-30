import { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';

export default function Watchlist({ watchlist, onToggleWatchlist }) {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <div className="page">
      <div className="app-shell">
        <Navbar activePage="watchlist" />

        <main className="watchlist-main">
          <div className="discover-header">
            <h1>My <span className="gradient-text">Watchlist</span></h1>
            <p>
              {watchlist.length === 0
                ? 'Your watchlist is empty. Start adding movies!'
                : `${watchlist.length} movie${watchlist.length > 1 ? 's' : ''} saved`}
            </p>
          </div>

          {watchlist.length === 0 ? (
            <div className="empty-state">
              <span>🎬</span>
              <p>Nothing here yet</p>
              <small>Browse trending movies or search to add something to your watchlist.</small>
            </div>
          ) : (
            <div className="movie-grid">
              {watchlist.map(movie => (
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
