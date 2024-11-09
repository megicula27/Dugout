import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateOrJoinTeams = ({
  setTeamName,
  setSelectedGame,
  handleCreateTeam,
  handleJoinTeam,
  teamUid,
  setTeamUid,
  action,
}) => {
  return (
    <section className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>
            {action === "create"
              ? "Create a New Team"
              : "Join an Existing Team"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {action === "create" ? (
            <div className="space-y-4">
              <Input
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Select onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="csgo">CS:GO</SelectItem>
                  <SelectItem value="lol">League of Legends</SelectItem>
                  <SelectItem value="dota2">Dota 2</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Enter team UID"
                value={teamUid}
                onChange={(e) => setTeamUid(e.target.value)}
              />
              <Button onClick={handleJoinTeam}>Join Team</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateOrJoinTeams;
