import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreateOrJoinTeam } from "../import/import";
import PlayerStats from "./PlayerStats";

export default function TeamDetails({
  selectedGame,
  team,
  tournaments,
  leaveTeam,
  onCreateTeam,
  onJoinTeam,
}) {
  const [activeCreateJoin, setActiveCreateJoin] = useState(null);

  const renderTeamContent = () => {
    if (!team) {
      return (
        <CreateOrJoinTeam
          selectedGame={selectedGame}
          onCreateTeam={(teamName) => {
            onCreateTeam(teamName, selectedGame);
            setActiveCreateJoin(null);
          }}
          onJoinTeam={(teamUid) => {
            onJoinTeam(teamUid, selectedGame);
            setActiveCreateJoin(null);
          }}
        />
      );
    }

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {team.teamName} {team.uid}
          </CardTitle>
          <Button variant="destructive" onClick={leaveTeam} className="ml-4">
            Leave Team
          </Button>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Team Members:</h3>
          <ul className="list-disc list-inside">
            {team?.players?.map((player, index) => (
              <li key={index}>{player.username}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="team" className="w-full">
      <TabsList>
        <TabsTrigger value="team">Your Team</TabsTrigger>
        <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        <TabsTrigger value="player-stats">Player Stats</TabsTrigger>
      </TabsList>

      <TabsContent value="team">{renderTeamContent()}</TabsContent>

      <TabsContent value="tournaments">
        <Card>
          <CardHeader>
            <CardTitle>Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            {Array.isArray(tournaments) && tournaments.length > 0 ? (
              <ul className="space-y-2">
                {tournaments.map((tournament) => (
                  <li
                    key={tournament.uid}
                    className=" flex justify-between items-center"
                  >
                    <p>{tournament.name}</p>
                    <p>{tournament.uid}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tournament.startDate).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tournaments joined yet. Feeling a bit unmotivated?</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="player-stats">
        <PlayerStats
          selectedGame={selectedGame}
          userId={team?.players?.[0]?.id}
        />
      </TabsContent>
    </Tabs>
  );
}
