import React, { useEffect, useState } from 'react';
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
  const [showWelcome, setShowWelcome] = useState(false);
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
      } catch (fetchError) {
        console.error('Error fetching movies:', fetchError);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!user) {
      setShowWelcome(false);
      return undefined;
    }

    setShowWelcome(true);
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleSearch = (results, query) => {
    setSearchResults(results || []);
    setSearchQuery(query);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-black min-h-screen">
      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-900/20 border border-red-600 rounded-2xl text-red-400">
          {error}
        </div>
      )}

      {searchQuery ? (
        <div className="px-4 sm:px-6 py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-2">Search</p>
              <h2 className="text-3xl font-bold mb-2">Results for "{searchQuery}"</h2>
            </div>
            <p className="text-gray-400">
              {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {searchResults.length > 0 ? (
            <Row title="" movies={searchResults} />
          ) : (
            <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
              <p className="text-gray-400 text-lg">No movies found. Try another search.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="mt-8 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-8">
          {showWelcome && user && (
            <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              Welcome back, <span className="font-semibold text-white">{user.username || user.id?.slice(0, 8)}</span>.
            </div>
          )}

          <Banner />

          <div className="mt-10 space-y-10">
            <Row title="Trending Now" movies={trendingMovies} />
            <Row title="Popular Picks" movies={popularMovies} />
            <Row title="Coming Soon" movies={upcomingMovies} />
          </div>
        </div>
      )}
    </div>
  );
}
