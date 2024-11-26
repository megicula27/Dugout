"use client";
import React, { useState, useCallback, useEffect } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import TournamentList from "./TournamentList";
import axios from "axios";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notifications";
import { useRouter } from "next/navigation";

const TournamentFiltersAndList = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [tournaments, setTournaments] = useState([]);
  const [userTournaments, setUserTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    game: "all",
    sortBy: "startDate",
    prize: 0,
    joined: null,
    active: null,
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

  const fetchUserTournaments = async () => {
    if (!session?.user?.id) return;

    try {
      const { data } = await axios.post(`/api/users/getTournaments`, {
        userId: session.user.id,
      });

      setUserTournaments(data.tournaments || []);
    } catch (error) {
      console.error("Error fetching user tournaments:", error);
    }
  };

  const fetchTournaments = useCallback(
    async (filterParams, currentTeamName) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        Object.entries(filterParams).forEach(([key, value]) => {
          queryParams.append(key, value?.toString() ?? "");
        });

        // if (currentTeamName) {
        //   queryParams.append("teamName", currentTeamName);
        // }

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
    },
    []
  );

  const handleJoinLeave = async (tournamentId, tournamentGame, action) => {
    try {
      if (!session?.user?.id) {
        showErrorNotification("Please login to perform this action");
        return;
      }

      setLoading(true);

      const endpoint =
        action === "Leave" ? "leavetournament" : "jointournament";

      const response = await axios.post(
        `/api/games/${tournamentGame}/${endpoint}`,
        {
          tournamentId: tournamentId,
          userId: session.user.id,
        }
      );

      if (response.data.success) {
        showSuccessNotification(
          `Tournament ${action.toLowerCase()}ed successfully!`
        );

        // Refresh user tournaments and tournaments
        await fetchUserTournaments();
        await handleApplyFilters();
      } else {
        showErrorNotification(
          response.data.error || `Failed to ${action.toLowerCase()} tournament`
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        `Something went wrong while ${action.toLowerCase()}ing tournament`;

      showErrorNotification(errorMessage);
      console.error(`Error ${action.toLowerCase()}ing tournament:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    if (filters.game !== "all") {
      const newTeamName = await fetchTeamName(filters.game);
      await fetchTournaments(filters, newTeamName);
    } else {
      await fetchTournaments(filters, null);
    }
  };

  useEffect(() => {
    // Fetch initial tournaments and user tournaments
    fetchTournaments(filters);
    fetchUserTournaments();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const FilterContent = () => (
    <div
      className="space-y-6 overflow-y-auto max-h-[100vh]"
      style={{
        overscrollBehavior: "contain",
        scrollbarWidth: "thin",
      }}
    >
      {/* Game Filter */}
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
          <PopoverContent className="p-0 bg-background">
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

      {/* Sort By Filter */}
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

      {/* Prize Pool Filter */}
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

      {/* Participation Filter */}
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

      {/* Active Status Filter */}
      <div className="space-y-2">
        <Label className="text-foreground">Tournament Status</Label>
        <div className="grid gap-2">
          <Button
            variant={filters.active === null ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.active === null && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("active", null)}
          >
            All Tournaments
          </Button>
          <Button
            variant={filters.active === true ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.active === true && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("active", true)}
          >
            Active Tournaments
          </Button>
          <Button
            variant={filters.active === false ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-foreground",
              filters.active === false && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleFilterChange("active", false)}
          >
            Inactive Tournaments
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 w-full">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Tournaments</h1>
        </div>
        <div className="ml-auto">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="overflow-y-auto"
                style={{
                  overscrollBehavior: "contain",
                  scrollbarWidth: "thin",
                }}
              >
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
              <DropdownMenuContent
                className="w-80 p-4 max-h-[80vh] overflow-y-auto"
                align="end"
                style={{
                  overscrollBehavior: "contain",
                  scrollbarWidth: "thin",
                }}
              >
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
        tournaments.map((tournament) => (
          <TournamentList
            key={tournament.id}
            tournament={tournament}
            userTournaments={userTournaments}
            onJoinLeave={(tournamentId, tournamentGame, action) => {
              handleJoinLeave(tournamentId, tournamentGame, action);
            }}
          />
        ))
      )}
    </div>
  );
};

export default TournamentFiltersAndList;
