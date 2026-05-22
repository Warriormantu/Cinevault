import SkeletonCard from './SkeletonCard';

export default function LoadingSpinner() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen px-4 sm:px-6 pt-6 animate-fade-in">
      {/* Fake skeleton banner */}
      <div className="skeleton h-64 rounded-2xl mb-8" />

      {/* 3 skeleton rows */}
      {Array.from({ length: 3 }).map((_, rowIdx) => (
        <div key={rowIdx} className="mb-10">
          {/* Row title skeleton */}
          <div className="skeleton h-5 w-48 rounded mb-4" />

          {/* Row of 8 skeleton cards */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, cardIdx) => (
              <SkeletonCard key={cardIdx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
