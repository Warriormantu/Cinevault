import React from 'react';
import MovieCard from './MovieCard';

export default function Row({ title, movies }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <p className="text-gray-400">No movies available</p>
        )}
      </div>
    </div>
  );
}
