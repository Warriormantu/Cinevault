import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import {
  addToFavorites,
  removeFavorite,
  checkIfFavorite,
  rateMovie,
  getUserRating,
  addToWatchlist,
  removeFromWatchlist,
  checkIfInWatchlist,
} from '../services/user';
import TrailerModal from '../components/TrailerModal';
import Row from '../components/Row';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// ── Star Rating Widget ────────────────────────────────────────────
function StarRating({ userRating, onRate, submitting }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? userRating ?? 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm">Your rating:</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={submitting}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className={`text-2xl transition-colors leading-none ${
              star <= display ? 'text-yellow-400' : 'text-gray-600'
            } hover:text-yellow-400 disabled:cursor-not-allowed`}
            title={`Rate ${star}/5`}
          >
            ★
          </button>
        ))}
      </div>
      {userRating && (
        <span className="text-yellow-400 text-sm font-semibold">{userRating}/5</span>
      )}
      {submitting && <span className="text-gray-400 text-xs ml-1">Saving…</span>}
    </div>
  );
}

// ── Cast Card ─────────────────────────────────────────────────────
function CastCard({ member }) {
  return (
    <div className="text-center group">
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#1f1f1f] border border-white/[0.06] mb-2">
        {member.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl text-gray-600">👤</span>
          </div>
        )}
      </div>
      <p className="text-white text-xs font-bold leading-tight truncate">{member.name}</p>
      <p className="text-gray-500 text-xs truncate">{member.character}</p>
    </div>
  );
}

// ── Skeleton Loading State ────────────────────────────────────────
function DetailsSkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white animate-fade-in">
      <div className="h-[280px] sm:h-[360px] lg:h-[420px] skeleton" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 relative -mt-20 z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-40 h-60 sm:w-48 sm:h-72 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="skeleton h-10 w-3/4 rounded-lg" />
            <div className="skeleton h-5 w-1/4 rounded-lg" />
            <div className="skeleton h-5 w-1/3 rounded-lg" />
            <div className="flex gap-2 mt-4">
              <div className="skeleton h-8 w-24 rounded-full" />
              <div className="skeleton h-8 w-24 rounded-full" />
            </div>
            <div className="skeleton h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [submittingWatchlist, setSubmittingWatchlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cast' | 'similar'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setActiveTab('overview');
        setIsFav(false);
        setInWatchlist(false);
        setUserRating(null);

        const [movieRes, creditsRes, videosRes, similarRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
          axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`),
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast || []);
        setVideos(videosRes.data.results || []);
        setSimilarMovies(similarRes.data.results || []);

        // Favorite check — silent fail
        try {
          const favRes = await checkIfFavorite(id);
          setIsFav(favRes.data.isFavorite);
        } catch {
          /* not logged in */
        }

        // Watchlist check — silent fail
        try {
          const watchRes = await checkIfInWatchlist(id);
          setInWatchlist(watchRes.data.inWatchlist);
        } catch {
          /* not logged in */
        }

        // User rating — silent fail
        try {
          const ratingRes = await getUserRating(id);
          if (ratingRes.data?.rating) {
            setUserRating(ratingRes.data.rating);
          }
        } catch {
          /* not rated yet */
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      setAddingToList(true);
      if (isFav) {
        await removeFavorite(id);
      } else {
        await addToFavorites(id);
      }
      setIsFav((cur) => !cur);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Error updating favorites. Make sure you are logged in!');
    } finally {
      setAddingToList(false);
    }
  };

  const toggleWatchlist = async () => {
    try {
      setSubmittingWatchlist(true);
      if (inWatchlist) {
        await removeFromWatchlist(id);
      } else {
        await addToWatchlist(id);
      }
      setInWatchlist((cur) => !cur);
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      alert('Error updating watchlist. Make sure you are logged in!');
    } finally {
      setSubmittingWatchlist(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      setSubmittingRating(true);
      await rateMovie(id, rating);
      setUserRating(rating);
    } catch (err) {
      console.error('Error rating movie:', err);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Find the first YouTube trailer
  const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  // ── Loading & Error states ──────────────────────────────────────
  if (loading) return <DetailsSkeleton />;

  if (error) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center flex-col gap-4">
        <div className="text-6xl">🎬</div>
        <p className="text-red-500 text-xl font-semibold">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-2 bg-[#e50914] px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-400 text-xl">Movie not found.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden">
        {movie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1f1f1f] to-[#0a0a0a]" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 glass px-4 py-2 rounded-xl text-sm font-semibold text-white hover:text-white/80 transition-all flex items-center gap-2 z-10"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 relative -mt-24 sm:-mt-32 lg:-mt-40 z-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-40 sm:w-52 lg:w-60 rounded-xl shadow-2xl border border-white/[0.06] object-cover"
              />
            ) : (
              <div className="w-40 sm:w-52 lg:w-60 aspect-[2/3] rounded-xl bg-[#1f1f1f] border border-white/[0.06] flex items-center justify-center">
                <span className="text-5xl">🎬</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-2">
              {movie.title || movie.name}
            </h1>

            {/* Year + tagline */}
            {movie.tagline && (
              <p className="text-gray-400 italic text-base mb-2">"{movie.tagline}"</p>
            )}
            <p className="text-gray-500 text-sm mb-4">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              {movie.runtime ? ` · ${movie.runtime} min` : ''}
              {movie.original_language ? ` · ${movie.original_language.toUpperCase()}` : ''}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-[#1f1f1f] border border-white/[0.06] px-3 py-1.5 rounded-lg">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white font-bold text-lg">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>
              <span className="text-gray-500 text-sm">
                ({movie.vote_count?.toLocaleString()} votes)
              </span>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-[#1f1f1f] border border-white/[0.06] text-sm rounded-full px-3 py-1 text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              <button
                type="button"
                onClick={toggleFavorite}
                disabled={addingToList}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFav
                    ? 'bg-[#e50914] text-white hover:bg-red-700'
                    : 'bg-[#1f1f1f] border border-white/10 text-white hover:border-white/30'
                }`}
              >
                {addingToList ? '…' : isFav ? '❤️ Favorited' : '❤️ Add to Favorites'}
              </button>

              <button
                type="button"
                onClick={toggleWatchlist}
                disabled={submittingWatchlist}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed ${
                  inWatchlist
                    ? 'bg-white text-black hover:bg-white/95 font-bold'
                    : 'bg-[#1f1f1f] border border-white/10 text-white hover:border-white/30'
                }`}
              >
                {submittingWatchlist ? '…' : inWatchlist ? '✓ In Watchlist' : '➕ Watchlist'}
              </button>

              {trailer && (
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#1f1f1f] border border-white/10 text-white hover:border-white/30 transition-all"
                >
                  ▶ Watch Trailer
                </button>
              )}
            </div>

            {/* Star Rating — only for authenticated users */}
            {isAuthenticated && (
              <div className="mb-4">
                <StarRating
                  userRating={userRating}
                  onRate={handleRate}
                  submitting={submittingRating}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="mt-8">
          <div className="flex gap-1 border-b border-white/[0.06] mb-6">
            {['overview', 'cast', 'similar'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-[#e50914]'
                    : 'text-gray-400 hover:text-white border-b-2 border-transparent'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'cast' ? 'Cast' : 'Similar'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <p className="text-gray-300 leading-relaxed text-base mb-8">
                {movie.overview || 'No overview available.'}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {movie.runtime > 0 && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Runtime</p>
                    <p className="text-white font-bold text-lg">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </p>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-white font-bold text-lg">
                      ${(movie.budget / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Revenue</p>
                    <p className="text-white font-bold text-lg">
                      ${(movie.revenue / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                )}
                {movie.status && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
                    <p className="text-white font-bold text-lg">{movie.status}</p>
                  </div>
                )}
                {movie.release_date && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Release Date</p>
                    <p className="text-white font-bold text-lg">
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {movie.vote_average > 0 && (
                  <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">TMDB Score</p>
                    <p className="text-white font-bold text-lg">
                      {movie.vote_average?.toFixed(1)} / 10
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === 'cast' && (
            <div className="animate-fade-in">
              {cast.length === 0 ? (
                <p className="text-gray-400">No cast information available.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                  {cast.slice(0, 16).map((member) => (
                    <CastCard key={member.credit_id} member={member} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Similar Tab */}
          {activeTab === 'similar' && (
            <div className="animate-fade-in">
              {similarMovies.length === 0 ? (
                <p className="text-gray-400">No similar movies found.</p>
              ) : (
                <Row title="" movies={similarMovies.slice(0, 12)} loading={false} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <TrailerModal
          trailerKey={trailer.key}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
