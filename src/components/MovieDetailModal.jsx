import React from 'react';
function MovieDetailModal({ movie, isOpen, onClose, isDarkMode }) {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto 
      ${isDarkMode ? 'bg-opacity-70' : ''}`}>
      <div className={`
        relative 
        flex 
        w-full 
        h-full 
        max-w-full 
        max-h-full 
        overflow-hidden
        bg-gray-800
        text-white
      `}>
        {/* Close Button */}
        <button 
          className={`
            absolute 
            top-4 
            right-8
            z-10 
            w-10 
            h-10 
            rounded-full 
            flex 
            items-center 
            justify-center 
            bg-red-700
            text-white
            cursor-pointer
          `}
          onClick={onClose}
        >
          ✕
        </button>
        
        {/* Image Section - 20% width */}
        <div className="w-2/8 h-full">
          <img 
            src={movie.main_picture} 
            alt={movie.title} 
            className="h-[55vh] object-cover absolute top-15 left-13"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        {/* Details Section - 80% width */}
        <div className={`
          w-6/8 
          p-8 
          overflow-y-auto 
          bg-gray-800 
          text-gray-200
        `}>
          <h2 className="text-4xl font-bold mb-6">{movie.title}</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <p className="font-semibold">Japanese Title</p>
              <p>{movie.title_japanese || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Type</p>
              <p>{movie.type?.toUpperCase() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Episodes</p>
              <p>{movie.episodes || 'N/A'}</p>
            </div>
            <div>
              <p className="font-semibold">Score</p>
              <p>{movie.score}/10 (by {movie.scored_by} users)</p>
            </div>
            <div>
              <p className="font-semibold">Aired</p>
              <p>{movie.start_date} to {movie.end_date}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{movie.status?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
            <p className="text-base leading-relaxed">
              {movie.synopsis || 'No description available.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Additional Details</h3>
              <div>
                <p className="font-semibold">Genres</p>
                <p className="text-base">
                  {movie.genres ? 
                    movie.genres.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>

                <p className="font-semibold mt-4">Themes</p>
                <p className="text-base">
                  {movie.themes ? 
                    movie.themes.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>

                <p className="font-semibold mt-4">Demographics</p>
                <p className="text-base">
                  {movie.demographics ? 
                    movie.demographics.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Production</h3>
              <div>
                <p className="font-semibold">Studios</p>
                <p className="text-base">
                  {movie.studios ? 
                    movie.studios.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>

                <p className="font-semibold mt-4">Producers</p>
                <p className="text-base">
                  {movie.producers ? 
                    movie.producers.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>

                <p className="font-semibold mt-4">Licensors</p>
                <p className="text-base">
                  {movie.licensors ? 
                    movie.licensors.replace(/[\[\]']/g, '').split(',').join(', ') 
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MovieDetailModal;