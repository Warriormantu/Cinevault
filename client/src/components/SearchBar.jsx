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
    <div className="sticky top-0 z-20 bg-gradient-to-b from-black via-black to-transparent px-6 py-4">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search movies, actors, genres..."
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition placeholder-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition"
        >
          {isSearching ? '⏳' : '🔍'}
        </button>
      </form>
    </div>
  );
}
