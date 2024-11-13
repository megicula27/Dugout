// pages/api/games/getTeam.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";

export const GET = async (req, res) => {
  await dbConnect();
  const { userId } = req.query;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "teams",
        model: "Team",
        select: "players game name",
        populate: {
          path: "players",
          model: "User", // Replace 'User' with the model name you’re using for users
          select: "username", // Fields you want to display
        },
      })
      .exec();

    const userTeams = user.teams; // This now includes populated player info for each team

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ teams: userTeams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
