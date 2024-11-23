"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, LogOut } from "lucide-react";
import "@/styles/has_teams.css";
import { useRouter } from "next/navigation";

const HasTeams = ({ userTeam, teamLeave }) => {
  const router = useRouter();

  return (
    <section className="has-teams-container">
      <Card>
        <CardHeader>
          <CardTitle>{userTeam.game}</CardTitle>
        </CardHeader>
        <CardContent>
          {userTeam ? (
            <div>
              <p className="team-name">{userTeam.name}</p>
              {userTeam.game && (
                <p className="game-text">Game: {userTeam.game}</p>
              )}
              {userTeam.uid && (
                <p className="uid-text">Team UID: {userTeam.uid}</p>
              )}
              <div className="team-stats">
                <div className="stat-item">
                  <Users className="stat-icon" />
                  <ul>
                    {userTeam.players.map((player) => (
                      <li key={player.uid}>{player.username}</li>
                    ))}
                  </ul>
                </div>
                <div className="stat-item">
                  <Trophy className="stat-icon" />
                  <span>
                    {userTeam.wins}W - {userTeam.losses}L
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="destructive"
                  onClick={teamLeave}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Leave Team
                </Button>
              </div>
            </div>
          ) : (
            <div className="no-team">
              <p>You are not part of any team yet.</p>
              <p>Head to games section for creating or joining teams</p>
              <div className="action-buttons">
                <Button onClick={() => router.push("/games")}>
                  Browse Games
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default HasTeams;
