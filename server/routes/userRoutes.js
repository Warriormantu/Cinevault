import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorite,
} from "../controllers/userController.js";

const router = express.Router();

// All routes require authentication
router.post("/favorites/add", authMiddleware, addFavorite);
router.get("/favorites", authMiddleware, getFavorites);
router.delete("/favorites/remove", authMiddleware, removeFavorite);
router.get("/favorites/check", authMiddleware, isFavorite);

export default router;
