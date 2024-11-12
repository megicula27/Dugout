// pages/api/games/[gameName]/jointeam.js
import dbConnect from "@/lib/database/mongo";
import Team from "@/models/Teams/TeamBrawl";
import User from "@/models/User";

export const POST = async (req, res) => {
  await dbConnect();
  const { teamUid, userId } = req.body;

  try {
    const team = await Team.findOne({ uid: teamUid }).select("_id players");
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    if (team.players.length === 3) {
      return res.status(400).json({ error: "Team is full." });
    }

    await Team.findByIdAndUpdate(team._id, { $push: { players: userId } });
    await User.findByIdAndUpdate(userId, { $push: { teams: team._id } });

    return res.status(200).json({ message: "Joined team successfully", team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
