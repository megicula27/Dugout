"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlayerStats({ userId, existingStats, onUpdateStats }) {
  const [isEditing, setIsEditing] = useState(!existingStats);
  const [stats, setStats] = useState(
    existingStats || {
      kills: "",
      deaths: "",
      assists: "",
      winRate: "",
      matchesPlayed: "",
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveStats = () => {
    // Validate inputs
    const validatedStats = {
      kills: parseFloat(stats.kills) || 0,
      deaths: parseFloat(stats.deaths) || 0,
      assists: parseFloat(stats.assists) || 0,
      winRate: parseFloat(stats.winRate) || 0,
      matchesPlayed: parseFloat(stats.matchesPlayed) || 0,
    };

    onUpdateStats(validatedStats);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Player Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kills</Label>
              <Input
                type="number"
                name="kills"
                value={stats.kills}
                onChange={handleInputChange}
                placeholder="Total Kills"
              />
            </div>
            <div>
              <Label>Deaths</Label>
              <Input
                type="number"
                name="deaths"
                value={stats.deaths}
                onChange={handleInputChange}
                placeholder="Total Deaths"
              />
            </div>
            <div>
              <Label>Assists</Label>
              <Input
                type="number"
                name="assists"
                value={stats.assists}
                onChange={handleInputChange}
                placeholder="Total Assists"
              />
            </div>
            <div>
              <Label>Win Rate (%)</Label>
              <Input
                type="number"
                name="winRate"
                value={stats.winRate}
                onChange={handleInputChange}
                placeholder="Win Rate"
              />
            </div>
            <div>
              <Label>Matches Played</Label>
              <Input
                type="number"
                name="matchesPlayed"
                value={stats.matchesPlayed}
                onChange={handleInputChange}
                placeholder="Total Matches"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStats}>Save Stats</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Player Stats</CardTitle>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Stats
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Kills</p>
            <p>{existingStats?.kills || "Not set"}</p>
          </div>
          <div>
            <p className="font-semibold">Deaths</p>
            <p>{existingStats?.deaths || "Not set"}</p>
          </div>
          <div>
            <p className="font-semibold">Assists</p>
            <p>{existingStats?.assists || "Not set"}</p>
          </div>
          <div>
            <p className="font-semibold">Win Rate</p>
            <p>
              {existingStats?.winRate ? `${existingStats.winRate}%` : "Not set"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Matches Played</p>
            <p>{existingStats?.matchesPlayed || "Not set"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
