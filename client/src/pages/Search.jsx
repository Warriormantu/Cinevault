import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const GENRES = [
  { id: null, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 16, name: 'Animation' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 12, name: 'Adventure' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'revenue.desc', label: 'Highest Grossing' },
];

const MIN_RATING_OPTIONS = [0, 5, 6, 7, 8];

const YEARS = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);

// ── Skeleton Grid ─────────────────────────────────────────────────
function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="skeleton rounded-xl w-full" style={{ height: '220px' }} />
          <div className="skeleton h-4 rounded-lg w-3/4" />
          <div className="skeleton h-3 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef(null);

  // Filters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [minRating, setMinRating] = useState(0);

  // Results
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce timer ref
  const debounceRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Core fetch function
  const fetchMovies = useCallback(
    async (currentPage = 1, append = false) => {
      try {
        if (currentPage === 1) setLoading(true);
        else setLoadingMore(true);

        let url = '';
        let params = {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: currentPage,
        };

        if (query.trim()) {
          // Search mode — use /search/movie
          url = `${TMDB_BASE_URL}/search/movie`;
          params.query = query.trim();
        } else {
          // Discover mode — apply filters
          url = `${TMDB_BASE_URL}/discover/movie`;
          params.sort_by = sortBy;
          if (selectedGenre) params.with_genres = selectedGenre;
          if (selectedYear) {
            params.primary_release_year = selectedYear;
          }
          if (minRating > 0) {
            params['vote_average.gte'] = minRating;
            params['vote_count.gte'] = 50; // Avoid obscure titles with 10/10 from 1 vote
          }
        }

        const res = await axios.get(url, { params });
        const results = res.data.results || [];
        setTotalResults(res.data.total_results || 0);
        setTotalPages(res.data.total_pages || 1);

        if (append) {
          setMovies((prev) => [...prev, ...results]);
        } else {
          setMovies(results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, selectedGenre, selectedYear, sortBy, minRating]
  );

  // Debounced search when query changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchMovies(1, false);
      // Keep URL in sync
      if (query.trim()) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Re-fetch when filters change (not query)
  useEffect(() => {
    setPage(1);
    fetchMovies(1, false);
  }, [selectedGenre, selectedYear, sortBy, minRating]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, true);
  };

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedYear('');
    setSortBy('popularity.desc');
    setMinRating(0);
  };

  const hasActiveFilters =
    selectedGenre !== null || selectedYear !== '' || sortBy !== 'popularity.desc' || minRating > 0;

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Page header */}
      <div className="border-b border-white/[0.06] bg-[#0a0a0a]/95 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex-shrink-0"
            >
              ← Home
            </button>

            {/* Search input */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                🔍
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies by title…"
                className="w-full bg-[#1f1f1f] border border-white/[0.06] rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#e50914] transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters — only shown when no query */}
        {!query.trim() && (
          <div className="mb-6 space-y-4">
            {/* Genre pills */}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Genre</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id ?? 'all'}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedGenre === genre.id
                        ? 'bg-[#e50914] text-white border-[#e50914]'
                        : 'bg-[#1f1f1f] text-gray-400 border-white/[0.06] hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary filters row */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Year */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-[#1f1f1f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914] transition"
                >
                  <option value="">Any Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-[0.2em] text-gray-500">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#1f1f1f] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914] transition"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Min Rating
                </label>
                <div className="flex gap-1.5">
                  {MIN_RATING_OPTIONS.map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(rating)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        minRating === rating
                          ? 'bg-[#e50914] border-[#e50914] text-white'
                          : 'bg-[#1f1f1f] border-white/[0.06] text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="self-end px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/[0.06] rounded-lg transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {query.trim() ? (
              <h2 className="text-xl font-bold">
                Results for{' '}
                <span className="text-[#e50914]">&ldquo;{query}&rdquo;</span>
              </h2>
            ) : (
              <h2 className="text-xl font-bold">Browse Movies</h2>
            )}
            {!loading && (
              <p className="text-gray-500 text-sm mt-0.5">
                {totalResults.toLocaleString()} movie{totalResults !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* Results grid */}
        {loading ? (
          <SearchSkeleton />
        ) : movies.length === 0 ? (
          <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold mb-2">No Movies Found</h3>
            <p className="text-gray-400 mb-6">
              {query.trim()
                ? `We couldn't find any movies matching "${query}". Try a different search term.`
                : 'Try adjusting your filters to find movies.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-[#e50914] rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
              {movies.map((movie) => (
                <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} className="w-full" />
              ))}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#1f1f1f] border border-white/[0.06] rounded-xl font-semibold text-sm hover:border-white/20 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading…' : `Load More (${page}/${totalPages})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
