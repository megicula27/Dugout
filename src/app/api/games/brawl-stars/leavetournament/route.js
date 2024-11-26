// pages/api/games/[gameName]/leavetournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import GeneralTournament from "@/models/Tournaments/Tournaments";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import GeneralTeam from "@/models/Teams/Teams";
import User from "@/models/users/User";
import { NextResponse } from "next/server";

const populateTournament = {
  basic: {
    path: "teams",
    select: "teamName players",
    populate: {
      path: "players",
      select: "username",
    },
  },
  detailed: {
    path: "teams",
    select: "teamName players createdAt status",
    populate: {
      path: "players",
      select: "username avatar status",
    },
  },
};

export async function POST(req) {
  try {
    await dbConnect();

    const { tournamentId, userId } = await req.json();

    // Input validation
    if (!tournamentId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Tournament ID and User ID are required",
        },
        { status: 400 }
      );
    }

    // Fetch all required documents in parallel
    const [tournament, generalTournament, user] = await Promise.all([
      TournamentBrawl.findOne({ uid: tournamentId }),
      GeneralTournament.findOne({ uid: tournamentId }),
      User.findById(userId),
    ]);

    // Get the user's team after we have the user
    const team = user?.brawlStarsTeam
      ? await TeamBrawl.findById(user.brawlStarsTeam)
      : null;

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

    if (!team) {
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

    // Check if team is actually in the tournament
    if (!tournament.teams.includes(team.teamName)) {
      return NextResponse.json(
        {
          success: false,
          error: "Team is not registered in this tournament",
        },
        { status: 400 }
      );
    }

    // Check if tournament has already started
    if (tournament.status === "live" || tournament.status === "completed") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot leave a tournament that has already started or ended",
        },
        { status: 400 }
      );
    }

    // Remove references
    tournament.teams = tournament.teams.filter(
      (teamName) => teamName !== team.teamName
    );
    generalTournament.teams = tournament.teams.filter(
      (teamName) => teamName !== team.teamName
    );
    team.tournaments = team.tournaments.filter(
      (t) => !t.equals(tournament._id)
    );
    user.tournaments = user.tournaments.filter(
      (t) => !t.equals(generalTournament._id)
    );
    user.brawlStarsTournaments = user.brawlStarsTournaments.filter(
      (t) => !t.equals(tournament._id)
    );

    // Save all updates in parallel
    await Promise.all([
      tournament.save(),
      generalTournament.save(),
      team.save(),
      user.save(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Left tournament successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in leaveTournament API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while leaving the tournament",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
