"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@/utils/notifications";
import GAME_CONFIGS from "@/data/game-configs";
// Game configurations with specific filter options

const PlayerSearchPage = () => {
  const { data: session } = useSession();
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [filters, setFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setIsUserLoggedIn(true);
    }
  }, [session]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setSelectedRank("");
    setFilters({});
  };

  const handleSearch = async () => {
    if (!isUserLoggedIn) {
      setIsRegistrationDialogOpen(true);
      return;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.set("game", selectedGame);
      queryParams.set("rank", selectedRank);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.set(key, value);
        }
      });

      const endpoint = `/api/games/${selectedGame}/getPlayers`;

      const { data } = await axios.get(`${endpoint}?${queryParams.toString()}`);

      if (data.success) {
        if (data.data.length > 0) {
          showSuccessNotification("Players fetched successfully!");
          setSearchResults(data.data);
        } else {
          showErrorNotification("No Players Found :(");
          setSearchResults([]);
        }
      } else {
        showErrorNotification(data.message || "Failed to fetch players");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      showErrorNotification("An error occurred while searching players");
      setSearchResults([]);
    }
  };

  const handleInvite = (playerId) => {
    console.log(`Inviting player with ID: ${playerId}`);
  };

  return (
    <div className="w-200 mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Player Search</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Game and Rank Selection */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Label className="text-foreground">Select Game</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-background text-foreground mt-2"
                  >
                    {selectedGame
                      ? selectedGame
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                      : "Choose a Game"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-background">
                  {Object.keys(GAME_CONFIGS).map((game) => (
                    <Button
                      key={game}
                      variant="ghost"
                      className={cn(
                        "relative w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground pl-8",
                        selectedGame === game && "bg-accent"
                      )}
                      onClick={() => {
                        handleGameSelect(game);
                        document.body.click(); // This will close the Popover
                      }}
                    >
                      <Check
                        className={cn(
                          "absolute left-2 w-4 h-4",
                          selectedGame === game ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {game
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {selectedGame && (
              <div className="flex-1">
                <Label className="text-foreground">Select Rank</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-background text-foreground mt-2"
                    >
                      {selectedRank || "Choose Rank"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 bg-background">
                    {GAME_CONFIGS[selectedGame].ranks.map((rank) => (
                      <Button
                        key={rank}
                        variant="ghost"
                        className={cn(
                          "relative w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground pl-8",
                          selectedRank === rank && "bg-accent"
                        )}
                        onClick={() => {
                          setSelectedRank(rank);
                          document.body.click(); // This will close the Popover
                        }}
                      >
                        <Check
                          className={cn(
                            "absolute left-2 w-4 h-4",
                            selectedRank === rank ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {rank}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Filters */}
          {selectedGame && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Filters</h3>
              {Object.entries(GAME_CONFIGS[selectedGame].filters).map(
                ([filterId, filter]) => (
                  <div key={filterId} className="mb-2">
                    <label className="block mb-1">{filter.label}</label>
                    {filter.type === "number" ? (
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        placeholder={`Enter ${filter.label.toLowerCase()}`}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [filterId]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between bg-background text-foreground"
                          >
                            {filters[filterId] || `Choose ${filter.label}`}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-background">
                          {filter.options.map((option) => (
                            <Button
                              key={option}
                              variant="ghost"
                              className={cn(
                                "relative w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground pl-8",
                                filters[filterId] === option && "bg-accent"
                              )}
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  [filterId]: option,
                                }));
                                document.body.click(); // This will close the Popover
                              }}
                            >
                              <Check
                                className={cn(
                                  "absolute left-2 w-4 h-4",
                                  filters[filterId] === option
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!selectedGame || !selectedRank}
            className="w-full"
          >
            Search Players
          </Button>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Search Results</h3>
              {searchResults.map((player) => (
                <Card key={player.id} className="mb-2">
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <div className="font-bold">{player.username}</div>
                      <div className="text-sm text-gray-500">
                        {player.game
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                        - {player.rank}
                      </div>
                    </div>
                    <Button onClick={() => handleInvite(player.id)}>
                      Invite
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Reminder Dialog */}
      <Dialog
        open={isRegistrationDialogOpen}
        onOpenChange={setIsRegistrationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Recommended</DialogTitle>
            <DialogDescription>
              Registering allows you to:
              <ul className="list-disc pl-5 mt-2">
                <li>Search and invite players easily</li>
                <li>Create and manage your game profile</li>
                <li>Connect with gaming community</li>
              </ul>
              Would you like to register now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setIsRegistrationDialogOpen(false)}
            >
              Not Now
            </Button>
            <Button
              onClick={() => {
                console.log("Redirect to registration");
              }}
            >
              Register Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerSearchPage;
