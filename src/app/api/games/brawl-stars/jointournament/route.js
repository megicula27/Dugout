// Utility function for common population patterns
// pages/api/games/[gameName]/jointournament.js
import dbConnect from "@/lib/database/mongo";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import GeneralTournament from "@/models/Tournaments/Tournament";
import TeamBrawl from "../../../../../models/Teams/TeamBrawl";
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

const populateUser = {
  tournaments: {
    path: "tournaments",
    select: "name startDate endDate prize tournamentSize",
    model: "GeneralTournament",
  },
  brawlStarsTournaments: {
    path: "brawlStarsTournaments",
    select: "name startDate endDate prize tournamentSize teams",
    model: "TournamentBrawl",
    populate: populateTournament.basic,
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
          error: "Team ID, Tournament ID, and User ID are required",
        },
        { status: 400 }
      );
    }

    // Fetch all required documents in parallel
    const [generalTournament, user] = await Promise.all([
      GeneralTournament.findOne({ uid: tournamentId }),

      User.findById(userId),
      // .populate(populateUser.tournaments)
      // .populate(populateUser.brawlStarsTournaments)
    ]);
    const [team, tournament] = await Promise.all([
      TeamBrawl.findById(user.brawlStarsTeam),

      TournamentBrawl.findOne({ uid: tournamentId }),
      // .populate(populateUser.tournaments)
      // .populate(populateUser.brawlStarsTournaments)
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

    // Check if team is already in tournament

    if (tournament.teams.includes(team.teamName)) {
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
    tournament.teams.push(team.teamName);
    generalTournament.teams.push(team.teamName);
    team.tournaments.push(tournament._id);
    user.tournaments.push(generalTournament._id);
    user.brawlStarsTournaments.push(tournament._id);

    // Save all updates in parallel
    await Promise.all([
      tournament.save(),
      generalTournament.save(),
      team.save(),
      user.save(),
    ]);

    // Populate tournament details for response

    // await user.populate(populateUser.tournaments);

    return NextResponse.json(
      {
        success: true,
        message: "Joined tournament successfully",
        // tournament: {
        //   uid: tournament.uid,
        //   name: tournament.name,
        //   game: gameName,
        //   teams: tournament.teams,
        //   startDate: tournament.startDate,
        //   endDate: tournament.endDate,
        //   currentTeams: tournament.teams.length,
        //   maxTeams: tournament.tournamentSize,
        // },
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
