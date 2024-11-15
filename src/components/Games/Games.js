"use client";
import { useState } from "react";
import GameSelection from "./GameSelection";
import TeamDetails from "./TeamDetails";
import CreateOrJoin from "./CreateOrJoinTeam";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function GamePage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const { data: session } = useSession();
  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    // Fetch team and tournament data for selected game
    fetchTeamAndTournaments(gameName);
  };

  const fetchTeamAndTournaments = async (gameName) => {
    // Fetch user team and tournaments based on game
    // Update userTeam and tournaments states based on response
    try {
      // Check if the user is logged in
      if (!session) {
        console.error("User is not logged in.");
        return;
      }

      // Send a POST request to fetch team and tournament data
      const response = await axios.post(
        `/api/games/${gameName}/teamAndTournaments`,
        {
          id: session.user.id, // Replace with the actual user ID
        }
      );

      // Extract data from the response
      const { team, tournaments } = response.data;

      // Update state with fetched data
      setUserTeam(team); // Assuming team data exists in response
      setTournaments(tournaments); // Assuming tournaments data exists in response
    } catch (error) {
      // Log error details
      console.error("Error fetching team and tournaments:", error);

      // Optional: Show an error message to the user
      // TODO add notification for not having a team
    }
  };

  const handleCreateTeam = async (teamName, game) => {
    // Make API call to create a team with `teamName` and `game`
    // Update userTeam state after successful creation
    try {
      // Check if the user is logged in
      if (!session) {
        console.error("User is not logged in.");
        return;
      }

      // Make API call to join the team
      const response = await axios.post(`/api/games/${game}/createteam`, {
        teamName,
        userId: session.user.id,
      });

      // Extract updated team data from the response
      const { team } = response.data;

      // Update the userTeam state
      setUserTeam(team);

      // Notify the user of success (optional)
      console.log("Successfully joined the team:", team);
      // alert("Successfully joined the team!"); T
      //TODO add notification
    } catch (error) {
      // Handle errors
      console.error("Error joining the team:", error);

      // Show an error message to the user
      if (error.response) {
        // Errors returned by the server
        //alert(error.response.data.message || "Failed to join the team. Please try again.");
        console.error(
          error.response.data.message ||
            "Failed to join the team. Please try again."
        );
      } else if (error.request) {
        // No response received
        console.error(
          "No response from the server. Please check your connection."
        );
      } else {
        // Other errors
        console.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleJoinTeam = async (teamUid, gameName, session, setUserTeam) => {
    try {
      // Check if the user is logged in
      if (!session) {
        console.error("User is not logged in.");
        return;
      }

      // Make API call to join the team
      const response = await axios.post(`/api/games/${gameName}/jointeam`, {
        teamUid,
        userId: session.user.id,
      });

      // Extract updated team data from the response
      const { team } = response.data;

      // Update the userTeam state
      setUserTeam(team);

      // Notify the user of success (optional)
      console.log("Successfully joined the team:", team);
      // alert("Successfully joined the team!"); T
      //TODO add notification
    } catch (error) {
      // Handle errors
      console.error("Error joining the team:", error);

      // Show an error message to the user
      if (error.response) {
        // Errors returned by the server
        //alert(error.response.data.message || "Failed to join the team. Please try again.");
        console.error(
          error.response.data.message ||
            "Failed to join the team. Please try again."
        );
      } else if (error.request) {
        // No response received
        console.error(
          "No response from the server. Please check your connection."
        );
      } else {
        // Other errors
        console.error("An unexpected error occurred. Please try again.");
      }
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
