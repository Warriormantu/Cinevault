import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrendingMovies } from '../services/api';

export default function Banner() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch top 5 trending on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingMovies();
        setMovies(data.slice(0, 5));
      } catch (err) {
        console.error('Banner fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  // Skeleton loading state
  if (loading) {
    return (
      <div className="h-[400px] sm:h-[520px] rounded-2xl overflow-hidden animate-pulse skeleton mb-8" />
    );
  }

  if (movies.length === 0) return null;

  const movie = movies[current];
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const title = movie.title || movie.name || 'Untitled';
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : '—';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const overview = movie.overview
    ? movie.overview.length > 160
      ? movie.overview.slice(0, 160) + '…'
      : movie.overview
    : '';

  return (
    <div className="h-[400px] sm:h-[520px] rounded-2xl overflow-hidden relative mb-8">
      {/* Slides */}
      {movies.map((m, idx) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {m.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w1280${m.backdrop_path}`}
              alt={m.title || m.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a]" />
          )}
        </div>
      ))}

      {/* Left gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/70 to-transparent" />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 z-30 max-w-xl px-6 pb-10">
        {/* Trending label */}
        <p className="text-xs uppercase tracking-widest text-red-500 mb-2 font-bold">
          🔥 Trending Now
        </p>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
          {title}
        </h1>

        {/* Year + rating */}
        <p className="text-gray-300 text-sm mb-4">
          {year} &nbsp;·&nbsp; ★ {rating}
        </p>

        {/* Overview */}
        {overview && (
          <p className="text-gray-300 text-sm leading-relaxed mb-5 hidden sm:block">
            {overview}
          </p>
        )}

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="bg-[#e50914] hover:bg-[#b20710] btn-glow text-white font-bold px-6 py-3 rounded-xl w-fit flex items-center gap-2 transition-colors duration-200"
        >
          ▶ View Details
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-6 z-30 flex items-center gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-[#e50914] w-6'
                : 'bg-white/40 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
