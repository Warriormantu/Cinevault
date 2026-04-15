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
