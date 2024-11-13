// pages/api/games/[gameName]/jointeam.js
import dbConnect from "@/lib/database/mongo";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { teamUid, userId } = await req.json();
    const { gameName } = params;

    // Input validation
    if (!teamUid || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Team UID and user ID are required",
        },
        { status: 400 }
      );
    }

    // Find game-specific team and general team in parallel
    const [team, generalTeam, user] = await Promise.all([
      TeamBrawl.findOne({ uid: teamUid }),
      Teams.findOne({ uid: teamUid }),
      User.findById(userId),
    ]);

    // Validations
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
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

    if (team.players.includes(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "User is already a member of this team",
        },
        { status: 400 }
      );
    }

    if (team.players.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Team is full",
          maxSize: 3,
          currentSize: team.players.length,
        },
        { status: 400 }
      );
    }

    // Update all documents
    team.players.push(userId);
    generalTeam.players.push(userId);
    user.teams.push(generalTeam._id);

    // Save all documents in parallel
    await Promise.all([team.save(), generalTeam.save(), user.save()]);

    // Populate player details if needed
    // await team.populate('players', 'username');

    return NextResponse.json(
      {
        success: true,
        message: "Joined team successfully",
        team: {
          uid: team.uid,
          teamName: team.teamName,
          game: gameName,
          players: team.players,
          currentSize: team.players.length,
          maxSize: 3,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in joinTeam API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while joining the team",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
