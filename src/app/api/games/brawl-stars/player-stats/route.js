import { NextResponse } from "next/server";
import User from "@/models/users/User"; // Adjust the path to your User model
import connectDB from "@/lib/database/mongo"; // Your database connection utility
import client from "@/utils/Redis/redis"; // Redis client

const TAG = "brawl-stars";

export async function GET(request) {
  try {
    await connectDB();

    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check cache first
    const cacheKey = `gameStats:${userId}:${TAG}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      // If cache exists, return it
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    // If not in cache, fetch from MongoDB
    const user = await User.findById(userId).select(`gameStats.${TAG}`);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const gameStats = user.gameStats[TAG] || {};

    // Store the result in cache for future requests
    await client.set(cacheKey, JSON.stringify(gameStats), {
      EX: 3600, // Cache expiry in seconds (1 hour)
    });

    return NextResponse.json({ success: true, data: gameStats });
  } catch (error) {
    console.error("Error fetching game stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching game stats",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { stats } = body;

    if (!stats || typeof stats !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid stats data" },
        { status: 400 }
      );
    }

    // Convert trophies to integer if present
    if (stats.trophies) {
      stats.trophies = parseInt(stats.trophies, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`gameStats.${TAG}`]: stats } },
      { new: true }
    ).select(`gameStats.${TAG}`);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Invalidate cache after updating stats
    const cacheKey = `gameStats:${userId}:${TAG}`;
    await client.del(cacheKey);

    return NextResponse.json({
      success: true,
      message: "Stats updated successfully",
      data: updatedUser.gameStats[TAG],
    });
  } catch (error) {
    console.error("Error updating game stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating game stats",
      },
      { status: 500 }
    );
  }
}
