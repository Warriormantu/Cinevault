import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites] = useState([]);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white mb-4 transition"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold mb-2">❤️ My Favorites</h1>
          <p className="text-gray-400">
            {favorites.length} movie{favorites.length !== 1 ? 's' : ''} added to your favorites
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
            <p className="text-4xl mb-4">🎬</p>
            <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
            <p className="text-gray-400 mb-6">
              Start adding movies to your favorites by clicking the heart icon on movie cards!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700 transition"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Favorites will be displayed here */}
          </div>
        )}

        {/* Coming Soon Features */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h3 className="text-lg font-bold mb-4">🚀 Coming Soon</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>✓ Add/remove favorites from movie cards</li>
            <li>✓ Sort favorites by rating, date added, etc.</li>
            <li>✓ Create custom watchlists</li>
            <li>✓ Share favorites with friends</li>
            <li>✓ Get recommendations based on favorites</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
