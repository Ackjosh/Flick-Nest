import React, { useState } from 'react';
import { Heart } from 'lucide-react';

function MovieCard({ movie, onMovieClick, isDarkMode }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevents opening modal when clicking heart
    setIsFavorite(!isFavorite);
  };

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
      <div className="h-83 overflow-hidden relative">
        <img 
          src={movie.main_picture} 
          alt={movie.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        {/* Heart Icon positioned at bottom right of the image */}
        <Heart 
          className={`absolute bottom-2 right-2 w-6 h-6 cursor-pointer transition ${
            isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500 fill-gray-500'
          }`} 
          onClick={toggleFavorite} 
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
