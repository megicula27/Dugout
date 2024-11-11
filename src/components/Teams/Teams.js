"use client";

import { useEffect, useState } from "react";
import { TeamStats, HasTeams } from "../import/import";
import { useSession } from "next-auth/react";
import axios from "axios"; // Import axios

export default function Teams() {
  const [userTeam, setUserTeam] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const getTeam = async () => {
      try {
        const responseTeam = await axios.get("/api/users/getTeam", {
          params: { id: session?.user?.id }, // Adjusted to session.user.id if needed
        });
        if (responseTeam.status === 200) {
          setUserTeam(responseTeam.data.team);
        }

        const responseTournament = await axios.get("/api/users/getTournament", {
          params: { id: session?.user?.id },
        });

        if (responseTournament.status === 200) {
          setUpcomingMatches(responseTournament.data.tournament);
        }
      } catch (error) {
        console.error(error.message || error);
      }
    };

    if (session) {
      getTeam();
    }
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      {/* Section 1: Current Team or Create/Join Options */}
      <HasTeams userTeam={userTeam} />

      {/* Section 2: Team Statistics and Upcoming Matches */}
      {userTeam && (
        <TeamStats userTeam={userTeam} upcomingMatches={upcomingMatches} />
      )}
    </div>
  );
}
