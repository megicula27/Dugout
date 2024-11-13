// pages/api/games/[gameName]/jointournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import GeneralTournament from "@/models/Tournaments/Tournaments";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import GeneralTeam from "@/models/Teams/Teams";
import User from "@/models/users/User";

export const POST = async (req, res) => {
  await dbConnect();
  const { teamId, tournamentId, userId } = req.body;

  try {
    // Find the specific tournament and general tournament by UID
    const tournament = await TournamentBrawl.findOne({
      uid: tournamentId,
    }).select("teams");
    const generalTournament = await GeneralTournament.findOne({
      uid: tournamentId,
    }).select("teams");

    if (!tournament || !generalTournament) {
      return res.status(404).json({ error: "Tournament not found." });
    }

    // Find the specific team and general team by ID
    const team = await TeamBrawl.findById(teamId).select("tournaments");
    const generalTeam = await GeneralTeam.findOne({ uid: teamId }).select(
      "tournaments"
    );

    if (!team || !generalTeam) {
      return res.status(404).json({ error: "Team not found." });
    }

    // Find the user
    const user = await User.findById(userId).select("tournaments");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the specific tournament and general tournament's team list
    tournament.teams.push(teamId);
    generalTournament.teams.push(generalTeam._id);
    await tournament.save();
    await generalTournament.save();

    // Update the specific team and general team's tournament list
    team.tournaments.push(tournament._id);
    generalTeam.tournaments.push(generalTournament._id);
    await team.save();
    await generalTeam.save();

    // Update the user's tournament list with the general tournament ID
    user.tournaments.push(generalTournament._id);
    await user.save();

    return res.status(200).json({
      message: "Joined tournament successfully",
      tournament: generalTournament, // Returning general tournament data for consistency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
