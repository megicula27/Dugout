// app/api/check-tournaments/route.js
import {
  checkTournaments,
  startTournamentScheduler,
} from "@/tasks/tournamentScheduler";

export async function GET(request) {
  try {
    // Get the user ID from the request headers
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Start the scheduler for this user
    startTournamentScheduler(userId);

    // Check tournaments immediately
    const result = await checkTournaments(userId);

    if (result.success) {
      return Response.json(result);
    } else {
      return Response.json(result, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
