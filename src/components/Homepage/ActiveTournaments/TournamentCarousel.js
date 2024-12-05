"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy } from "lucide-react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

export default function TournamentCarousel() {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/tournaments", {
          params: {
            page: 1,
            sortBy: "startDate",
          },
        });

        setTournaments(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Active Tournaments
        </h2>
        <div className="grid place-items-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Tournament Error
        </h2>
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">
              Failed to load tournaments. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render when no tournaments are available
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Active Tournaments
        </h2>
        <Card className="max-w-4xl mx-auto border-transparent bg-black/10 from-primary/10 to-primary/20">
          <CardContent className="p-8 text-center text-white  shadow-white shadow-md hover:shadow-white hover:shadow-lg transition-shadow duration-300">
            <Trophy className="mx-auto mb-6 h-16 w-16 text-white" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              Join Exciting New Tournaments
            </h3>
            <p className="text-gray-300 mb-6">
              No active tournaments right now. Check back soon or be the first
              to sign up!
            </p>
            <Link href="/tournaments">
              <Button className="bg-primary hover:bg-primary/90">
                Explore Tournaments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render tournaments carousel
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Active Tournaments
      </h2>

      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-4 ">
          {tournaments.map((tournament) => (
            <CarouselItem
              key={tournament._id}
              className="md:basis-1/2 lg:basis-1/3 pl-4"
            >
              <Link href={`/tournaments`}>
                <Card className="p-8 bg-black/20 border-transparent text-center text-white  shadow-white shadow-md hover:shadow-white hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">
                        {tournament.name}
                      </h3>
                      <Gamepad2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white">
                        Game: {tournament.tag}
                      </p>
                      <p className="text-sm text-white">
                        Prize Pool: ₹{tournament.prize}
                      </p>
                      <p className="text-sm text-white">
                        Start Date:{" "}
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-white">
                        Status: {tournament.status}
                      </p>
                    </div>
                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                      View Tournament
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white bg-black/50" />
        <CarouselNext className="text-white bg-black/50" />
      </Carousel>
    </div>
  );
}
