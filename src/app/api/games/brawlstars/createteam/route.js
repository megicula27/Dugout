// pages/api/games/[gameName]/createteam.js
import dbConnect from "@/lib/database/mongo";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import User from "@/models/users/User";
import { generateTeamId } from "@/utils/idGenerator";
export const POST = async (req, res) => {
  await dbConnect();
  const { teamName, userId } = req.body;

  try {
    const existingTeam = await TeamBrawl.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already exists." });
    }
    const uid = generateTeamId();
    const newTeam = await TeamBrawl.create({
      uid,
      teamName,
      players: [userId],
    });
    const generalTeam = await Teams.create({
      uid,
      teamName,
      players: [userId],
      game: "brawl-stars",
    });
    await User.findByIdAndUpdate(userId, { $push: { teams: generalTeam._id } });

    return res.status(201).json({ message: "Team created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
