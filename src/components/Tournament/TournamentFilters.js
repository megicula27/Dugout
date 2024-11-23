"use client";
import React, { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Filter, SlidersHorizontal } from "lucide-react";
import TournamentList from "./TournamentList";
const TournamentFiltersAndList = () => {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = useState([]);
  const [teamId, setTeamId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    game: "all",
    sortBy: "startDate",
    prize: 0,
    joined: null,
  });

  // Initialize with mobile detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const games = [
    { value: "all", label: "All Games" },
    { value: "brawl-stars", label: "Brawl Stars" },
    { value: "valorant", label: "Valorant" },
    { value: "apex-legends", label: "Apex Legends" },
    { value: "csgo", label: "CSGO" },
    { value: "league-of-legends", label: "League of Legends" },
  ];

  const sortOptions = [
    { value: "startDate", label: "Start Date" },
    { value: "prize", label: "Prize Pool" },
    { value: "tournamentSize", label: "Tournament Size" },
  ];
  const fetchTeamId = async (game) => {
    try {
      if (game === "all" || !session?.user?.id) return null;

      const response = await fetch(`/api/games/${game}/teamAndTournaments`);
      const data = await response.json();

      if (data.success && data.data?.team) {
        return data.data.team;
      }
      return null;
    } catch (error) {
      console.error("Error fetching team:", error);
      return null;
    }
  };
  const fetchTournaments = useCallback(async (filterParams, currentTeamId) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add all filter params regardless of value
      Object.entries(filterParams).forEach(([key, value]) => {
        queryParams.append(key, value?.toString() ?? "");
      });

      // Add teamId to query params if available
      if (currentTeamId) {
        queryParams.append("teamId", currentTeamId);
      }

      const endpoint =
        filterParams.game === "all"
          ? "/api/tournaments"
          : `/api/games/${filterParams.game}/tournaments`;

      const response = await fetch(`${endpoint}?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTournaments(data.data);
      } else {
        console.error("Failed to fetch tournaments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    // First, fetch team ID if game is selected
    if (filters.game !== "all") {
      const newTeamId = await fetchTeamId(filters.game);
      setTeamId(newTeamId);
      // Fetch tournaments with the new team ID
      await fetchTournaments(filters, newTeamId);
    } else {
      setTeamId(null);
      await fetchTournaments(filters, null);
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Game</Label>
        <Select
          value={filters.game}
          onValueChange={(value) => handleFilterChange("game", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select game" />
          </SelectTrigger>
          <SelectContent>
            {games.map((game) => (
              <SelectItem key={game.value} value={game.value}>
                {game.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange("sortBy", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Minimum Prize Pool ($)</Label>
        <div className="pt-2">
          <Slider
            value={[filters.prize]}
            onValueChange={([value]) => handleFilterChange("prize", value)}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="mt-1 text-sm text-gray-500">${filters.prize}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Participation</Label>
        <RadioGroup
          value={filters.joined?.toString()}
          onValueChange={(value) =>
            handleFilterChange("joined", value === "null" ? null : value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="null" id="all" />
            <Label htmlFor="all">All Tournaments</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="joined" />
            <Label htmlFor="joined">Joined Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="not-joined" />
            <Label htmlFor="not-joined">Not Joined</Label>
          </div>
        </RadioGroup>
      </div>

      <Button className="w-full" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );

  // Effect to fetch initial tournaments
  React.useEffect(() => {
    fetchTournaments(filters);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <FilterContent />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <TournamentList
          tournaments={tournaments}
          teamId={teamId}
          onJoinLeave={(tournamentId) => {
            // Handle join/leave logic here
            console.log("Join/Leave tournament:", tournamentId);
          }}
        />
      )}
    </div>
  );
};

export default TournamentFiltersAndList;
