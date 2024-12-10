import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: { type: String, unique: true },
  game: {
    type: String,
    required: true,
    enum: [
      "Brawl Stars",
      "Valorant",
      "Apex Legends",
      "CS-GO",
      "League of Legends",
    ],
  },
  tag: {
    type: String,
    required: true,
    enum: [
      "brawl-stars",
      "valorant",
      "apex-legends",
      "csgo",
      "league-of-legends",
    ],
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
