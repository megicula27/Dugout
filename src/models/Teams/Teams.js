import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, unique: true },
  game: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
