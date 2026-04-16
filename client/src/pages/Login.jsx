import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const startsInSignupMode =
    new URLSearchParams(location.search).get('mode') === 'signup';
  const [isLogin, setIsLogin] = useState(!startsInSignupMode);
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

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
        // Login
        if (!form.email || !form.password) {
          setError('Email and password are required');
          setLoading(false);
          return;
        }
        await login(form.email, form.password);
      } else {
        // Register
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
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-800">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">CineVault</h1>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Join CineVault'}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username (Register only) */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-600 focus:outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="pt-4 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setForm({ username: '', email: '', password: '' });
                navigate(isLogin ? '/login?mode=signup' : '/login', { replace: true });
              }}
              className="text-red-600 font-bold hover:text-red-500 ml-1 transition"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            🎬 Discover amazing movies with CineVault
          </p>
        </div>
      </div>
    </div>
  );
}
