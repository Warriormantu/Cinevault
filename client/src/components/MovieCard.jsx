import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="w-40 cursor-pointer group flex-shrink-0"
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg h-56">
        {movie.poster_path ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm">🎬 No Image</span>
          </div>
        )}
        
        {/* Info on Hover */}
        <div className="absolute inset-0 flex flex-col items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-white text-sm font-bold">{movie.vote_average?.toFixed(1)}</span>
          </div>
          <button className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition">
            View Details
          </button>
        </div>
      </div>
      
      {/* Title Below */}
      <h4 className="text-white font-bold text-sm truncate mt-2 group-hover:text-red-400 transition">
        {movie.title || movie.name}
      </h4>
      <p className="text-gray-500 text-xs">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
      </p>
    </div>
  );
}
