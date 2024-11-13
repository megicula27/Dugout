import mongoose from "mongoose";

const tournamentSchema = new Schema({
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
    enum: ["scheduled", "completed"],
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
      "league of legends",
    ],
  },
});

export default mongoose.models.Team ||
  mongoose.model("Tournament", tournamentSchema);
