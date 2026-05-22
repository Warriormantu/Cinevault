import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorite,
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  rateMovie,
  getUserRating,
  getStats,
} from "../controllers/userController.js";

const router = express.Router();

// All routes require authentication
router.post("/favorites/add", authMiddleware, addFavorite);
router.get("/favorites", authMiddleware, getFavorites);
router.delete("/favorites/remove", authMiddleware, removeFavorite);
router.get("/favorites/check", authMiddleware, isFavorite);

// Watchlist
router.post("/watchlist/add", authMiddleware, addToWatchlist);
router.get("/watchlist", authMiddleware, getWatchlist);
router.delete("/watchlist/remove", authMiddleware, removeFromWatchlist);
router.get("/watchlist/check", authMiddleware, isInWatchlist);

// Ratings
router.post("/rate", authMiddleware, rateMovie);
router.get("/rating", authMiddleware, getUserRating);

// Stats
router.get("/stats", authMiddleware, getStats);

export default router;
