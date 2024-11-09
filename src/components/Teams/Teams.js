"use client";

import { useState } from "react";
import { TeamStats, HasTeams, CreateOrJoinTeams } from "../import/import";
import Glitch from "../Glitch/Glitch";
export default function Teams() {
  const [userTeam, setUserTeam] = useState(null);
  const [action, setAction] = useState(null); // Fixed this line
  const [teamName, setTeamName] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [teamUid, setTeamUid] = useState("");

  const handleCreateTeam = () => {
    // Logic to create team
    console.log("Creating team:", teamName, "for game:", selectedGame);
    setUserTeam({
      name: teamName,
      game: selectedGame,
      members: 1,
      wins: 0,
      losses: 0,
    });
    setAction(null);
  };

  const handleJoinTeam = () => {
    // Logic to join team
    console.log("Joining team with UID:", teamUid);
    setUserTeam({
      name: "Joined Team",
      uid: teamUid,
      members: 5,
      wins: 10,
      losses: 3,
    });
    setAction(null);
  };

  const upcomingMatches = [
    { id: 1, opponent: "Team Alpha", date: "2024-11-15", time: "18:00" },
    { id: 2, opponent: "Gamma Squad", date: "2024-11-18", time: "20:00" },
    { id: 3, opponent: "Delta Force", date: "2024-11-22", time: "19:30" },
  ];

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Team Management</h1>

      {/* Section 1: Current Team or Create/Join Options */}
      <HasTeams userTeam={userTeam} setAction={setAction} />
      <Glitch text="hello" link={"/games"} />
      {/* Create or Join Team Form */}
      {action && (
        <CreateOrJoinTeams
          setTeamName={setTeamName}
          setSelectedGame={setSelectedGame}
          handleCreateTeam={handleCreateTeam}
          handleJoinTeam={handleJoinTeam}
          teamUid={teamUid}
          setTeamUid={setTeamUid}
          action={action}
        />
      )}

      {/* Section 2: Team Statistics and Upcoming Matches */}
      {userTeam && (
        <TeamStats userTeam={userTeam} upcomingMatches={upcomingMatches} />
      )}
    </div>
  );
}
