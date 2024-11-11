import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";
import "@/styles/has_teams.css"; // Import the scoped CSS file
import { useRouter } from "next/navigation"; // Adjusted import

const HasTeams = ({ userTeam }) => {
  const router = useRouter(); // Using useRouter hook

  return (
    <section className="has-teams-container">
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
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
                  <span>{userTeam.members} members</span>
                </div>
                <div className="stat-item">
                  <Trophy className="stat-icon" />
                  <span>
                    {userTeam.wins}W - {userTeam.losses}L
                  </span>
                </div>
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
