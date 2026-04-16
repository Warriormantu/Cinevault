import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToFavorites, removeFavorite, checkIfFavorite } from '../services/user';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        setMovie(res.data);
        
        // Check if movie is already in favorites
        try {
          const favRes = await checkIfFavorite(id);
          setIsFav(favRes.data.isFavorite);
        } catch (favError) {
          console.log("Could not check favorite status (user may not be logged in)");
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      setAddingToList(true);
      if (isFav) {
        await removeFavorite(id);
      } else {
        await addToFavorites(id);
      }
      setIsFav(!isFav);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Error updating favorites. Make sure you are logged in!');
    } finally {
      setAddingToList(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center flex-col">
        <div className="text-2xl text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl">No movie found</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition text-sm font-bold"
        >
          ⬅ Back
        </button>
      </div>

      {/* Movie Header */}
      <div className="relative h-96 bg-gradient-to-b from-gray-800 to-black">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover opacity-40"
          />
        )}
      </div>

      {/* Movie Details */}
      <div className="max-w-5xl mx-auto px-6 py-8 relative -mt-32">
        <div className="flex gap-8">
          {/* Poster */}
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="w-48 h-72 rounded-lg shadow-2xl object-cover"
            />
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-2">
              {movie.title || movie.name}
            </h1>
            <p className="text-gray-400 mb-4 text-lg">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-xl ml-2 font-bold">
                  {movie.vote_average?.toFixed(1)}/10
                </span>
              </div>
              <span className="text-gray-400">({movie.vote_count} votes)</span>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-400 mb-2">Genres:</p>
                <div className="flex gap-2 flex-wrap">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-red-600 px-3 py-1 rounded text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || 'No overview available'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={toggleFavorite}
                disabled={addingToList}
                className={`px-6 py-3 rounded font-bold text-white transition ${
                  isFav
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addingToList ? 'Adding...' : isFav ? '✓ In My List' : '+ My List'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {movie.runtime && (
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-lg font-bold">{movie.runtime} min</p>
                </div>
              )}
              {movie.budget > 0 && (
                <div>
                  <p className="text-gray-400">Budget</p>
                  <p className="text-lg font-bold">${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-gray-400">Revenue</p>
                  <p className="text-lg font-bold">${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className="text-lg font-bold">{movie.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
