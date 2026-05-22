import { useState } from 'react';
import { searchMovies } from '../services/api';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const results = await searchMovies(query);
      onSearch(results, query);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching movies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch([], '');
  };

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 via-black to-gray-950 px-4 sm:px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-500 mb-2">Discover</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Find your next movie night</h2>
            <p className="text-sm text-gray-400 mt-1">Search by title and jump straight into details.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, actors, genres..."
                className="w-full px-4 py-3 bg-[#1f1f1f] border border-white/[0.06] text-white rounded-xl focus:outline-none focus:border-[#e50914] transition placeholder-gray-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-sm"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || isSearching || !query.trim()}
              className="px-6 py-3 bg-[#e50914] hover:bg-red-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition btn-glow"
            >
              {isSearching ? '…' : 'Search'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
