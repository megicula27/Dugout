import { NextResponse } from "next/server";
import User from "@/models/users/User"; // Adjust the import path as needed
import connectDB from "@/lib/database/mongo"; // Assume you have a database connection utility

export async function GET(request) {
  try {
    // Ensure database connection
    await connectDB();

    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game");
    const rank = searchParams.get("rank");

    // Validate game parameter
    const validGames = [
      "brawl-stars",
      "valorant",
      "csgo",
      "league-of-legends",
      "apex-legends",
    ];

    if (!game || !validGames.includes(game)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing game parameter",
        },
        { status: 400 }
      );
    }

    // Base query to find active users with game stats
    const baseQuery = {
      activeStatus: true,
      [`gameStats.${game}.rank`]: rank,
    };

    // Additional filter parsing
    const additionalFilters = {};
    const filterKeys = ["trophies", "agent", "weapon", "champion", "legend"];

    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        additionalFilters[`gameStats.${game}.${key}`] = value;
      }
    });

    // Merge additional filters with base query
    const finalQuery = {
      ...baseQuery,
      ...additionalFilters,
    };

    // Fetch players
    const players = await User.find(finalQuery)
      .select("username gameStats")
      .limit(50); // Limit to 50 results

    // Transform players to match frontend expectations
    const formattedPlayers = players.map((player) => ({
      id: player._id,
      username: player.username,
      game: game,
      rank: rank,
      // You can add more details from gameStats if needed
    }));

    return NextResponse.json({
      success: true,
      data: formattedPlayers,
    });
  } catch (error) {
    console.error("Player search error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while searching players",
      },
      { status: 500 }
    );
  }
}
