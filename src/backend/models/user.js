const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Unique user ID
  favorites: [{ type: String }], // Array of favorite movie IDs
  watchlist: [{ type: String }] // Array of watchlist movie IDs
});

module.exports = mongoose.model('User', UserSchema);
