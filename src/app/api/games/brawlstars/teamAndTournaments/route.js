// pages/api/games/[gameName]/teamAndTournaments.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";

export const GET = async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  try {
    const teamsAndTournaments = await User.findById(id)
      .select("brawlStarsTeam brawlStarsTournaments")
      .populate({
        path: "brawlStarsTeam",
        model: "TeamBrawl", // This should match your model name
        select: "name players game createdAt", // Fields you want to display from TeamBrawl
        populate: {
          path: "players",
          model: "User", // Populate player details from the User model
          select: "username", // Adjust fields as needed
        },
      })
      .populate({
        path: "brawlStarsTournaments",
        model: "TournamentBrawl", // This should match your model name
        select: "name startDate endDate prize tournamentSize", // Fields you want to display from TournamentBrawl
      })
      .exec();

    if (!teamsAndTournaments) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ teamsAndTournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
