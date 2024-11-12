// pages/api/games/[gameName]/createtournament.js
import dbConnect from "@/lib/database/mongo";
import Tournament from "@/models/Tournaments/TournamentBrawl";
import { generateTournamentId } from "@/utils/idGenerator";

export const POST = async (req, res) => {
  await dbConnect();
  const {
    tournamentName,
    startDate,
    endDate,
    description,
    prize,
    tournamentSize,
  } = req.body;

  try {
    const uid = generateTournamentId();
    const newTournament = await Tournament.create({
      uid,
      startDate,
      endDate,
      description,
      prize,
      tournamentSize,
      name: tournamentName,
    });
    return res.status(201).json({
      message: "Tournament created successfully",
      tournament: newTournament,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
