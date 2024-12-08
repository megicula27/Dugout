import dbConnect from "@/lib/database/mongo"; // Your MongoDB connection function
import User from "@/models/users/User"; // User model
import { NextResponse } from "next/server"; // Next.js response helper

export async function GET(req) {
  try {
    // Ensure the database connection is made
    await dbConnect();

    // Get the user ID from the Authorization header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authorization header is missing" },
        { status: 400 }
      );
    }

    // Extract the user ID from the Authorization header
    const userId = authHeader.split(" ")[1]; // Assuming the header format is "Bearer <userId>"

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is missing from Authorization header",
        },
        { status: 400 }
      );
    }

    // Find the user with populated tournaments
    const user = await User.findById(userId).populate("tournaments");

    if (!user || !user.tournaments || user.tournaments.length === 0) {
      return NextResponse.json(
        { success: false, message: "No tournaments found for the user" },
        { status: 404 }
      );
    }

    // Get the current time
    const now = new Date();

    // Filter tournaments starting within the next 29-31 minutes
    const upcomingTournaments = user.tournaments.filter((tournament) => {
      const tournamentStart = new Date(tournament.startDate);
      const timeDiff = tournamentStart.getTime() - now.getTime();

      // Filter tournaments starting within 29-31 minutes from now
      return timeDiff >= 29 * 60 * 1000 && timeDiff <= 30 * 60 * 1000;
    });

    if (upcomingTournaments.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No upcoming tournaments within the time frame",
          upcomingTournaments: [],
        },
        { status: 200 }
      );
    }

    // Return the upcoming tournaments
    return NextResponse.json({ success: true, upcomingTournaments });
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
