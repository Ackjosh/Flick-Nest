import React from 'react';

function MovieCard({ movie, onMovieClick, isDarkMode }) {
  return (
    <div 
      className={`
        movie-card 
        w-80
        h-105
        mb-10
        m-auto
        rounded-lg
        overflow-hidden
        shadow-lg 
        cursor-pointer 
        transition 
        transform 
        hover:scale-105 
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
      `}
      onClick={() => onMovieClick(movie)}
    >
      <div className="h-83 overflow-hidden">
        <img 
          src={movie.main_picture} 
          alt={movie.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if main picture fails to load
            e.target.onerror = null; 
            e.target.src = '/placeholder-image.jpg'; // Make sure to have a placeholder in public folder
          }}
        />
      </div>
      <div className="p-2">
        <h3 className="text-sm font-bold truncate">
          {movie.title}
        </h3>
        <p className="text-xs truncate">
          {movie.start_year} | {movie.type.toUpperCase()}
        </p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs">
            Score: {movie.score}
          </span>
          <span className="text-xs">
            Episodes: {movie.episodes}
          </span>
        </div>
      </div>
    </div>
  );
}

function MovieList({ movies, onMovieClick, isDarkMode }) {
  return (
    <div className="flex flex-wrap flex-row gap-5 m-3">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.anime_id} 
          movie={movie} 
          onMovieClick={onMovieClick}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}

export default MovieList;