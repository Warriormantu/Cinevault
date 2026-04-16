import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getFavorites, removeFavorite } from '../services/user';

const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

export default function MyList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        setLoading(true);
        
        // Get favorite movie IDs
        const favRes = await getFavorites();
        const favoriteIds = favRes.data.favorites || [];
        
        if (favoriteIds.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        // Fetch details for each movie
        const movieDetails = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              const res = await axios.get(
                `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
              );
              return res.data;
            } catch (err) {
              console.error(`Error fetching movie ${id}:`, err);
              return null;
            }
          })
        );

        // Filter out any that failed
        setMovies(movieDetails.filter(m => m !== null));
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load your list. Make sure you are logged in!');
      } finally {
        setLoading(false);
      }
    };

    fetchMyList();
  }, []);

  const handleRemove = async (movieId) => {
    try {
      await removeFavorite(movieId);
      setMovies(movies.filter(m => m.id !== movieId));
    } catch (err) {
      console.error('Error removing movie:', err);
      alert('Error removing movie from your list');
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl">Loading your list...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white mb-4 transition"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold mb-2">🎬 My List</h1>
          <p className="text-gray-400">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} in your watchlist
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {movies.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
            <p className="text-5xl mb-4">🎭</p>
            <h2 className="text-3xl font-bold mb-2">Your List is Empty</h2>
            <p className="text-gray-400 mb-6">
              Add movies to your list by clicking "+ My List" on any movie details page!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 px-8 py-3 rounded font-bold hover:bg-red-700 transition"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition group cursor-pointer"
              >
                {/* Poster */}
                <div className="relative overflow-hidden bg-gray-800 h-64">
                  {movie.poster_path ? (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition"></div>
                      <button
                        onClick={() => handleRemove(movie.id)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Remove from My List"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-bold text-sm line-clamp-2 hover:text-red-600 transition"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm ml-1 font-bold">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      ({movie.vote_count} votes)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {movies.length > 0 && (
          <div className="mt-16 bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h3 className="text-lg font-bold mb-4">💡 Tip</h3>
            <p className="text-gray-300">
              Click any movie to see more details or remove it from your list by clicking the ✕ button. Your list is automatically saved!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
