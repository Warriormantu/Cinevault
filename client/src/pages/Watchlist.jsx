import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getWatchlist, removeFromWatchlist } from '../services/user';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// ── Skeleton ──────────────────────────────────────────────────────
function WatchlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="skeleton rounded-xl w-full" style={{ height: '240px' }} />
          <div className="skeleton h-4 rounded-lg w-3/4" />
          <div className="skeleton h-3 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Watchlist() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getWatchlist();
        const watchlistIds = res.data.watchlist || [];

        if (watchlistIds.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const movieDetails = await Promise.all(
          watchlistIds.map(async (id) => {
            try {
              const movieRes = await axios.get(
                `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
              );
              return movieRes.data;
            } catch (err) {
              console.error(`Failed to fetch movie ${id}:`, err);
              return null;
            }
          })
        );

        setMovies(movieDetails.filter(Boolean));
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load your watchlist. Make sure you are logged in.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId) => {
    // Optimistic update
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    try {
      await removeFromWatchlist(movieId);
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      // Could re-add on failure, but for simplicity just log
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#141414] to-[#0a0a0a] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition mb-4 flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <span>📖</span> My Watchlist
              </h1>
              {!loading && (
                <p className="text-gray-400 mt-1">
                  {movies.length} movie{movies.length !== 1 ? 's' : ''} saved to watch
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="flex-shrink-0 px-5 py-2.5 bg-[#e50914] hover:bg-red-700 rounded-xl font-semibold text-sm transition btn-glow"
            >
              Discover More
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-2xl p-4 mb-8 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <WatchlistSkeleton />
        ) : movies.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-7xl mb-6">📖</div>
            <h2 className="text-3xl font-bold mb-3">Your Watchlist is Empty</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Save movies you want to watch later. Browse our collection and add titles to your
              watchlist with a single click.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[#e50914] hover:bg-red-700 rounded-xl font-bold transition btn-glow"
            >
              Discover Movies
            </button>
          </div>
        ) : (
          /* Movie grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#141414] rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer card-glow transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Poster */}
                <div className="relative overflow-hidden bg-[#1f1f1f]" style={{ height: '240px' }}>
                  {movie.poster_path ? (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <span className="text-4xl text-gray-600">🎬</span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(movie.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-[#e50914] text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove from Watchlist"
                  >
                    ✕
                  </button>
                </div>

                {/* Info */}
                <div className="p-3" onClick={() => navigate(`/movie/${movie.id}`)}>
                  <h3 className="font-bold text-sm line-clamp-2 hover:text-[#e50914] transition leading-snug">
                    {movie.title || movie.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-white text-sm font-semibold">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs">({movie.vote_count?.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
