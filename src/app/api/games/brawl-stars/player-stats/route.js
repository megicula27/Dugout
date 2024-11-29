import { NextResponse } from "next/server";
import User from "@/models/users/User"; // Adjust the path to your User model
import connectDB from "@/lib/database/mongo"; // Your database connection utility

export async function GET(request) {
  try {
    await connectDB();

    const tag = "brawl-stars";
    const userId = request.headers.get("user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select(`gameStats.brawl-stars`);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const gameStats = user.gameStats[tag] || {};
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

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`gameStats.brawl-stars`]: stats } },
      { new: true }
    ).select(`gameStats.brawl-stars`);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stats updated successfully",
      data: updatedUser.gameStats[tag],
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
