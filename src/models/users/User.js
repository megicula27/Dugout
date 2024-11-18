import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String }, // For credentials-based auth
    avatar: String,
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teams" }],
    tournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tournaments" }],
    brawlStarsTeam: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TeamBrawl" },
    ],
    brawlStarsTournaments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TournamentBrawl" },
    ],
    valorantTeam: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TeamValorant" },
    ],
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
