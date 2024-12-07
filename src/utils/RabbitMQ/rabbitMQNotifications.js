import { connectRabbitMQ } from "@/utils/RabbitMQ/rabbitUtil";

export async function playerJoinedTeamEmail(
  teamName,
  teamId,
  game,
  playerName,
  playerId
) {
  const channel = await connectRabbitMQ();
  const message = JSON.stringify({
    teamName,
    teamId,
    game,
    playerName,
    playerId,
    type: "player_joined_team",
  });

  await channel.assertQueue("email");
  channel.sendToQueue("email", Buffer.from(message));
}
export async function teamJoinedTournamentNotification(
  tournamentName,
  tournamentGame,
  teamName
) {
  const channel = await connectRabbitMQ();
  const message = JSON.stringify({
    tournamentName,
    tournamentGame,
    teamName,
    type: "team_joined_tournament",
  });

  await channel.assertQueue("notifications");
  channel.sendToQueue("notifications", Buffer.from(message));
}
export async function notifyTournamentStart(tournamentName, tournamentGame) {
  const channel = await connectRabbitMQ();
  const message = JSON.stringify({
    tournamentName,
    tournamentGame,
    type: "tournament_start",
  });

  try {
    await channel.assertQueue("notifications");
    channel.sendToQueue("notifications", Buffer.from(message));
    console.log(`Notification sent for tournament: ${tournamentName}`);
  } catch (error) {
    console.error(
      `Failed to send notification for tournament ${tournamentName}:`,
      error.message
    );
    throw error;
  }
}
