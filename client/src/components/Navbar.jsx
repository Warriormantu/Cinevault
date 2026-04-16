import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
      {/* Logo */}
      <div 
        onClick={() => navigate('/')}
        className="cursor-pointer"
      >
        <h1 className="text-red-600 text-2xl font-bold hover:text-red-500 transition">
          CineVault
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Button */}
        <button className="text-gray-400 hover:text-white transition">
          🔍
        </button>

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <span>👤</span>
              <span className="text-sm">{user?.username || 'User'}</span>
              <span className={`transition ${showMenu ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg border border-gray-700 overflow-hidden min-w-48">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-sm font-mono text-gray-200">{user?.id?.slice(0, 8)}...</p>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm"
                >
                  📋 Profile
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/mylist');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm"
                >
                  🎬 My List
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-900/50 transition text-sm text-red-400 border-t border-gray-700"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white transition font-semibold text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login?mode=signup')}
              className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700 transition text-sm"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
