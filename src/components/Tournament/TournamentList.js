"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Trophy, Users, Eye, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

const TournamentList = ({ tournament, onJoinLeave }) => {
  const { data: session } = useSession();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [timeState, setTimeState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState(null);
  const [isJoined, setIsJoined] = useState();
  const calculateTimeLeft = (startDate, endDate) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) {
      // Tournament hasn't started
      const timeLeft = start - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return {
        status: "upcoming",
        text: `Starts in ${days}d ${hours}h ${minutes}m`,
      };
    } else if (now >= start && now <= end) {
      // Tournament is live
      return { status: "live", text: "LIVE" };
    } else {
      // Tournament has ended
      return { status: "ended", text: "Ended" };
    }
  };
  useEffect(() => {
    const fetchTeamName = async (game) => {
      try {
        // console.log(
        //   "start time ",
        //   tournament.startDate,
        //   "end Date ",
        //   tournament.endDate
        // );
        if (game === "all" || !session?.user?.id) return null;

        const { data } = await axios.post(
          `/api/games/${game}/teamAndTournaments`,
          {
            id: session.user?.id,
          }
        );
        // console.log(data);

        if (data.team?.teamName) {
          setTeamName(data.team?.teamName);
          setIsJoined(tournament?.teams?.includes(data.team?.teamName));
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    fetchTeamName(tournament.game);
  }, [tournament, session]);

  useEffect(() => {
    const updateTime = () => {
      if (tournament) {
        setTimeState(
          calculateTimeLeft(tournament.startDate, tournament.endDate)
        );
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tournament]);

  const getStatusBadge = () => {
    if (!timeState) return null;

    const statusStyles = {
      live: "bg-red-500 text-white animate-pulse",
      upcoming: "bg-blue-500 text-white",
      ended: "bg-gray-500 text-white",
    };

    return (
      <Badge className={statusStyles[timeState.status]}>{timeState.text}</Badge>
    );
  };

  // If no tournament is passed, return null
  if (!tournament) return null;

  // Check if user has already joined the tournament
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">
              {tournament.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 mb-4">{tournament.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <p className="font-semibold">₹{tournament.prize}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <p>
                {tournament.teams?.length || 0}/{tournament.tournamentSize}{" "}
                Teams
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <p>{new Date(tournament.startDate).toLocaleDateString()}</p>
            </div>
            {getStatusBadge()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {timeState?.status === "live" && (
            <Button variant="outline" onClick={() => {}}>
              <Eye className="mr-2 h-4 w-4" /> Watch
            </Button>
          )}
          {timeState?.status === "ended" && (
            <Button variant="outline" onClick={() => {}}>
              <Check className="mr-2 h-4 w-4" /> Check Results
            </Button>
          )}
          {timeState?.status === "upcoming" && (
            <>
              <Button
                variant="outline"
                onClick={() => setSelectedTournament(tournament)}
              >
                View Teams
              </Button>
              <Button
                variant={isJoined ? "destructive" : "default"}
                onClick={() =>
                  onJoinLeave(
                    tournament.uid,
                    tournament.game,
                    isJoined ? "Leave" : "Join"
                  )
                }
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                ) : isJoined ? (
                  "Leave"
                ) : (
                  "Join"
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Dialog
        open={!!selectedTournament}
        onOpenChange={() => setSelectedTournament(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTournament?.name} - Teams</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedTournament?.teams?.length ? (
              selectedTournament.teams.map((team, index) => (
                <div key={team} className="p-2 bg-gray-100 rounded">
                  <p>{team}</p>
                </div>
              ))
            ) : (
              <p>No teams have joined yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentList;
