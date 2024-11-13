// pages/api/games/[gameName]/jointeam.js
import dbConnect from "@/lib/database/mongo";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import User from "@/models/User";

export const POST = async (req, res) => {
  await dbConnect();
  const { teamUid, userId } = req.body;

  try {
    const team = await TeamBrawl.findOne({ uid: teamUid }).select(
      "_id players"
    );
    if (!team) {
      return res.status(404).json({ error: "Team not found." });
    }

    if (team.players.length === 3) {
      return res.status(400).json({ error: "Team is full." });
    }
    const generalTeam = await Teams.findOne({ uid: teamUid }).select(
      "_id players"
    );

    team.players.push(userId);
    await team.save();
    await Teams.findByIdAndUpdate(generalTeam._id, {
      $push: { players: userId },
    });

    await User.findByIdAndUpdate(userId, { $push: { teams: generalTeam._id } });

    return res.status(200).json({ message: "Joined team successfully", team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
