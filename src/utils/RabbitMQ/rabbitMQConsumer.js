import { connectRabbitMQ } from "@/utils/RabbitMQ/rabbitUtil";
import sendEmail from "@/utils/Mail/nodeMailer";
import {
  showSuccessNotification,
  showTournamentWarning,
} from "@/utils/Notifications/notifications";

(async () => {
  const channel = await connectRabbitMQ();

  // Email Queue
  channel.consume("email", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("Processing email job:", data);

    if (data.type === "player_joined_team") {
      await sendEmail({
        to: "trishadragoneel@gmail.com", //TODO: add the emails of all the members
        subject: "Welcome to the Team!",
        text: `${playerName} with ID - ${playerId} has successfully joined your ${game} team having ID -${teamId} ${teamName}.`,
      });
    }

    channel.ack(msg);
  });

  // Notifications Queue
  channel.consume("notifications", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("Processing notification job:", data);

    if (data.type === "team_joined_tournament") {
      showSuccessNotification(
        `Team ${data.teamName} joined tournament ${data.tournamentName} in ${tournamentGame}.`
      );
    } else if (data.type === "tournament_start") {
      showSuccessNotification("Tournament started");
      showTournamentWarning(
        `Tournament ${data.tournamentName} in ${data.tournamentGame} is starting soon!`
      );
    }

    channel.ack(msg);
  });
})();
