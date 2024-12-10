import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import { NextResponse } from "next/server";
import TeamBrawl from "@/models/Teams/TeamBrawl";
import TournamentBrawl from "@/models/Tournaments/TournamentBrawl";
import client from "@/utils/Redis/redis"; // Import Redis connection

export async function POST(request) {
  await dbConnect();
  const { id } = await request.json();

  try {
    // Try to get the cached data from Redis
    const cacheKey = `user-brawl-${id}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Cache Hit: Tournament and Team");
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    // If cache miss, proceed with database query
    const user = await User.findById(id)
      .select("brawlStarsTeam brawlStarsTournaments")
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Initialize response object
    const response = {
      success: null,
      team: null,
      tournaments: [],
    };

    // Populate `brawlStarsTeam` if it exists
    try {
      const populatedUser = await user.populate({
        path: "brawlStarsTeam",
        model: "TeamBrawl",
        select: "teamName uid players",
        populate: {
          path: "players",
          model: "User",
          select: "username",
        },
      });
      response.team = populatedUser.brawlStarsTeam;
    } catch (error) {
      console.error("Error during population:", error.message);
    }

    // Populate `brawlStarsTournaments` if they exist
    if (user.brawlStarsTournaments && user.brawlStarsTournaments.length > 0) {
      const populatedTournaments = await User.populate(user, {
        path: "brawlStarsTournaments",
        model: "TournamentBrawl",
        select: "name uid startDate endDate prize tournamentSize",
      });
      response.tournaments = populatedTournaments.brawlStarsTournaments;
    }

    response.success = true;

    // Cache the response in Redis for 1 hour (3600 seconds)
    await client.setEx(cacheKey, 5, JSON.stringify(response));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
