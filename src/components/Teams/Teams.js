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
        const responseTeam = await axios.post("/api/users/getTeam", {
          userId: session?.user?.id, // Send `userId` in the request body
        });

        if (responseTeam.status === 200) {
          console.log(responseTeam.data);

          setUserTeam(responseTeam.data);
        }

        const responseTournament = await axios.get("/api/users/getTournament", {
          params: { userId: session?.user?.id },
        });

        if (responseTournament.status === 200) {
          setUpcomingMatches(responseTournament.data.tournament);
        }
        console.log(
          responseTeam.data.team + " " + responseTournament.data.tournament
        );
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
      {userTeam.length > 0 &&
        userTeam[0].map((team) => <HasTeams key={team.uid} userTeam={team} />)}

      {/* Section 2: Team Statistics and Upcoming Matches */}
      {userTeam && (
        <TeamStats userTeam={userTeam} upcomingMatches={upcomingMatches} />
      )}
    </div>
  );
}
