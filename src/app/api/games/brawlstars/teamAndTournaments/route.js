import dbConnect from "@/lib/database/mongo";
import User from "@/models/users/User";

export async function GET(request, { params }) {
  await dbConnect();
  const { gameName } = params;

  try {
    const teamsAndTournaments = await User.findById(gameName)
      .select("brawlStarsTeam brawlStarsTournaments")
      .populate({
        path: "brawlStarsTeam",
        model: "TeamBrawl",
        select: "name players game createdAt",
        populate: {
          path: "players",
          model: "User",
          select: "username",
        },
      })
      .populate({
        path: "brawlStarsTournaments",
        model: "TournamentBrawl",
        select: "name startDate endDate prize tournamentSize",
      })
      .exec();

    if (!teamsAndTournaments) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ teamsAndTournaments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
