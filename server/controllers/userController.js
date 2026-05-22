import User from "../models/User.js";

// Add to favorites
export const addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert movieId to string for consistency
    const movieIdStr = String(movieId);

    // Check if already in favorites
    if (!user.favorites.includes(movieIdStr)) {
      user.favorites.push(movieIdStr);
      await user.save();
      return res.json({ 
        message: "Movie added to favorites",
        favorites: user.favorites 
      });
    } else {
      return res.status(400).json({ message: "Movie already in favorites" });
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Error adding favorite", error: error.message });
  }
};

// Get favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      favorites: user.favorites,
      count: user.favorites.length 
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieIdStr = String(movieId);
    const index = user.favorites.indexOf(movieIdStr);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ 
        message: "Movie removed from favorites",
        favorites: user.favorites 
      });
    } else {
      return res.status(400).json({ message: "Movie not in favorites" });
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Error removing favorite", error: error.message });
  }
};

// Check if movie is in favorites
export const isFavorite = async (req, res) => {
  try {
    const { movieId } = req.query;
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const user = await User.findById(req.user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const movieIdStr = String(movieId);
    const isFav = user.favorites.includes(movieIdStr);

    res.json({ isFavorite: isFav });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({ message: "Error checking favorite", error: error.message });
  }
};

// ─── Watchlist ────────────────────────────────────────────────────────────────

// Add a movie to the user's watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const movieIdStr = String(movieId);
    if (!user.watchlist.includes(movieIdStr)) {
      user.watchlist.push(movieIdStr);
      await user.save();
      return res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
    }
    return res.status(400).json({ message: 'Already in watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to watchlist', error: error.message });
  }
};

// Get the user's full watchlist
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ watchlist: user.watchlist, count: user.watchlist.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching watchlist', error: error.message });
  }
};

// Remove a movie from the user's watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const movieIdStr = String(movieId);
    const index = user.watchlist.indexOf(movieIdStr);
    if (index > -1) {
      user.watchlist.splice(index, 1);
      await user.save();
      return res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
    }
    return res.status(400).json({ message: 'Movie not in watchlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from watchlist', error: error.message });
  }
};

// Check whether a specific movie is in the user's watchlist
export const isInWatchlist = async (req, res) => {
  try {
    const { movieId } = req.query;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ inWatchlist: user.watchlist.includes(String(movieId)) });
  } catch (error) {
    res.status(500).json({ message: 'Error checking watchlist', error: error.message });
  }
};

// ─── Ratings ──────────────────────────────────────────────────────────────────

// Create or update a 1-5 star rating for a movie
export const rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    if (!movieId || !rating) return res.status(400).json({ message: 'movieId and rating required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const movieIdStr = String(movieId);
    const existingIndex = user.reviews.findIndex(r => r.movieId === movieIdStr);
    if (existingIndex > -1) {
      // Update existing review
      user.reviews[existingIndex].rating = rating;
      user.reviews[existingIndex].createdAt = new Date();
    } else {
      user.reviews.push({ movieId: movieIdStr, rating, createdAt: new Date() });
    }
    await user.save();
    res.json({ message: 'Rating saved', reviews: user.reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error saving rating', error: error.message });
  }
};

// Get the current user's rating for a specific movie
export const getUserRating = async (req, res) => {
  try {
    const { movieId } = req.query;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const review = user.reviews.find(r => r.movieId === String(movieId));
    res.json({ rating: review ? review.rating : null });
  } catch (error) {
    res.status(500).json({ message: 'Error getting rating', error: error.message });
  }
};

// ─── Stats ────────────────────────────────────────────────────────────────────

// Return aggregate counts for the user's favorites, watchlist, and reviews
export const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const reviewsCount = user.reviews.length;
    const averageRating = reviewsCount > 0
      ? user.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
      : 0;

    res.json({
      favoritesCount: user.favorites.length,
      watchlistCount: user.watchlist.length,
      reviewsCount,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
