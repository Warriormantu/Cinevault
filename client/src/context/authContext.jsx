import React, { createContext, useState, useEffect } from "react";
import * as authService from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Decode token to get user info (simple approach)
      try {
        const base64Url = storedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        // Extract user ID from token
        const decoded = JSON.parse(jsonPayload);
        setUser({ id: decoded.id });
      } catch (err) {
        console.error("Error decoding token", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await authService.register({ username, email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
