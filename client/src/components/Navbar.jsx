import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Search', icon: '🔍', path: '/search' },
  { label: 'My List', icon: '📋', path: '/watchlist', authRequired: true },
  { label: 'Favorites', icon: '❤️', path: '/watchlist', authRequired: false, guestOnly: true },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  // Build mobile nav items based on auth state
  const mobileNavItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Search', icon: '🔍', path: '/search' },
    isAuthenticated
      ? { label: 'My List', icon: '📋', path: '/mylist' }
      : { label: 'Favorites', icon: '❤️', path: '/favorites' },
    { label: 'Profile', icon: '👤', path: isAuthenticated ? '/profile' : '/login' },
  ];

  return (
    <>
      {/* ── Top Navbar ── */}
      <nav className="sticky top-0 z-30 glass border-b border-white/[0.06] text-white px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-[#e50914] text-2xl font-black tracking-tight hover:text-red-400 transition-colors"
        >
          CineVault
        </button>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search button */}
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="text-gray-300 hover:text-white transition-colors text-lg w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10"
            aria-label="Search"
          >
            🔍
          </button>

          {isAuthenticated ? (
            <>
              {/* My List link */}
              <button
                type="button"
                onClick={() => navigate('/mylist')}
                className="hidden md:flex text-gray-300 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                My List
              </button>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
                >
                  <span className="w-7 h-7 rounded-full bg-[#e50914] flex items-center justify-center text-white text-xs font-black uppercase select-none">
                    {user?.username?.[0] || user?.email?.[0] || 'U'}
                  </span>
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {user?.username || user?.email || 'User'}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass border border-white/[0.06] rounded-xl shadow-xl py-1 animate-slide-down">
                    <div className="px-4 py-2 border-b border-white/[0.06]">
                      <p className="text-white text-sm font-semibold truncate">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-gray-500 text-xs truncate">{user?.email || ''}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/profile')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      👤 Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/favorites')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      ❤️ Favorites
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/mylist')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      🗂️ My List
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/watchlist')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      📖 Watchlist
                    </button>

                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                      >
                        ↩ Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigate('/login?mode=signup')}
                className="bg-[#e50914] hover:bg-[#b20710] btn-glow text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/[0.06] flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-[#e50914]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#e50914]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
