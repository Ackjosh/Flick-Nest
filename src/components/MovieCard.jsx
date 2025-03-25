import React from 'react';

function MovieCard({ movie, onClick, isDarkMode }) {
  return (
    <div 
      className={`
        bg-white border border-gray-200 rounded-lg shadow-md w-69 h-78
        transform transition hover:-translate-y-1 hover:shadow-lg
        hover:cursor-pointer details kasa-kay gap-45
        ${isDarkMode ? 'yoyo' : ''}
      `}
      onClick={onClick}
    >
      <img 
        src={movie.poster} 
        alt={movie.title} 
        className="w-full h-78 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-bold">{movie.title}</h2>
      <p><strong>Year:</strong> {movie.release_year}</p>
      <p><strong>Runtime:</strong> {movie.runtime} min</p>
      <p><strong>Status:</strong> {movie.status}</p>
    </div>
  );
}

export default MovieCard;