import schedule from "node-schedule";
import User from "@/models/users/User";
import Tournament from "@/models/Tournaments/Tournament";
import dbConnect from "@/lib/database/mongo"; // Import your database connection
import { notifyTournamentStart } from "@/utils/RabbitMQ/rabbitMQNotifications";

// Helper function to check upcoming tournaments for a user
async function checkUserUpcomingTournaments(userId) {
  try {
    // Ensure database connection
    await dbConnect();

    // Find the user with populated tournaments
    const user = await User.findById(userId).populate({
      path: "tournaments",
      model: "Tournament", // Explicitly specify the model name
    });

    if (!user || !user.tournaments || user.tournaments.length === 0) {
      console.log("No tournaments found for the user");
      return [];
    }

    const now = new Date();

    // Filter tournaments starting within the next 30-31 minutes
    const upcomingTournaments = user.tournaments.filter((tournament) => {
      const tournamentStart = new Date(tournament.startDate);
      const timeDiff = tournamentStart.getTime() - now.getTime();

      // Check if tournament starts between 29-31 minutes from now
      return timeDiff >= 29 * 60 * 1000 && timeDiff <= 31 * 60 * 1000;
    });

    // Notify for each upcoming tournament
    for (const tournament of upcomingTournaments) {
      try {
        await notifyTournamentStart(userId, tournament.name, tournament.tag);
        console.log(`Notification sent for tournament: ${tournament.name}`);
      } catch (notificationError) {
        console.error(
          `Failed to send notification for tournament ${tournament.name}:`,
          notificationError
        );
      }
    }

    return upcomingTournaments;
  } catch (error) {
    console.error("Error checking user tournaments:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return [];
  }
}

// Main scheduler function
export function startTournamentScheduler(userId) {
  // Ensure database connection is established
  dbConnect().catch((err) => {
    console.error("Database connection error:", err);
    return null;
  });

  // Create a new scheduler job
  const tournamentScheduler = schedule.scheduleJob("* * * * *", async () => {
    try {
      console.log(`Checking tournaments for user: ${userId}`);

      await checkUserUpcomingTournaments(userId);
    } catch (error) {
      console.error("Scheduler execution error:", error);
    }
  });

  return {
    stop: () => {
      if (tournamentScheduler) {
        tournamentScheduler.cancel();
      }
    },
  };
}

// API route handler
export async function checkTournaments(userId) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    // Ensure database connection
    await dbConnect();

    const upcomingTournaments = await checkUserUpcomingTournaments(userId);
    return {
      success: true,
      message: "Tournaments checked successfully",
      upcomingTournaments,
    };
  } catch (error) {
    console.error("Tournament check error:", error);
    return { success: false, error: error.message };
  }
}
