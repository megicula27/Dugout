import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import TeamBrawl from "../../../../../models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user is in a team
    if (!user.brawlStarsTeam) {
      return NextResponse.json(
        { message: "User is not in a team" },
        { status: 400 }
      );
    }

    // Find the team
    const team = await TeamBrawl.findById(user.brawlStarsTeam);

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Find the general team
    const generalTeam = await Teams.findOne({ uid: team.uid });

    if (!generalTeam) {
      return NextResponse.json(
        { message: "General team not found" },
        { status: 404 }
      );
    }

    // Remove user from both teams' players arrays
    team.players = team.players.filter(
      (playerId) => playerId.toString() !== userId
    );
    generalTeam.players = generalTeam.players.filter(
      (playerId) => playerId.toString() !== userId
    );

    // Update user: clear brawlStarsTeam and remove team from teams array
    user.brawlStarsTeam = null;
    user.teams = user.teams.filter(
      (teamId) => teamId.toString() !== generalTeam._id.toString()
    );

    // Check if teams are now empty
    if (team.players.length === 0) {
      // Delete both teams if no players remain
      await TeamBrawl.findByIdAndDelete(team._id);
      await Teams.findByIdAndDelete(generalTeam._id);
    } else {
      // Save the updated teams
      await team.save();
      await generalTeam.save();
    }

    // Save the updated user
    await user.save();

    return NextResponse.json({
      message: "Successfully left the team",
      teamDeleted: team.players.length === 0,
      team: team.teamName,
    });
  } catch (error) {
    console.error("Leave Team Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
