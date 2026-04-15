import axios from 'axios';

// Backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth endpoints
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const register = (email, password) => 
  api.post('/auth/register', { email, password });

export const logout = () => 
  api.post('/auth/logout');

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
});

// TMDB Movie endpoints
export const getTrendingMovies = () =>
  tmdbApi.get(`/trending/movie/week?api_key=${TMDB_API_KEY}`).then(res => res.data.results);

export const getPopularMovies = () =>
  tmdbApi.get(`/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(res => res.data.results);

export const getUpcomingMovies = () =>
  tmdbApi.get(`/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`).then(res => res.data.results);

export const getMovieDetails = (id) =>
  tmdbApi.get(`/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.data);

export const searchMovies = (query) =>
  tmdbApi.get(`/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=en-US&page=1`).then(res => res.data.results);

// Movie endpoints
export const getMovies = () => 
  api.get('/movies');

export default api;
