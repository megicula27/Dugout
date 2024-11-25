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
import { Clock, Trophy, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
const TournamentList = ({ tournaments = [], onJoinLeave }) => {
  const { data: session } = useSession();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [userTournaments, setUserTournaments] = useState(null);
  const [timeStates, setTimeStates] = useState({});
  const [loading, setLoading] = useState(false);

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
    const updateTimes = () => {
      const newTimeStates = {};
      tournaments.forEach((tournament) => {
        newTimeStates[tournament._id] = calculateTimeLeft(
          tournament.startDate,
          tournament.endDate
        );
      });
      setTimeStates(newTimeStates);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tournaments]);

  useEffect(() => {
    const getUserTournaments = async () => {
      const data = await axios.post(`api/users/getTournaments`, {
        userId: session?.user?.id,
      });
      console.log("from tournamentList", data.data.tournaments);
      setUserTournaments(data.data.tournaments);
    };

    getUserTournaments();
  }, []);
  const getStatusBadge = (timeState) => {
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
  const handleJoinLeave = async (tournamentId, game, action) => {
    try {
      setLoading(true);
      await onJoinLeave(tournamentId, game, action);
      // Optionally update UI or show success message
    } catch (error) {
      // Show error message to user
      console.error("Failed to join/leave tournament:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tournaments.map((tournament) => (
        <Card key={tournament._id} className="flex flex-col">
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
              {getStatusBadge(timeStates[tournament._id])}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedTournament(tournament)}
            >
              View Teams
            </Button>

            <Button
              variant={
                tournament.teams?.includes(teamName) ? "destructive" : "default"
              }
              onClick={() =>
                handleJoinLeave(
                  tournament._id,
                  tournament.game,
                  userTournaments.includes(tournament.uid) ? "Leave" : "Join"
                )
              }
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center mx-auto h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : tournament.teams?.includes(teamName) ? (
                "Leave"
              ) : (
                "Join"
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}

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
                  <p>{selectedTournament.teams.name}</p>
                </div>
              ))
            ) : (
              <p>No teams have joined yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TournamentList;
