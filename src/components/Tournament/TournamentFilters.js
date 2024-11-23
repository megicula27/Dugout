"use client";
import React, { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Check,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Plus,
  Minus,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
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

  const [gameOpen, setGameOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

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

  const participationOptions = [
    { value: null, label: "All Tournaments" },
    { value: true, label: "Joined Only" },
    { value: false, label: "Not Joined" },
  ];

  const handlePrizeChange = (value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 1000000) {
      handleFilterChange("prize", numValue);
    }
  };

  const incrementPrize = () => {
    handlePrizeChange(filters.prize + 1000);
  };

  const decrementPrize = () => {
    handlePrizeChange(filters.prize - 1000);
  };

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

      Object.entries(filterParams).forEach(([key, value]) => {
        queryParams.append(key, value?.toString() ?? "");
      });

      if (currentTeamId) {
        queryParams.append("teamId", currentTeamId);
      }

      const endpoint =
        filterParams.game === "all"
          ? "/api/tournaments"
          : `/api/games/${filterParams.game}/tournaments`;
      console.log(`Query----> ${endpoint}?${queryParams.toString()}`);

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
    if (filters.game !== "all") {
      const newTeamId = await fetchTeamId(filters.game);
      setTeamId(newTeamId);
      await fetchTournaments(filters, newTeamId);
    } else {
      setTeamId(null);
      await fetchTournaments(filters, null);
    }
  };

  const getSelectedLabel = (options, value) => {
    return (
      options.find((option) => option.value === value)?.label || "Select..."
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-foreground">Game</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-background text-foreground"
            >
              {filters.game === "all"
                ? "All Games"
                : games.find((g) => g.value === filters.game)?.label}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" p-0 bg-background">
            {games.map((game) => (
              <Button
                key={game.value}
                variant="ghost"
                className={cn(
                  "relative w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground pl-8",
                  filters.game === game.value && "bg-accent"
                )}
                onClick={() => handleFilterChange("game", game.value)}
              >
                <Check
                  className={cn(
                    "absolute left-2 w-4 h-4",
                    filters.game === game.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {game.label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Sort By</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-background text-foreground"
            >
              {
                sortOptions.find((option) => option.value === filters.sortBy)
                  ?.label
              }
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-background">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className={cn(
                  "relative w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground pl-8",
                  filters.sortBy === option.value && "bg-accent"
                )}
                onClick={() => handleFilterChange("sortBy", option.value)}
              >
                <Check
                  className={cn(
                    "absolute left-2 w-4 h-4",
                    filters.sortBy === option.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Minimum Prize Pool (₹)</Label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementPrize}
            disabled={filters.prize <= 0}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={filters.prize}
            onChange={(e) => handlePrizeChange(e.target.value)}
            className="text-center"
            min="0"
            max="1000000"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={incrementPrize}
            disabled={filters.prize >= 1000000}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          ₹{filters.prize.toLocaleString()}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Participation</Label>
        <div className="grid gap-2">
          <Button
            variant={filters.joined === null ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.joined === null && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("joined", null)}
          >
            All Tournaments
          </Button>
          <Button
            variant={filters.joined === true ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.joined === true && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("joined", true)}
          >
            Joined Only
          </Button>
          <Button
            variant={filters.joined === false ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.joined === false && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("joined", false)}
          >
            Not Joined
          </Button>
        </div>
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );

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
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Tournaments</h1>
        </div>
        <div className="ml-auto">
          {" "}
          {/* This ensures the filter button stays on the far right */}
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center mx-auto h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <TournamentList
          tournaments={tournaments}
          teamId={teamId}
          onJoinLeave={(tournamentId) => {
            console.log("Join/Leave tournament:", tournamentId);
          }}
        />
      )}
    </div>
  );
};

export default TournamentFiltersAndList;
