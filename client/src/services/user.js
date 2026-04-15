import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/user",
  withCredentials: true,
});

// Add token to requests if it exists
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

// User/Favorites endpoints
export const addToFavorites = (movieId) =>
  API.post("/favorites/add", { movieId });

export const getFavorites = () =>
  API.get("/favorites");

export const removeFavorite = (movieId) =>
  API.delete("/favorites/remove", { data: { movieId } });

export const checkIfFavorite = (movieId) =>
  API.get("/favorites/check", { params: { movieId } });

export default API;
