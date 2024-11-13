// pages/api/games/[gameName]/createtournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import Tournaments from "@/models/Tournaments/Tournaments";
import User from "@/models/users/User";
import { generateTournamentId } from "@/utils/idGenerator";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const {
      userId,
      tournamentName,
      startDate,
      endDate,
      description,
      prize,
      tournamentSize,
    } = await req.json();

    const { gameName } = params;

    // Input validation
    if (
      !userId ||
      !tournamentName ||
      !startDate ||
      !endDate ||
      !tournamentSize
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          requiredFields: [
            "userId",
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

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
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
    };

    // Create game-specific tournament
    const newTournament = await TournamentBrawl.create(tournamentData);

    // Create general tournament
    const generalTournament = await Tournaments.create({
      ...tournamentData,
      game: gameName,
    });

    // Update user's tournaments
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { tournaments: generalTournament._id } },
      { new: true }
    );

    if (!updatedUser) {
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
          uid,
          name: tournamentName,
          game: gameName || "brawl-stars",
          startDate,
          endDate,
          description,
          prize,
          tournamentSize,
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
