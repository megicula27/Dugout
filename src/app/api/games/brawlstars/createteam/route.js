// pages/api/games/[gameName]/createteam.js
import dbConnect from "@/lib/database/mongo";
import Team from "@/models/Teams/TeamBrawl";
import User from "@/models/users/User";
import { generateTeamId } from "@/utils/idGenerator";
export const POST = async (req, res) => {
  await dbConnect();
  const { teamName, userId } = req.body;

  try {
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already exists." });
    }
    const uid = generateTeamId();
    const newTeam = await Team.create({ uid, teamName, players: [userId] });
    await User.findByIdAndUpdate(userId, { $push: { teams: newTeam._id } });

    return res
      .status(201)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
