// src/services/userService.js
import axios from 'axios';

// Get the API base URL from environment variables or use a default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class UserService {
  /**
   * Add an item to a user's favorites list
   * @param {string} userId - The user's ID (from Firebase Auth)
   * @param {string} itemId - The item's ID to add to favorites
   * @returns {Promise} - Promise resolving to the updated favorites list
   */
  static async addToFavorites(userId, itemId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        userId,
        itemId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove an item from a user's favorites list
   * @param {string} userId - The user's ID (from Firebase Auth)
   * @param {string} itemId - The item's ID to remove from favorites
   * @returns {Promise} - Promise resolving to the updated favorites list
   */
  static async removeFromFavorites(userId, itemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/favorites`, {
        data: { userId, itemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Check if an item is in a user's favorites
   * @param {string} userId - The user's ID
   * @param {string} itemId - The item's ID to check
   * @returns {Promise<boolean>} - Promise resolving to true if item is in favorites
   */
  static async isInFavorites(userId, itemId) {
    try {
      const userData = await this.getUserData(userId);
      return userData.favorites && userData.favorites.includes(itemId);
    } catch (error) {
      console.error('Error checking favorites:', error);
      return false;
    }
  }

  /**
   * Add an item to a user's watchlist
   * @param {string} userId - The user's ID
   * @param {string} itemId - The item's ID to add to watchlist
   * @returns {Promise} - Promise resolving to the updated watchlist
   */
  static async addToWatchlist(userId, itemId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/watchlist`, {
        userId,
        itemId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  /**
   * Remove an item from a user's watchlist
   * @param {string} userId - The user's ID
   * @param {string} itemId - The item's ID to remove from watchlist
   * @returns {Promise} - Promise resolving to the updated watchlist
   */
  static async removeFromWatchlist(userId, itemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/watchlist`, {
        data: { userId, itemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  }

  /**
   * Get a user's data including favorites and watchlist
   * @param {string} userId - The user's ID
   * @returns {Promise} - Promise resolving to the user data
   */
  static async getUserData(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
}