// pages/api/games/[gameName]/teamAndTournaments.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";

export const GET = async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  try {
    const teamsAndTournaments = await User.findById(id).select(
      "brawlTeam brawlTournament"
    );

    return res.status(200).json({ teamsAndTournaments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
