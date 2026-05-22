import { useRef } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

export default function Row({ title, movies = [], loading = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 420, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10">
      {/* Row title */}
      <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h2>

      {/* Outer wrapper: relative + group for arrow hover reveal */}
      <div className="relative group">
        {/* Left scroll arrow */}
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur text-white w-10 h-20 rounded-r-xl flex items-center justify-center text-xl hover:bg-black transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>

        {/* Right scroll arrow */}
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur text-white w-10 h-20 rounded-l-xl flex items-center justify-center text-xl hover:bg-black transition opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
}
