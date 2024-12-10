import dbconnection from "@/lib/database/mongo";
import Tournament from "@/models/Tournaments/Tournament";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import client from "@/utils/Redis/redis"; // Import Redis client
import { withMetrics } from "@/utils/Prometheus/metrics";
export const GET = withMetrics(async (req) => {
  try {
    await dbconnection();
    const token = await getToken({ req });

    const teamId = token.teams ? token?.teams[0]?.team : null;

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
    if (!token && joined === "true") {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    // Check for cached data in Redis
    const cacheKey = `tournaments:${game}:${sortBy}:${prize}:${joined}:${page}`;
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

    if (game !== "all") {
      pipeline.push({
        $match: { game },
      });
    }

    if (prize > 0) {
      pipeline.push({
        $match: { prize: { $gte: prize } },
      });
    }

    if (joined && teamId) {
      pipeline.push({
        $match: {
          teams: joined === "true" ? teamId : { $ne: teamId },
        },
      });
    }

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

    // Cache the result in Redis with an expiry of 300 seconds (5 minutes)
    await client.setEx(
      cacheKey,
      5,
      JSON.stringify({
        success: true,
        data: enrichedTournaments,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalTournaments: totalTournaments,
          limit: limit,
        },
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: enrichedTournaments,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalTournaments: totalTournaments,
          limit: limit,
        },
      },
      { status: 200 }
    );
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
