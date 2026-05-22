import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper to determine mode from query params
  const isSignupMode = () => new URLSearchParams(location.search).get('mode') === 'signup';

  const [isLogin, setIsLogin] = useState(!isSignupMode());
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  // Sync state when query parameters change (e.g. clicking Sign In/Sign Up in navbar)
  useEffect(() => {
    setIsLogin(!isSignupMode());
    setError('');
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!form.email || !form.password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        await login(form.email, form.password);
      } else {
        if (!form.username || !form.email || !form.password) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      }
      
      // Redirect to home on success
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.msg || 'Authentication failed';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden animate-fade-in">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 card-glow transition-all duration-500">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl font-black tracking-tight text-[#e50914] mb-2 drop-shadow-[0_2px_10px_rgba(229,9,20,0.2)]">
            CineVault
          </h1>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            {isLogin ? 'Enter details to access your taste profile' : 'Start tracking and sharing your movie reviews'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-900/20 border border-red-600/30 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (Register only) */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#1f1f1f] text-white rounded-xl border border-white/[0.06] focus:border-[#e50914] focus:outline-none transition-all duration-200"
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#1f1f1f] text-white rounded-xl border border-white/[0.06] focus:border-[#e50914] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#1f1f1f] text-white rounded-xl border border-white/[0.06] focus:border-[#e50914] focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#e50914] hover:bg-[#b20710] btn-glow text-white py-3 rounded-xl font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="pt-5 mt-6 border-t border-white/[0.06] text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "New to CineVault?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                const newMode = isLogin ? 'signup' : '';
                navigate(newMode ? `/login?mode=${newMode}` : '/login');
              }}
              className="text-[#e50914] font-bold hover:text-red-400 ml-1.5 transition-colors duration-200"
            >
              {isLogin ? 'Sign up now' : 'Sign in now'}
            </button>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-[10px] tracking-wider uppercase">
            🎬 CineVault Premium Entertainment
          </p>
        </div>
      </div>
    </div>
  );
}
