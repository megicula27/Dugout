"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react"; // Add this import
import { showSuccessNotification } from "@/utils/Notifications/notifications";
const GAME_OPTIONS = [
  { value: "brawl-stars", label: "Brawl Stars" },
  { value: "valorant", label: "Valorant" },
  { value: "apex-legends", label: "Apex Legends" },
  { value: "csgo", label: "CS:GO" },
  { value: "league-of-legends", label: "League of Legends" },
];

const CreateTournamentForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tournamentName: "",
    description: "",
    prize: "",
    tournamentSize: "",
    startDate: "",
    endDate: "",
    game: "",
  });
  const { data: session } = useSession();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      game: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.tournamentName ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.tournamentSize ||
      !formData.game
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const now = new Date();

    if (start < now) {
      setError("Start date must be in the future");
      return false;
    }

    if (end <= start) {
      setError("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    // Create the request payload
    const payload = {
      tournamentName: formData.tournamentName,
      description: formData.description,
      prize: Number(formData.prize) || 0,
      tournamentSize: Number(formData.tournamentSize),
      startDate: formData.startDate,
      endDate: formData.endDate,
      game: formData.game,
    };

    try {
      console.log("Submitting with payload:", payload);
      console.log("To URL:", `/api/games/${formData.game}/createtournament`);

      const { data } = await axios.post(
        `/api/games/${formData.game}/createtournament`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessNotification(
        data.message || "Tournament created successfully!!"
      );
      console.log("Response:", data);
      // router.push(`/tournaments/${data.tournament.uid}`);
    } catch (err) {
      console.error("Full error:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        });
        setError(err.response.data?.message || "Server error occurred");
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        setError("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError("Failed to make request");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create New Tournament
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="game">Game*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {formData.game
                    ? GAME_OPTIONS.find((game) => game.value === formData.game)
                        ?.label
                    : "Select a game"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="space-y-1 p-1">
                  {GAME_OPTIONS.map((game) => (
                    <Button
                      key={game.value}
                      variant={
                        formData.game === game.value ? "secondary" : "ghost"
                      }
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        handleGameChange(game.value);
                      }}
                    >
                      {formData.game === game.value && (
                        <Check className="h-4 w-4" />
                      )}
                      {game.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournamentName">Tournament Name*</Label>
            <Input
              id="tournamentName"
              name="tournamentName"
              value={formData.tournamentName}
              onChange={handleChange}
              placeholder="Enter tournament name"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter tournament description"
              className="w-full min-h-[100px]"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prize">Prize Pool</Label>
              <Input
                id="prize"
                name="prize"
                type="number"
                value={formData.prize}
                onChange={handleChange}
                placeholder="Enter prize amount"
                className="w-full"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournamentSize">Tournament Size*</Label>
              <Input
                id="tournamentSize"
                name="tournamentSize"
                type="number"
                value={formData.tournamentSize}
                onChange={handleChange}
                placeholder="Number of teams"
                className="w-full"
                required
                min="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date*
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date*
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Creating Tournament..." : "Create Tournament"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTournamentForm;
