"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Trophy, Users } from "lucide-react";
import "@/styles/TeamStats.css"; // Import the scoped CSS file

const TeamStats = ({ userTeam, upcomingMatches }) => {
  return (
    <section className="team-stats-container">
      <Card>
        <CardHeader>
          <CardTitle>Team Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stats-section">
            <div>
              <h3 className="section-title">Team Statistics</h3>
              <div className="stats-grid">
                <Card>
                  <CardContent className="stat-card">
                    <div className="stat-item">
                      <Users className="stat-icon stat-icon-blue" />
                      <span>Members</span>
                    </div>
                    <span className="stat-value">
                      {userTeam.players.length > 0 &&
                        userTeam.players.map((player) => player.username)}
                    </span>{" "}
                    {/* TODO yahan pe shayad userTeam.players.username hoga*/}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="stat-card">
                    <div className="stat-item">
                      <Trophy className="stat-icon stat-icon-green" />
                      <span>Wins</span>
                    </div>
                    <span className="stat-value">{userTeam.wins || 0}</span>{" "}
                    {/* TODO future mein add karunga filhaal 0*/}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="stat-card">
                    <div className="stat-item">
                      <Trophy className="stat-icon stat-icon-red" />
                      <span>Losses</span>
                    </div>
                    <span className="stat-value">{userTeam.losses || 0}</span>
                    {/* TODO future mein add karunga filhaal 0*/}
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h3 className="section-title">Upcoming Matches</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Opponent</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* future mein tournaments ke jagah matches honge filhaal tournaments*/}
                  {upcomingMatches.map((match) => (
                    <TableRow key={match.uid}>
                      <TableCell>{match.opponent || "Sentinels"}</TableCell>
                      <TableCell>{match.startDate}</TableCell>
                      <TableCell>{match.endDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TeamStats;
