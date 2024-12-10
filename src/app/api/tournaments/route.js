import dbconnection from "@/lib/database/mongo";
import Tournament from "@/models/Tournaments/Tournament";
import User from "@/models/users/User"; // Assuming you have a User model
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/utils/Redis/redis";
import { withMetrics } from "@/utils/Prometheus/metrics";

export const GET = withMetrics(async (req) => {
  try {
    await dbconnection();
    const token = await getToken({ req });

    // Get query parameters
    const url = new URL(req.url);
    const game = url.searchParams.get("game") || "all";
    const sortBy = url.searchParams.get("sortBy") || "startDate";
    const prize = parseInt(url.searchParams.get("prize") || "0");
    const joined = url.searchParams.get("joined");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 15;

    // New parameter for active/inactive tournaments
    const activeFilter = url.searchParams.get("active") || true;

    // Check for cached data in Redis
    const cacheKey = `tournaments:${game}:${sortBy}:${prize}:${joined}:${page}:${
      token?.email || "anonymous"
    }`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Cache Hit Tournament");
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    console.log("Cache Miss Tournament");

    const now = new Date();

    // Update completed tournaments
    await Tournament.updateMany(
      {
        endDate: { $lt: now },
        status: "scheduled",
      },
      {
        $set: {
          status: "completed",
          active: false,
        },
      }
    );

    // Build the query pipeline
    const pipeline = [];

    // Filter for active/inactive tournaments
    const activeMatchStage = {
      $match: {
        status: { $ne: "completed" },
      },
    };

    if (activeFilter == true) {
      pipeline.push(activeMatchStage);
    }

    // Game filtering
    if (game !== "all") {
      pipeline.push({
        $match: { game },
      });
    }

    // Prize filtering
    if (prize > 0) {
      pipeline.push({
        $match: { prize: { $gte: prize } },
      });
    }

    // Team filtering logic
    if (joined && token) {
      // Find the user to get their teams
      const user = await User.findOne({ email: token.email });

      if (user) {
        if (joined === "true") {
          // Show tournaments where user's teams are participating
          pipeline.push({
            $match: {
              teams: { $elemMatch: { $in: user.teams } },
            },
          });
        } else {
          // Show tournaments where user's teams are NOT participating
          pipeline.push({
            $match: {
              teams: { $not: { $elemMatch: { $in: user.teams } } },
            },
          });
        }
      }
    }

    // Pagination and sorting
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "totalTournaments" });

    const totalCountResult = await Tournament.aggregate(countPipeline);
    const totalTournaments = totalCountResult[0]?.totalTournaments || 0;
    const totalPages = Math.ceil(totalTournaments / limit);

    pipeline.push({
      $sort: { [sortBy]: 1 },
    });

    pipeline.push({
      $skip: (page - 1) * limit,
    });

    pipeline.push({
      $limit: limit,
    });

    pipeline.push({
      $project: {
        _id: 1,
        uid: 1,
        name: 1,
        description: 1,
        prize: 1,
        tournamentSize: 1,
        teams: 1,
        startDate: 1,
        endDate: 1,
        game: 1,
        tag: 1,
        status: 1,
        active: 1,
      },
    });

    const tournaments = await Tournament.aggregate(pipeline);

    const enrichedTournaments = tournaments.map((tournament) => {
      const now = new Date();
      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);

      if (now >= startDate && now <= endDate) {
        tournament.status = "live";
      }

      return tournament;
    });

    // Prepare response data
    const responseData = {
      success: true,
      data: enrichedTournaments,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalTournaments: totalTournaments,
        limit: limit,
      },
    };

    // Cache the result in Redis with an expiry of 300 seconds (5 minutes)
    await client.setEx(cacheKey, 300, JSON.stringify(responseData));

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error in processing request:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
});
