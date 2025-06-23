import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true
    },
    // --- CRITICAL CHANGE FOR DUPLICATES: ADD { _id: false } HERE ---
    watchlist: [{
      id: { type: String, required: true }, // It's good practice to make 'id' required
      media_type: { type: String, required: true, enum: ['movie', 'tv'] }
    }, { _id: false }], // <--- Add this option
    // --- CRITICAL CHANGE FOR DUPLICATES: ADD { _id: false } HERE ---
    favorites: [{
      id: { type: String, required: true }, // It's good practice to make 'id' required
      media_type: { type: String, required: true, enum: ['movie', 'tv'] }
    }, { _id: false }] // <--- Add this option
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);