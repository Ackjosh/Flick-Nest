// src/components/Favorites.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Layout from './Layout';
import MovieDetailModal from './MovieDetailModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Favorites component now explicitly receives userId, userFavorites, and onUserToggleSuccess as props
const Favorites = ({ auth, isDarkMode, toggleDarkMode, userId, userFavorites, onUserToggleSuccess }) => {
  // We no longer need to manage 'user' or a separate 'loading' state for initial auth/data here.
  // App.jsx handles that and ensures these props are valid.

  // This state will hold the *full details* of the favorited media fetched from TMDB
  const [favoritedMedia, setFavoritedMedia] = useState([]);
  // This loading state specifically tracks the fetching of TMDB details for the favorites
  const [loadingMediaDetails, setLoadingMediaDetails] = useState(true);
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to fetch TMDB details when userFavorites prop changes
  useEffect(() => {
    const fetchMediaDetails = async () => {
      setLoadingMediaDetails(true); // Start loading TMDB details

      // If there's no user ID or the userFavorites array is empty,
      // we can immediately set favoritedMedia to empty and stop loading.
      if (!userId || userFavorites === null || userFavorites.length === 0) {
        setFavoritedMedia([]);
        setLoadingMediaDetails(false);
        console.log("Favorites: No userId or empty userFavorites. Cleared media details.");
        return;
      }

      console.log(`Favorites: Fetching TMDB details for ${userFavorites.length} items.`);
      const mediaDetailsPromises = userFavorites.map(async (item) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/media/${item.media_type}/${item.id}`);
          // Add the media_type to the fetched data, so it's consistent
          return { ...response.data, media_type: item.media_type };
        } catch (error) {
          console.error(`Favorites: Error fetching details for favorite ${item.media_type} ${item.id}:`, error);
          return null; // Return null for failed fetches to filter them out later
        }
      });

      const mediaDetails = await Promise.all(mediaDetailsPromises);
      const validMedia = mediaDetails.filter(media => media !== null); // Filter out any failed fetches
      setFavoritedMedia(validMedia);
      setLoadingMediaDetails(false); // End loading TMDB details
      console.log(`Favorites: Finished fetching TMDB details. Found ${validMedia.length} valid items.`);
    };

    fetchMediaDetails(); // Call the async function
  }, [userId, userFavorites]); // Dependencies: Re-run if userId changes or userFavorites array reference changes

  // Handler for when a table row/title is clicked to open the detail modal
  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  // Handler to close the detail modal
  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
    // Trigger the re-fetch in App.jsx via the prop
    if (onUserToggleSuccess) {
      console.log("Favorites: Closing modal, calling onUserToggleSuccess to re-fetch App.jsx data.");
      await onUserToggleSuccess(); // This will update userFavorites prop in App.jsx,
                                  // which in turn re-triggers the useEffect in THIS component.
    }
  };

  // --- Render Logic ---
  // Show a loading spinner if TMDB details are still being fetched
  if (loadingMediaDetails) {
    return (
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="ml-3 text-white">Loading your favorite movie/show details...</p>
        </div>
      </Layout>
    );
  }

  // If after loading, favoritedMedia is empty
  if (favoritedMedia.length === 0) {
    return (
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <div className="container mx-auto p-4">
          <p className="text-3xl font-bold mb-7 ml-7 text-white">
            My Favorites
          </p>
          <div className="text-center py-10 text-white">
            <p className="text-lg mb-4">Your favorites list is empty.</p>
            {/* You might want a button to navigate home or to a browse page */}
            {/* Ensure you have `useNavigate` imported if you add this */}
            {/* <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Browse Media
            </button> */}
          </div>
        </div>
      </Layout>
    );
  }

  // Render the table if favoritedMedia has items
  return (
    <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
      <div className="container mx-auto p-4">
        <p className="text-3xl font-bold mb-7 ml-7 text-white">
          My Favorites
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border-collapse">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left border-b border-gray-600"></th>
                <th className="py-2 px-4 text-left border-b border-gray-600">#</th>
                <th className="py-2 px-4 text-left border-b border-gray-600">Image</th>
                <th className="py-2 px-4 text-left border-b border-gray-600">Title</th>
                <th className="py-2 px-4 text-center border-b border-gray-600">Score</th>
                <th className="py-2 px-6 text-center border-b border-gray-600">Type</th>
                <th className="py-2 px-8 text-center border-b border-gray-600">Episodes / Runtime</th>
              </tr>
            </thead>
            <tbody>
              {favoritedMedia.map((media, index) => {
                const titleOrName = media.title || media.name || 'N/A';
                const posterUrl = media.poster_path
                  ? `https://image.tmdb.org/t/p/w92${media.poster_path}`
                  : '/placeholder-image.jpg';
                const score = media.vote_average ? media.vote_average.toFixed(1) : '-';
                const type = media.media_type ? media.media_type.toUpperCase() : 'N/A';

                let progressInfo = '-';
                if (media.media_type === 'tv') {
                  progressInfo = `${media.number_of_episodes || '?'} total`;
                } else if (media.media_type === 'movie') {
                  progressInfo = media.runtime ? `${media.runtime} min` : '-';
                }

                return (
                  <tr key={`${media.id}-${media.media_type}`} className="hover:bg-gray-700 transition">
                    <td className="py-2 px-4 border-b border-gray-700 text-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mx-auto" title="Favorited"></div>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">{index + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <img
                        src={posterUrl}
                        alt={titleOrName}
                        className="w-12 h-18 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleMediaClick(media); }}
                        className="text-blue-400 hover:underline font-semibold"
                      >
                        {titleOrName}
                      </a>
                      <div className="add-edit-more text-xs text-gray-400 mt-1">
                        <span className="edit">Edit</span> - <span className="more">More</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-center">
                      <span className="score-label">{score}</span>
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-center">{type}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-center">{progressInfo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MovieDetailModal */}
      {selectedMedia && (
        <MovieDetailModal
          movie={selectedMedia}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isDarkMode={isDarkMode}
          userId={userId} // Use the userId prop from App.jsx
          // Important: Pass *both* userWatchlist and userFavorites to the modal
          // if the modal allows toggling both statuses.
          userFavorites={userFavorites} 
          // Assuming you also pass userWatchlist from App.jsx to Favorites component if the modal needs it
          // userWatchlist={userWatchlist} 
          onUserToggleSuccess={onUserToggleSuccess} // Pass the re-fetch callback to modal
        />
      )}
    </Layout>
  );
};

export default Favorites;