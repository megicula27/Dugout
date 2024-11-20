"use client";
import { useState } from "react";
import GameSelection from "./GameSelection";
import TeamDetails from "./TeamDetails";
import CreateOrJoin from "./CreateOrJoinTeam";
import {
  showCustomNotification,
  showSuccessNotification,
  showErrorNotification,
} from "@/utils/notifications"; // Import notifications
import { useSession } from "next-auth/react";
import axios from "axios";

export default function GamePage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const { data: session } = useSession();

  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    fetchTeamAndTournaments(gameName);
  };

  const fetchTeamAndTournaments = async (gameName) => {
    try {
      if (!session) {
        showErrorNotification("User is not logged in.");
        return;
      }

      const response = await axios.post(
        `/api/games/${gameName}/teamAndTournaments`,
        { id: session.user.id }
      );

      const { team, tournaments } = response.data;

      setUserTeam(team);
      setTournaments(tournaments);

      if (!team && tournaments.length === 0) {
        showCustomNotification(
          `You are not part of a team or tournament for ${gameName}.`
        );
      }
      if (tournaments.length === 0) {
        showCustomNotification(
          `You are not part of any tournament for ${gameName}.`
        );
      }
    } catch (error) {
      console.error("Error fetching team and tournaments:", error);
      showErrorNotification("Failed to fetch team and tournament data.");
    }
  };

  const handleCreateTeam = async (teamName, game) => {
    try {
      if (!session) {
        showErrorNotification("User is not logged in.");
        return;
      }

      const response = await axios.post(`/api/games/${game}/createteam`, {
        teamName,
        userId: session.user.id,
      });

      const { team } = response.data;
      setUserTeam(team);

      showSuccessNotification(`Successfully created team "${teamName}".`);
    } catch (error) {
      console.error("Error creating the team:", error);
      showErrorNotification("Failed to create the team. Please try again.");
    }
  };

  const handleJoinTeam = async (teamUid, gameName) => {
    try {
      if (!session) {
        showErrorNotification("User is not logged in.");
        return;
      }

      const response = await axios.post(`/api/games/${gameName}/jointeam`, {
        teamUid,
        userId: session.user.id,
      });

      const { team } = response.data;
      setUserTeam(team);

      showSuccessNotification("Successfully joined the team.");
    } catch (error) {
      console.error("Error joining the team:", error);
      showErrorNotification("Failed to join the team. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {selectedGame ? selectedGame.name : "Featured Games"}
      </h1>
      {!selectedGame ? (
        <GameSelection onGameSelect={handleGameSelect} />
      ) : userTeam ? (
        <TeamDetails team={userTeam} tournaments={tournaments} />
      ) : (
        <CreateOrJoin
          selectedGame={selectedGame}
          onCreateTeam={handleCreateTeam}
          onJoinTeam={handleJoinTeam}
        />
      )}
    </div>
  );
}
