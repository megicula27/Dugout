"use client";

import { useEffect, useState } from "react";
import { TeamStats, HasTeams } from "../import/import";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  showSuccessNotification,
  showErrorNotification,
  showCustomNotification,
} from "@/utils/notifications"; // Adjust the import path as needed

export default function Teams() {
  const [userTeam, setUserTeam] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getTeam = async () => {
      try {
        const responseTeam = await axios.post("/api/users/getTeam", {
          userId: session?.user?.id,
        });

        if (responseTeam.status === 200) {
          setUserTeam(responseTeam.data.teams);

          // Success notification when teams are fetched
          if (responseTeam.data.teams.length > 0)
            showSuccessNotification("Teams fetched successfully");
          else showCustomNotification("You are not part of any team");
        }
      } catch (error) {
        // Error notification if team fetch fails
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch teams";
        showErrorNotification(errorMessage);

        // Optional custom notification for more detailed error
        // showCustomNotification(`Error: ${errorMessage}`);

        console.error(error);
      }
    };

    if (session) {
      getTeam();
    } else {
      // Custom notification if no session
      showCustomNotification("Please log in to view your teams");
    }
  }, [session]);
  const handleTeamLeave = async () => {
    try {
      if (!session) {
        showErrorNotification("User is not logged in.");
        return;
      }

      const response = await axios.post(`/api/games/${gameName}/leaveteam`, {
        userId: session.user.id,
      });

      setUserTeam(null);

      showSuccessNotification("You successfully left the team.");
    } catch (error) {
      console.error("Error while leaving the team:", error);
      showErrorNotification("Failed to leave the team. Please try again.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      {/* Section 1: Current Team or Create/Join Options */}
      {userTeam.length > 0 ? (
        userTeam.map((team) => (
          <HasTeams
            key={team.uid}
            userTeam={team}
            teamLeave={handleTeamLeave}
          />
        ))
      ) : (
        <div className="text-gray-500">
          No teams found. Create or join a team to get started.
        </div>
      )}
      {/* Section 2: Team Statistics and Upcoming Matches /}
      {/ {userTeam && (
        <TeamStats userTeam={userTeam} upcomingMatches={upcomingMatches} />
      )} */}
    </div>
  );
}
// const responseTournament = await axios.post(
//   "/api/users/getTournament",
//   {
//     userId: session?.user?.id, // Send `userId` in the request body
//   }
// );

// if (responseTournament.status === 200) {
//   setUpcomingMatches(responseTournament.data.tournament);
// }
