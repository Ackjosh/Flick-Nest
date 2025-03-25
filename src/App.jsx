import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import MovieList from './components/MovieList';
import MovieDetailModal from './components/MovieDetailModal';
import Footer from './components/Footer';
import movieData from './assets/anime_list.json';
import './utility.css';
import './App.css';

function App() {
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Set initial filtered movies when component mounts
    setFilteredMovies(movieData);
  }, []);

  // Search movie function
  const searchMovie = (searchQuery) => {
    if (!searchQuery) {
      // If search query is empty, show all movies
      setFilteredMovies(movieData);
      return;
    }

    const filtered = movieData.filter(movie => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        movie.title.toLowerCase().includes(lowerQuery) ||
        (movie.title_english && movie.title_english.toLowerCase().includes(lowerQuery)) ||
        movie.start_year.toString().includes(lowerQuery) ||
        movie.status.toLowerCase().includes(lowerQuery) ||
        // Check genres (parsing the string representation of array)
        (movie.genres && movie.genres.toLowerCase().includes(lowerQuery)) ||
        // Check studios (parsing the string representation of array)
        (movie.studios && movie.studios.toLowerCase().includes(lowerQuery))
      );
    });

    setFilteredMovies(filtered);
  };

  // Reset to show all movies
  const resetMovieList = () => {
    setFilteredMovies(movieData);
  };

  // Show movie details
  const showMovieDetails = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Layout>
      <div className={`flex flex-col h-full ${isDarkMode ? 'yoyo' : ''}`}>
        <Header 
          onSearch={searchMovie} 
          onResetList={resetMovieList} 
          toggleDarkMode={toggleDarkMode} 
          isDarkMode={isDarkMode} 
        />
        
        <main className="flex-grow overflow-y-auto p-4">
          <MovieList 
            movies={filteredMovies} 
            onMovieClick={showMovieDetails} 
            isDarkMode={isDarkMode} 
          />
          
          {selectedMovie && (
            <MovieDetailModal 
              movie={selectedMovie} 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              isDarkMode={isDarkMode} 
            />
          )}
        </main>
        
        <Footer />
      </div>
    </Layout>
  );
}

export default App;