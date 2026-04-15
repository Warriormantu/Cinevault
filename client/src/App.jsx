import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import MyList from './pages/MyList';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-black min-h-screen">
      {/* Show Navbar always (with login button when not authenticated) */}
      <Navbar />
      
      <Routes>
        {/* Home Route (PUBLIC - everyone can see) */}
        <Route path="/" element={<Home />} />

        {/* Login Route (public) */}
        <Route path="/login" element={<Login />} />

        {/* Movie Details Route (PUBLIC - everyone can browse) */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* Profile Route (PROTECTED - only logged in users) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Favorites Route (PROTECTED - only logged in users) */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* My List Route (PROTECTED - only logged in users) */}
        <Route
          path="/mylist"
          element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
