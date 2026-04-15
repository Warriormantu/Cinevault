import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { getTrendingMovies, getPopularMovies, getUpcomingMovies } from '../services/api';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [trending, popular, upcoming] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getUpcomingMovies(),
        ]);

        setTrendingMovies(trending || []);
        setPopularMovies(popular || []);
        setUpcomingMovies(upcoming || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (results, query) => {
    setSearchResults(results || []);
    setSearchQuery(query);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Error State */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="px-6 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              🔍 Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-400">
              {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {searchResults.length > 0 ? (
            <Row title="" movies={searchResults} />
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 text-center border border-gray-800">
              <p className="text-gray-400 text-lg">No movies found. Try another search!</p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="mt-8 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            ← Back to Home
          </button>
        </div>
      )}

      {/* Main Content (when not searching) */}
      {!searchQuery && (
        <div className="px-6 py-8">
          {/* Welcome Message */}
          {user && (
            <div className="mb-8 p-4 bg-gradient-to-r from-red-600/20 to-transparent rounded-lg border border-red-600/30 hover:from-red-600/30 transition">
              <p className="text-red-400 text-sm">
                👋 Welcome back, <span className="font-bold text-red-300">{user.username || user.id?.slice(0, 8)}</span>!
              </p>
            </div>
          )}
          
          <Banner />
          
          <Row title="🔥 Trending Now" movies={trendingMovies} />
          <Row title="⭐ Popular" movies={popularMovies} />
          <Row title="🎬 Upcoming" movies={upcomingMovies} />
        </div>
      )}
    </div>
  );
}
