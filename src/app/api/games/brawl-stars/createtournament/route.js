import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import Tournaments from "@/models/Tournaments/Tournament";
import { generateTournamentId } from "@/utils/IDGen/idGenerator";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const {
      tournamentName,
      startDate,
      endDate,
      description,
      prize,
      tournamentSize,
    } = await req.json();

    // Input validation
    if (!tournamentName || !startDate || !endDate || !tournamentSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          requiredFields: [
            "tournamentName",
            "startDate",
            "endDate",
            "tournamentSize",
          ],
        },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < new Date() || end <= start) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tournament dates",
          message:
            "Start date must be in the future and end date must be after start date",
        },
        { status: 400 }
      );
    }

    // Generate tournament ID
    const uid = generateTournamentId();

    // Create tournament data object
    const tournamentData = {
      uid,
      startDate,
      endDate,
      description,
      prize,
      tournamentSize,
      name: tournamentName,
      status: "scheduled", // Add required field
      game: "brawl-stars", // Ensure this matches enum exactly
      tag: "Brawl Stars", // Ensure this matches enum exactly
    };

    // Create game-specific tournament
    const newTournament = await TournamentBrawl.create(tournamentData);

    // Create general tournament
    const generalTournament = await Tournaments.create(tournamentData);

    if (!newTournament || !generalTournament) {
      // Rollback tournament creation if user update fails
      await TournamentBrawl.findByIdAndDelete(newTournament._id);
      await Tournaments.findByIdAndDelete(generalTournament._id);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to update user with tournament",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tournament created successfully",
        tournament: {
          ...tournamentData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in createTournament API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while creating the tournament",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
