import dbconnection from "@/lib/database/mongo";
import Tournament from "@/models/Tournaments/Tournaments";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await dbconnection();
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const teamId = token.teams ? token?.teams[0]?.team : null;

    // Get query parameters
    const url = new URL(req.url);
    // console.log("from backend", url);

    const game = url.searchParams.get("game") || "all";
    const sortBy = url.searchParams.get("sortBy") || "startDate";
    const prize = parseInt(url.searchParams.get("prize") || "0");
    const joined = url.searchParams.get("joined");

    // New parameter for active/inactive tournaments
    const activeFilter = url.searchParams.get("active") || true;

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

    // If activeFilter is explicitly set
    if (activeFilter == true) {
      pipeline.push(activeMatchStage);
    }

    // Add game filter if specified
    if (game !== "all") {
      pipeline.push({
        $match: { game },
      });
    }

    // Add prize filter
    if (prize > 0) {
      pipeline.push({
        $match: { prize: { $gte: prize } },
      });
    }

    // Add team participation filter if specified
    if (joined && teamId) {
      pipeline.push({
        $match: {
          teams: joined === "true" ? teamId : { $ne: teamId },
        },
      });
    }

    // Add sorting
    pipeline.push({
      $sort: { [sortBy]: 1 },
    });

    // Add field projections
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

    // Add additional status information based on current time
    const enrichedTournaments = tournaments.map((tournament) => {
      const now = new Date();
      const startDate = new Date(tournament.startDate);
      const endDate = new Date(tournament.endDate);

      if (now >= startDate && now <= endDate) {
        tournament.status = "live";
      }

      return tournament;
    });

    return NextResponse.json(
      {
        success: true,
        data: enrichedTournaments,
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
};
