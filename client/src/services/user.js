import axios from "axios";
import { API_BASE_URL } from "./config";

const API = axios.create({
  baseURL: `${API_BASE_URL}/user`,
  withCredentials: true,
});

// Attach token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Favorites ──────────────────────────────────────────────────
export const addToFavorites    = (movieId) => API.post("/favorites/add", { movieId });
export const getFavorites      = ()         => API.get("/favorites");
export const removeFavorite    = (movieId) => API.delete("/favorites/remove", { data: { movieId } });
export const checkIfFavorite   = (movieId) => API.get("/favorites/check", { params: { movieId } });

// ─── Watchlist ───────────────────────────────────────────────────
export const addToWatchlist      = (movieId) => API.post("/watchlist/add", { movieId });
export const getWatchlist        = ()         => API.get("/watchlist");
export const removeFromWatchlist = (movieId) => API.delete("/watchlist/remove", { data: { movieId } });
export const checkIfInWatchlist  = (movieId) => API.get("/watchlist/check", { params: { movieId } });

// ─── Ratings ─────────────────────────────────────────────────────
export const rateMovie     = (movieId, rating) => API.post("/rate", { movieId, rating });
export const getUserRating = (movieId)          => API.get("/rating", { params: { movieId } });

// ─── Stats ───────────────────────────────────────────────────────
export const getStats = () => API.get("/stats");

export default API;
