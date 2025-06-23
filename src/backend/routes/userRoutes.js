// src/routes/userRoutes.js
import express from 'express';
import User from '../models/user.js'; // Assuming your User model is in this path

const router = express.Router();

// Get user data (favorites and watchlist will now contain objects)
// This route is correct for fetching user data
router.get('/:userId', async (req, res) => {
  try {
    const firebaseUid = req.params.userId; // Use req.params.userId
    const user = await User.findOne({ firebaseUid }); // Query by firebaseUid

    if (!user) {
      // If user not found, return empty arrays to avoid errors on frontend
      return res.json({
        favorites: [],
        watchlist: []
      });
    }

    res.json({
      favorites: user.favorites,
      watchlist: user.watchlist
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add item to favorites
// Path now includes :userId as a URL parameter
router.post('/:userId/favorites', async (req, res) => {
  const firebaseUid = req.params.userId;
  const { itemId, mediaType } = req.body;

  if (!itemId || !mediaType) {
    return res.status(400).json({ message: 'itemId and mediaType are required in the request body.' });
  }

  try {
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ firebaseUid, favorites: [] });
      await user.save();
    }

    const itemToAdd = { id: String(itemId), media_type: mediaType }; // Ensure itemId is String for consistency

    // Now, update the existing or newly created user
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $addToSet: { favorites: itemToAdd } },
      { new: true } // No need for upsert: true here anymore, as we've handled creation
    );

    res.status(200).json({
      message: 'Item added to favorites',
      favorites: updatedUser.favorites
    });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: err.message });
  }
});

// Remove item from favorites
// Path now includes :userId as a URL parameter
router.delete('/:userId/favorites', async (req, res) => {
  const firebaseUid = req.params.userId;
  // Extract from query parameters for DELETE requests
  const { mediaId, mediaType } = req.query; // <--- CHANGE FROM req.body to req.query

  if (!mediaId || !mediaType) { // Use mediaId consistent with frontend
    return res.status(400).json({ message: 'mediaId and mediaType are required query parameters.' });
  }

  try {
    // Construct the item object as it's stored in MongoDB
    const itemToRemove = { id: String(mediaId), media_type: mediaType };

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $pull: { favorites: itemToRemove } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Item removed from favorites',
      favorites: user.favorites
    });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add item to watchlist
// Path now includes :userId as a URL parameter
router.post('/:userId/watchlist', async (req, res) => {
  const firebaseUid = req.params.userId;
  const { itemId, mediaType } = req.body;

  if (!itemId || !mediaType) {
    return res.status(400).json({ message: 'itemId and mediaType are required in the request body.' });
  }

  try {
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({ firebaseUid, watchlist: [] });
      await user.save();
    }

    const itemToAdd = { id: String(itemId), media_type: mediaType };

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      { $addToSet: { watchlist: itemToAdd } },
      { new: true }
    );

    res.status(200).json({
      message: 'Item added to watchlist',
      watchlist: updatedUser.watchlist
    });
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    res.status(500).json({ error: err.message });
  }
});

// Remove item from watchlist
// Path now includes :userId as a URL parameter
router.delete('/:userId/watchlist', async (req, res) => {
  const firebaseUid = req.params.userId;
  // Extract from query parameters for DELETE requests
  const { mediaId, mediaType } = req.query; // <--- CHANGE FROM req.body to req.query

  if (!mediaId || !mediaType) {
    return res.status(400).json({ message: 'mediaId and mediaType are required query parameters.' });
  }

  try {
    const itemToRemove = { id: String(mediaId), media_type: mediaType };

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { $pull: { watchlist: itemToRemove } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Item removed from watchlist',
      watchlist: user.watchlist
    });
  } catch (err) {
    console.error('Error removing from watchlist:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;