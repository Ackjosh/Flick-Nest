const express = require('express');
const User = require('./models/User');
const router = express.Router();

// Generic function to update favorites or watchlist
const updateList = async (req, res, listName) => {
  const { userId, movieId } = req.body;

  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({ userId, [listName]: [movieId] });
    } else {
      const index = user[listName].indexOf(movieId);
      if (index === -1) {
        user[listName].push(movieId); // Add if not present
      } else {
        user[listName].splice(index, 1); // Remove if already present
      }
    }

    await user.save();
    res.json({ success: true, [listName]: user[listName] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Favorite
router.post('/favorites', (req, res) => updateList(req, res, 'favorites'));

// Toggle Watchlist
router.post('/watchlist', (req, res) => updateList(req, res, 'watchlist'));

// Get user favorites & watchlist
router.get('/lists/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.json({
      favorites: user ? user.favorites : [],
      watchlist: user ? user.watchlist : []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
