import mongoose from "mongoose";

const TeamBrawlSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  teamname: { type: String, unique: true, required: true },
  tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournament" }],
  size: { type: Number, required: true, default: 3, validate: (v) => v === 3 }, // Enforces size to be 3
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TeamBrawl ||
  mongoose.model("TeamBrawl", TeamBrawlSchema);
