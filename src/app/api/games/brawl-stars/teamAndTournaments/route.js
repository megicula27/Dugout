import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const { id } = await request.json();
  try {
    // Find user with selected fields
    const user = await User.findById(id)
      .select("brawlStarsTeam brawlStarsTournaments")
      .exec();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Initialize response object
    const response = {
      team: null,
      tournaments: [],
    };

    // Populate `brawlStarsTeam` if it exists
    if (user.brawlStarsTeam && user.brawlStarsTeam.length > 0) {
      const populatedTeam = await User.populate(user, {
        path: "brawlStarsTeam",
        model: "TeamBrawl",
        select: "name players game createdAt",
        populate: {
          path: "players",
          model: "User",
          select: "username",
        },
      });
      response.team = populatedTeam.brawlStarsTeam;
    }

    // Populate `brawlStarsTournaments` if they exist
    if (user.brawlStarsTournaments && user.brawlStarsTournaments.length > 0) {
      const populatedTournaments = await User.populate(user, {
        path: "brawlStarsTournaments",
        model: "TournamentBrawl",
        select: "name startDate endDate prize tournamentSize",
      });
      response.tournaments = populatedTournaments.brawlStarsTournaments;
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
