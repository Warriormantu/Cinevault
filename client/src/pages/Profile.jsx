import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.username || 'User Profile'}
              </h1>
              <p className="text-gray-400 text-sm">User ID: {user?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-lg font-bold">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-gray-400 text-sm">Favorites</p>
              <p className="text-lg font-bold">Coming Soon</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Features Coming Soon */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">📋 Coming Soon</h2>
          <ul className="space-y-2 text-gray-400">
            <li>✓ Edit profile information</li>
            <li>✓ Change password</li>
            <li>✓ View watchlist history</li>
            <li>✓ Personalized recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
