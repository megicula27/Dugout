// pages/api/games/[gameName]/jointeam.js
import dbConnect from "@/lib/database/mongo";
import TeamBrawl from "../../../../../models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import User from "@/models/users/User";
import { NextResponse } from "next/server";
import sendEmail from "@/utils/Mail/nodeMailer";

const populateTeam = {
  basic: {
    path: "players",
    select: "username",
  },
  detailed: {
    path: "players",
    select: "username avatar status", // Add more fields if needed
  },
};
const populateUser = {
  teams: {
    path: "teams",
    select: "teamName players game createdAt",
    populate: populateTeam.basic,
  },
  brawlStarsTeam: {
    path: "brawlStarsTeam",
    select: "teamName players game createdAt",
    populate: populateTeam.basic,
  },
};

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { teamUid, userId } = await req.json();

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
    user.brawlStarsTeam = team._id;
    // Save all documents in parallel
    await Promise.all([team.save(), generalTeam.save(), user.save()]);

    // Populate player details if needed

    await user.populate(populateUser.brawlStarsTeam); // here i need to populate teams which contains generalTeam id
    await team.populate("players", "email"); // Populate team players' email addresses

    const emails = team.players.map((player) => player.email); // Extract email addresses

    // Send email to all team members
    await sendEmail({
      to: emails, // Pass the array of emails or a comma-separated string
      subject: "New Member Joined Your Team",
      text: `${user.username} has joined your team "${team.teamName}".`,
    });
    return NextResponse.json(
      {
        success: true,
        message: `${user.name} Joined ${team.teamName} Brawl Stars team successfully`,
        team: user.brawlStarsTeam,
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
