import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, getWatchlist, getStats } from '../services/user';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
          accent ? 'bg-[#e50914]/20' : 'bg-white/[0.05]'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-bold leading-tight">{value ?? '—'}</p>
      </div>
    </div>
  );
}

// ── Quick Link Card ────────────────────────────────────────────────
function QuickLink({ icon, label, to, navigate }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="bg-[#141414] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3 hover:border-white/20 hover:bg-[#1a1a1a] transition-all w-full text-left group"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
        {label}
      </span>
      <span className="ml-auto text-gray-600 group-hover:text-gray-400 transition">→</span>
    </button>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-5 mb-10">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-6 w-40 rounded-lg" />
            <div className="skeleton h-4 w-52 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    favoritesCount: 0,
    watchlistCount: 0,
    reviewsCount: 0,
    averageRating: 0,
  });
  const [topGenres, setTopGenres] = useState([]); // [{ name, count }]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch stats and favorites concurrently
        const [statsRes, favRes] = await Promise.all([
          getStats().catch(() => ({
            data: { favoritesCount: 0, watchlistCount: 0, reviewsCount: 0, averageRating: 0 },
          })),
          getFavorites().catch(() => ({ data: { favorites: [] } })),
        ]);

        setStats(statsRes.data);

        const favIds = favRes.data.favorites || [];
        if (favIds.length === 0) {
          setFavorites([]);
          setTopGenres([]);
          return;
        }

        // Enrich favorites with TMDB movie details (batch, ignore failures)
        const movieDetails = await Promise.all(
          favIds.map(async (id) => {
            try {
              const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
              return res.data;
            } catch {
              return null;
            }
          })
        );

        const validMovies = movieDetails.filter(Boolean);
        setFavorites(validMovies);

        // Calculate top genres
        const genreCount = {};
        validMovies.forEach((movie) => {
          (movie.genres || []).forEach((genre) => {
            genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
          });
        });

        const sorted = Object.entries(genreCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopGenres(sorted);
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <ProfileSkeleton />;

  const maxGenreCount = topGenres[0]?.count || 1;
  const displayName = user?.username || user?.email?.split('@')[0] || 'Cinephile';
  const avatarLetter = displayName[0]?.toUpperCase() || '?';

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Profile Header ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e50914] to-red-900 flex items-center justify-center text-4xl font-bold text-white shadow-2xl flex-shrink-0">
            {avatarLetter}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            {user?.email && (
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            )}
            <p className="text-gray-600 text-xs mt-1">
              Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* ── Stats Grid ────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard icon="❤️" label="Favorites" value={stats.favoritesCount} accent />
          <StatCard icon="📖" label="Watchlist" value={stats.watchlistCount} />
          <StatCard icon="🌟" label="Average Rating" value={stats.reviewsCount > 0 ? `${stats.averageRating} / 5` : 'N/A'} />
          <StatCard icon="✍️" label="Movies Rated" value={stats.reviewsCount} />
        </div>

        {/* ── Genre Breakdown ───────────────────────── */}
        {topGenres.length > 0 && (
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span>🎬</span> Taste Profile
            </h2>
            <div className="space-y-4">
              {topGenres.map((genre) => {
                const pct = Math.round((genre.count / maxGenreCount) * 100);
                return (
                  <div key={genre.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-300">{genre.name}</span>
                      <span className="text-xs text-gray-500">
                        {genre.count} movie{genre.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e50914] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Quick Links ───────────────────────────── */}
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink icon="❤️" label="My Favorites" to="/favorites" navigate={navigate} />
            <QuickLink icon="🗂️" label="My List" to="/mylist" navigate={navigate} />
            <QuickLink icon="📖" label="Watchlist" to="/watchlist" navigate={navigate} />
            <QuickLink icon="🔍" label="Search Movies" to="/search" navigate={navigate} />
          </div>
        </div>

        {/* ── Account Actions ───────────────────────── */}
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <div className="space-y-3">
            {user?.id && (
              <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                <span className="text-gray-400 text-sm">User ID</span>
                <span className="text-gray-500 text-xs font-mono">{user.id}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-2 px-6 py-3 bg-[#1f1f1f] hover:bg-red-950/50 border border-white/[0.06] hover:border-red-900 text-white rounded-xl font-semibold text-sm transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
