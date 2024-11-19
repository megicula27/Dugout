// Utility function for common population patterns
import dbConnect from "@/lib/database/mongo";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import Teams from "@/models/Teams/Teams";
import User from "@/models/users/User";
import { generateTeamId } from "@/utils/idGenerator";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const populateTeam = {
  basic: {
    path: "players",
    select: "username",
  },
  detailed: {
    path: "players",
    select: "username avatar status",
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

// Modified createTeam endpoint
export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { teamName, userId } = await req.json();
    // Input validation
    if (!teamName || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Team name and user ID are required",
        },
        { status: 400 }
      );
    }

    console.log();

    // Check for existing team
    const existingTeam = await TeamBrawl.findOne({ teamName });
    if (existingTeam) {
      return NextResponse.json(
        {
          success: false,
          error: "Team name already exists",
        },
        { status: 400 }
      );
    }

    // Generate team ID
    const uid = generateTeamId();

    // Create game-specific team

    const user = await User.findById(userId).select("teams brawlStarsTeam");

    if (!user) {
      // Rollback team creation if user update fail

      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }
    const players = [user._id];

    const newTeam = await TeamBrawl.create({
      uid,
      teamName,
      players,
    });

    // Create general team
    const generalTeam = await Teams.create({
      uid,
      teamName,
      players,
      game: "Brawl Stars",
    });

    // Update user's teams
    user.teams.push(generalTeam._id); // Use the directly fetched `ObjectId` from the database
    user.brawlStarsTeam.push(newTeam._id);

    const updatedUser = await user.save();
    // Populate the created team and user's updated teams and brawlStarsTeam

    await updatedUser.populate(populateUser.brawlStarsTeam);

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully",
        team: updatedUser.brawlStarsTeam,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in createTeam API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while creating the team",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
