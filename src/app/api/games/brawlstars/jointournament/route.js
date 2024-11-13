// pages/api/games/[gameName]/jointournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import GeneralTournament from "@/models/Tournaments/Tournaments";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import GeneralTeam from "@/models/Teams/Teams";
import User from "@/models/users/User";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { teamId, tournamentId, userId } = await req.json();
    const { gameName } = params;

    // Input validation
    if (!teamId || !tournamentId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Team ID, Tournament ID, and User ID are required",
        },
        { status: 400 }
      );
    }

    // Fetch all required documents in parallel
    const [tournament, generalTournament, team, generalTeam, user] =
      await Promise.all([
        TournamentBrawl.findOne({ uid: tournamentId }),
        GeneralTournament.findOne({ uid: tournamentId }),
        TeamBrawl.findById(teamId),
        GeneralTeam.findById(teamId),
        User.findById(userId),
      ]);

    // Validations
    if (!tournament || !generalTournament) {
      return NextResponse.json(
        {
          success: false,
          error: "Tournament not found",
        },
        { status: 404 }
      );
    }

    if (!team || !generalTeam) {
      return NextResponse.json(
        {
          success: false,
          error: "Team not found",
        },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if team is already in tournament
    if (tournament.teams.includes(teamId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Team is already registered in this tournament",
        },
        { status: 400 }
      );
    }

    // Check tournament capacity if needed
    if (
      tournament.tournamentSize &&
      tournament.teams.length >= tournament.tournamentSize
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Tournament is full",
          currentSize: tournament.teams.length,
          maxSize: tournament.tournamentSize,
        },
        { status: 400 }
      );
    }

    // Update references
    tournament.teams.push(teamId);
    team.tournaments.push(tournament._id);
    user.tournaments.push(generalTournament._id);

    // Save all updates in parallel
    await Promise.all([
      tournament.save(),
      generalTournament.save(),
      team.save(),
      generalTeam.save(),
      user.save(),
    ]);

    // Optional: Populate tournament details for response
    await tournament.populate([
      {
        path: "teams",
        select: "teamName players",
        populate: {
          path: "players",
          select: "username",
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Joined tournament successfully",
        tournament: {
          uid: tournament.uid,
          name: tournament.name,
          game: gameName,
          teams: tournament.teams,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          currentTeams: tournament.teams.length,
          maxTeams: tournament.tournamentSize,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in joinTournament API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while joining the tournament",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
