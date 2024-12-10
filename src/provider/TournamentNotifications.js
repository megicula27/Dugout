"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useInterval } from "react-use";
import { showTournamentWarning } from "../utils/Notifications/notifications";
import axios from "axios";

const TournamentNotification = () => {
  const { data: session, status } = useSession();

  const fetchTournaments = async () => {
    if (status === "authenticated" && session?.user?.id) {
      try {
        const response = await axios.get("/api/tournaments/startSoon", {
          headers: {
            Authorization: `Bearer ${session.user.id}`,
          },
        });

        if (response.data.success) {
          const tournaments = response.data.upcomingTournaments;
          tournaments.forEach((tournament) => {
            showTournamentWarning(
              `Tournament "${tournament.name}" in ${tournament.tag} starts soon!`
            );
          });
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    }
  };

  // Use `useInterval` to call the API every 60 seconds
  useInterval(fetchTournaments, 60000);

  return null;
};

export default TournamentNotification;
