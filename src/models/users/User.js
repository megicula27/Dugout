import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    avatar: String,

    // Game-specific teams and tournaments
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teams" }],
    tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournaments" }],

    // Centralized game stats object
    gameStats: {
      "brawl-stars": {
        type: Object,
        default: {},
      },
      valorant: {
        type: Object,
        default: {},
      },
      csgo: {
        type: Object,
        default: {},
      },
      "league-of-legends": {
        type: Object,
        default: {},
      },
      "apex-legends": {
        type: Object,
        default: {},
      },
    },

    // Game-specific team references
    brawlStarsTeam: { type: mongoose.Schema.Types.ObjectId, ref: "TeamBrawl" },
    brawlStarsTournaments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TournamentBrawl" },
    ],
    valorantTeam: { type: mongoose.Schema.Types.ObjectId, ref: "TeamValorant" },
    valorantTournaments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TournamentValorant" },
    ],

    activeStatus: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    _id: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
