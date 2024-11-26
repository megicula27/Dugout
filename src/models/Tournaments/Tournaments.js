import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teams: [{ type: String }],
  prize: {
    type: Number,
    required: true,
  },
  tournamentSize: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "live", "completed"],
    required: true,
    default: "scheduled",
  },
  game: {
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
  tag: {
    type: String,
    required: true,
    enum: [
      "Brawl Stars",
      "Valorant",
      "Apex Legends",
      "CSGO",
      "League of Legends",
    ],
  },
});

// Fix the model name in the export (changed from Team to Tournament)
export default mongoose.models.Tournament ||
  mongoose.model("Tournament", tournamentSchema);
