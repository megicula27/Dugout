// pages/api/games/[gameName]/teamAndTournaments.js
import dbConnect from "@/lib/database/mongo";
import Team from "@/models/Team";
import Tournament from "@/models/Tournament";

export default async function handler(req, res) {
  await dbConnect();
  const { gameName } = req.query;

  if (req.method === "GET") {
    try {
      const teams = await Team.find({ game: gameName });
      const tournaments = await Tournament.find({ game: gameName });

      return res.status(200).json({ teams, tournaments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
