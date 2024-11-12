// pages/api/games/[gameName]/jointournament.js
import dbConnect from "@/lib/database/mongo";
import Tournament from "@/models/Tournaments/TournamentBrawl";
import Team from "@/models/Teams/TeamBrawl";
import User from "@/models/users/User";

export const POST = async (req, res) => {
  await dbConnect();
  const { teamId, tournamentId, userId } = req.body;

  try {
    const tournament = await Tournament.findOne({ uid: tournamentId }).select(
      "_id"
    );
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found." });
    }

    await Tournament.findByIdAndUpdate(tournament._id, {
      $push: { teams: teamId },
    });
    await Team.findByIdAndUpdate(teamId, {
      $push: { tournaments: tournament._id },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { tournaments: tournament._id },
    });
    return res
      .status(200)
      .json({ message: "Joined tournament successfully", tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
