// pages/api/games/getTeam.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";

export const GET = async (req, res) => {
  await dbConnect();
  const { userId } = req.query;

  try {
    const user = await User.findById(userId).populate("teams");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ teams: user.teams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
