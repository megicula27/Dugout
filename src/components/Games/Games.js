import { useState, useEffect } from "react";
import GameSelection from "./GameSelection";
import TeamDetails from "./TeamDetails";
import CreateOrJoin from "./CreateOrJoinTeam";

export default function GamePage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [tournaments, setTournaments] = useState([]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    // Fetch team and tournament data for selected game
    fetchTeamAndTournaments(game.id);
  };

  const fetchTeamAndTournaments = async (gameId) => {
    // Fetch user team and tournaments based on game
    // Update userTeam and tournaments states based on response
  };

  const handleCreateTeam = async (teamName, game) => {
    // Make API call to create a team with `teamName` and `game`
    // Update userTeam state after successful creation
  };

  const handleJoinTeam = async (teamUid) => {
    // Make API call to join a team using `teamUid`
    // Update userTeam state after successful join
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
