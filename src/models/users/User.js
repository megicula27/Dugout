import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String }, // For credentials-based auth
  avatar: String,
  games: [String],
  teams: [String],
  activeStatus: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
