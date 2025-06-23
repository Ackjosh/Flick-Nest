// src/components/MovieList.jsx
import React from 'react';
import MovieCard from './MovieCard';

// MovieList now accepts onUserToggleSuccess
function MovieList({ movies, onMovieClick, isDarkMode, userId, userWatchlist, userFavorites, onUserToggleSuccess }) { // <--- ADDED onUserToggleSuccess
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap flex-row gap-5 m-3">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id || (movie.id && movie.media_type && `${movie.id}-${movie.media_type}`) || movie.id || Math.random()}
          movie={movie}
          onMovieClick={onMovieClick}
          isDarkMode={isDarkMode}
          userId={userId}
          userWatchlist={userWatchlist}
          userFavorites={userFavorites}
          onUserToggleSuccess={onUserToggleSuccess}
        />
      ))}
    </div>
  );
}

export default MovieList;