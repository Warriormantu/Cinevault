import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, className = "w-40 flex-shrink-0" }) {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : '—';

  const title = movie.title || movie.name || 'Untitled';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      className={`${className} cursor-pointer group`}
      onClick={handleClick}
    >
      {/* Card image container */}
      <div className="aspect-[2/3] relative rounded-xl overflow-hidden ring-1 ring-white/[0.06] transition-all duration-300 card-glow">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* No image fallback */
          <div className="w-full h-full bg-gradient-to-br from-[#1f1f1f] to-[#141414] flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Rating badge — always visible */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          ★ {rating}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/50 to-transparent h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View Details pill on hover */}
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#e50914] text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
          View Details
        </span>
      </div>

      {/* Title */}
      <p className="text-white text-sm font-semibold truncate mt-2 group-hover:text-red-400 transition-colors">
        {title}
      </p>

      {/* Year */}
      <p className="text-gray-500 text-xs mt-0.5">{year}</p>
    </div>
  );
}
