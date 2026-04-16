import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-30 bg-black/95 backdrop-blur text-white px-4 sm:px-6 py-4 flex justify-between items-center border-b border-gray-800">
      <div onClick={() => navigate('/')} className="cursor-pointer">
        <h1 className="text-red-600 text-2xl font-bold hover:text-red-500 transition">
          CineVault
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="text-gray-400 hover:text-white transition text-sm font-semibold"
        >
          Search
        </button>

        {isAuthenticated ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((current) => !current)}
              className="flex items-center gap-2 bg-gray-800 px-3 sm:px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <span className="text-sm">{user?.username || 'User'}</span>
              <span className={`transition ${showMenu ? 'rotate-180' : ''}`}>v</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 z-40 bg-gray-800 rounded shadow-lg border border-gray-700 overflow-hidden min-w-48">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-sm font-mono text-gray-200">{user?.id?.slice(0, 8)}...</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/mylist');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-sm"
                >
                  My List
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-900/50 transition text-sm text-red-400 border-t border-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white transition font-semibold text-sm"
            >
              Sign In
            </button>
            <button
              type="button"
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
