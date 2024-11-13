// pages/api/users/getTeam.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId)
      .populate({
        path: "teams",
        model: "Team",
        select: "players game name uid",
        populate: {
          path: "players",
          model: "User",
          select: "username",
        },
      })
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userTeams = user.teams;

    return NextResponse.json(
      {
        success: true,
        teams: userTeams,
        count: userTeams.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getTeam API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching teams",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
