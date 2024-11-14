// Utility function for common population patterns
const populateTeam = {
  basic: {
    path: "players",
    select: "username",
  },
  detailed: {
    path: "players",
    select: "username avatar status",
  },
};

const populateUser = {
  teams: {
    path: "teams",
    select: "teamName players game createdAt",
    populate: populateTeam.basic,
  },
  brawlStarsTeam: {
    path: "brawlStarsTeam",
    select: "teamName players game createdAt",
    populate: populateTeam.basic,
  },
};

// Modified createTeam endpoint
export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { teamName, userId } = await req.json();
    const { gameName } = params;

    // Input validation
    if (!teamName || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Team name and user ID are required",
        },
        { status: 400 }
      );
    }

    // Check for existing team
    const existingTeam = await TeamBrawl.findOne({ teamName });
    if (existingTeam) {
      return NextResponse.json(
        {
          success: false,
          error: "Team name already exists",
        },
        { status: 400 }
      );
    }

    // Generate team ID
    const uid = generateTeamId();

    // Create game-specific team
    const newTeam = await TeamBrawl.create({
      uid,
      teamName,
      players: [userId],
    });

    // Create general team
    const generalTeam = await Teams.create({
      uid,
      teamName,
      players: [userId],
      game: gameName || "brawl-stars", // Use dynamic game name from URL or fallback
    });

    // Update user's teams
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { teams: generalTeam._id, brawlStarsTeam: newTeam._id } },
      { new: true }
    );

    if (!updatedUser) {
      // Rollback team creation if user update fails
      await TeamBrawl.findByIdAndDelete(newTeam._id);
      await Teams.findByIdAndDelete(generalTeam._id);

      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    // Populate the created team and user's updated teams and brawlStarsTeam
    await newTeam.populate(populateTeam.basic);
    await generalTeam.populate(populateTeam.basic);
    await updatedUser.populate(populateUser.teams);
    await updatedUser.populate(populateUser.brawlStarsTeam);

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully",
        team: {
          uid,
          teamName,
          game: gameName || "brawl-stars",
          players: newTeam.players,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in createTeam API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while creating the team",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
