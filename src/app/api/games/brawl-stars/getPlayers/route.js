import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/users/User";
import connectDB from "@/lib/database/mongo";

export async function GET(request) {
  try {
    // Ensure database connection
    await connectDB();

    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game");
    const rank = searchParams.get("rank");
    const trophies = searchParams.get("trophies");
    const brawler = searchParams.get("brawler");
    const userId = request.headers.get("user-id");

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

    // Construct the aggregation pipeline
    const pipeline = [];

    // Match active users with the specified game, excluding the current user
    const matchStage = {
      $match: {
        activeStatus: true,
        [`gameStats.${game}`]: { $exists: true },
        // Exclude current user by converting userId to ObjectId
        ...(userId && { _id: { $ne: new mongoose.Types.ObjectId(userId) } }),
      },
    };

    // Add optional filters
    if (rank) {
      matchStage.$match[`gameStats.${game}.rank`] = rank;
    }

    pipeline.push(matchStage);

    // Add trophy filter if provided
    if (trophies) {
      pipeline.push({
        $match: {
          [`gameStats.${game}.trophies`]: { $gte: parseInt(trophies) },
        },
      });
    }

    // Add brawler filter if provided (for Brawl Stars)
    if (brawler && game === "brawl-stars") {
      pipeline.push({
        $match: {
          [`gameStats.${game}.brawler`]: brawler,
        },
      });
    }

    // Project stage to shape the output
    pipeline.push({
      $project: {
        id: "$_id",
        uid: "$uid",
        username: 1,
        gameStats: `$gameStats.${game}`,
        game: { $literal: game },
      },
    });

    // Limit results
    pipeline.push({ $limit: 50 });

    // Execute the aggregation
    const players = await User.aggregate(pipeline);

    // Transform players if needed
    const formattedPlayers = players.map((player) => ({
      id: player.uid,
      username: player.username,
      game: game,
      gameStats: player.gameStats,
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
