import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Banner from '../components/Banner';
import Row from '../components/Row';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { getTrendingMovies, getPopularMovies, getUpcomingMovies } from '../services/api';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const GENRES = [
  { id: null, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 16, name: 'Animation' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 12, name: 'Adventure' },
];

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Genre filter state
  const [selectedGenre, setSelectedGenre] = useState(null); // null = All
  const [genreMovies, setGenreMovies] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);

  const { user } = useAuth();

  // Fetch the standard 3 rows on mount
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

  // Welcome toast
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

  // Fetch by genre when selected genre changes (not null)
  useEffect(() => {
    if (selectedGenre === null) {
      setGenreMovies([]);
      return;
    }

    const fetchByGenre = async () => {
      try {
        setGenreLoading(true);
        const res = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc&language=en-US&page=1`
        );
        setGenreMovies(res.data.results || []);
      } catch (err) {
        console.error('Error fetching genre movies:', err);
        setGenreMovies([]);
      } finally {
        setGenreLoading(false);
      }
    };

    fetchByGenre();
  }, [selectedGenre]);

  const handleSearch = (results, query) => {
    setSearchResults(results || []);
    setSearchQuery(query);
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
  };

  const selectedGenreName = GENRES.find((g) => g.id === selectedGenre)?.name || 'All';

  return (
    <div className="bg-[#0a0a0a] min-h-screen animate-fade-in">
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Genre Filter Pills */}
      {!searchQuery && (
        <div className="px-4 sm:px-6 pt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {GENRES.map((genre) => (
              <button
                key={genre.id ?? 'all'}
                type="button"
                onClick={() => handleGenreSelect(genre.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                  selectedGenre === genre.id
                    ? 'bg-[#e50914] text-white border-[#e50914]'
                    : 'bg-[#1f1f1f] text-gray-400 border-white/[0.06] hover:border-gray-500 hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mx-4 sm:mx-6 mt-4 p-4 bg-red-900/20 border border-red-600 rounded-2xl text-red-400">
          {error}
        </div>
      )}

      {/* Search results mode */}
      {searchQuery ? (
        <div className="px-4 sm:px-6 py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-2">Search</p>
              <h2 className="text-3xl font-bold mb-2">Results for &ldquo;{searchQuery}&rdquo;</h2>
            </div>
            <p className="text-gray-400">
              {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {searchResults.length > 0 ? (
            <Row title="" movies={searchResults} loading={false} />
          ) : (
            <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/[0.06]">
              <p className="text-gray-400 text-lg">No movies found. Try another search.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="mt-8 px-6 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-white/[0.06] rounded-xl transition text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-6">
          {/* Welcome toast */}
          {showWelcome && user && (
            <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-200 animate-fade-in">
              Welcome back,{' '}
              <span className="font-semibold text-white">
                {user.username || user.id?.slice(0, 8)}
              </span>
              . 🎬
            </div>
          )}

          {/* Genre filtered view */}
          {selectedGenre !== null ? (
            <div className="mt-2">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-1">Genre</p>
                <h2 className="text-3xl font-bold">{selectedGenreName} Movies</h2>
              </div>
              <Row
                title=""
                movies={genreMovies}
                loading={genreLoading}
              />
            </div>
          ) : (
            /* Normal home view */
            <>
              <Banner />
              <div className="mt-10 space-y-10">
                <Row title="Trending Now" movies={trendingMovies} loading={loading} />
                <Row title="Popular Picks" movies={popularMovies} loading={loading} />
                <Row title="Coming Soon" movies={upcomingMovies} loading={loading} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
