// pages/api/games/getTeam.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const user = await User.findById(userId).populate("teams");
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.status(200).json({ teams: user.teams });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
