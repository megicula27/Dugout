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
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "TeamBrawl" }],
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
});

const TournamentBrawl =
  mongoose.models.TournamentBrawl ||
  mongoose.model("TournamentBrawl", tournamentSchema);

export default TournamentBrawl;
