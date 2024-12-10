// pages/api/users/getTournaments.js
import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import Tournament from "@/models/Tournaments/Tournament";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate({
      path: "tournaments",
      model: "Tournament",
      // Add any specific fields you want to select
      // select: "name date status participants"
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        tournaments: user.tournaments,
        count: user.tournaments.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getTournaments API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching tournaments",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
