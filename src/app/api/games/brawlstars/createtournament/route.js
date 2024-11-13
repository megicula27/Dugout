// pages/api/games/[gameName]/createtournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import Tournaments from "@/models/Tournaments/Tournaments";
import User from "@/models/users/User";
import { generateTournamentId } from "@/utils/idGenerator";

export const POST = async (req, res) => {
  await dbConnect();
  const {
    userId,
    tournamentName,
    startDate,
    endDate,
    description,
    prize,
    tournamentSize,
  } = req.body;

  try {
    // Generate unique ID for the tournament
    const uid = generateTournamentId();

    // Create the tournament in the specific game schema (TournamentBrawl)
    const newTournament = await TournamentBrawl.create({
      uid,
      startDate,
      endDate,
      description,
      prize,
      tournamentSize,
      name: tournamentName,
    });

    // Save a reference in the general Tournaments schema
    const generalTournament = await Tournaments.create({
      uid: newTournament.uid,
      startDate: newTournament.startDate,
      endDate: newTournament.endDate,
      description: newTournament.description,
      prize: newTournament.prize,
      tournamentSize: newTournament.tournamentSize,
      name: newTournament.name,
      game: "brawl-stars", // Specify the game name or get it dynamically if needed
    });

    // Update the user's tournaments array with the new tournament ID
    await User.findByIdAndUpdate(userId, {
      $push: { tournaments: generalTournament._id },
    });

    return res.status(201).json({
      message: "Tournament created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
