import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GAME_CONFIGS from "@/data/game-configs";
import { useSession } from "next-auth/react";
export default function PlayerStats({ selectedGame }) {
  // Get the configuration for the selected game
  const gameConfig = GAME_CONFIGS[selectedGame.tag];
  const gameFilters = gameConfig?.filters || {};
  const gameRanks = gameConfig?.ranks || [];

  // Initialize state
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    rank: "",
    ...Object.keys(gameFilters).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {}),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Add the user ID to headers
        const headers = {
          "user-id": session?.user.id, // Replace with actual session user ID
        };

        // Make the GET request with params in the URL and headers
        const response = await axios.get(
          `/api/games/${selectedGame.tag}/player-stats`,
          { headers }
        );

        // If stats exist, update the state
        if (response.data.success) {
          setStats(response.data.data); // Update with stats data
          setIsEditing(false);
        } else {
          // If no stats, keep the initial empty state
          setIsEditing(true);
        }
      } catch (err) {
        setError(err);
        setIsEditing(true);
        console.error("Failed to fetch stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [selectedGame.tag, session.user.id]); // Add session.user.id to dependencies

  // Handle changes to inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save stats handler
  const handleSaveStats = async () => {
    try {
      // Validate and prepare stats
      const validatedStats = {
        rank: stats.rank || "",
        ...Object.keys(gameFilters).reduce((acc, key) => {
          acc[key] = stats[key] || "";
          return acc;
        }, {}),
      };
      setIsLoading(true);

      const headers = {
        "user-id": session?.user.id, // Replace with actual session user ID
      };

      const response = await axios.post(
        `/api/games/${selectedGame.tag}/player-stats`,
        { stats: validatedStats }, // Request body
        { headers } // Pass headers
      );

      if (response.data.success) {
        setStats(response.data.data); // Update with new stats
        setIsEditing(false);
      } else {
        console.error("Failed to update stats:", response.data.message);
      }
    } catch (err) {
      setError(err);
      console.error("Error updating stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Player Stats - {selectedGame.name}</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Player Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load stats. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  // Render editing view
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Player Stats - {selectedGame.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Rank Dropdown */}
            <div>
              <Label>Rank</Label>
              <select
                name="rank"
                value={stats.rank}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Rank</option>
                {gameRanks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Filters */}
            {Object.entries(gameFilters).map(([key, filter]) => (
              <div key={key}>
                <Label>{filter.label}</Label>
                {filter.type === "select" ? (
                  <select
                    name={key}
                    value={stats[key]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select {filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type="number"
                    name={key}
                    value={stats[key]}
                    onChange={handleInputChange}
                    placeholder={filter.label}
                  />
                )}
              </div>
            ))}
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

  // Render view mode
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Player Stats - {selectedGame.name}</CardTitle>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Stats
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Rank Display */}
          <div>
            <p className="font-semibold">Rank</p>
            <p>{stats?.rank || "Not set"}</p>
          </div>

          {/* Dynamic Filters Display */}
          {Object.entries(gameFilters).map(([key, filter]) => (
            <div key={key}>
              <p className="font-semibold">{filter.label}</p>
              <p>{stats?.[key] || "Not set"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
