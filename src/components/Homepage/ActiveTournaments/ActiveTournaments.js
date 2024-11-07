"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { useState } from "react";

const tournaments = [
  {
    id: 1,
    name: "Valorant Championship",
    prize: "$10,000",
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    name: "League of Legends Cup",
    prize: "$15,000",
    date: "Dec 20, 2024",
  },
  {
    id: 3,
    name: "Apex Legends Battle",
    prize: "$8,000",
    date: "Dec 25, 2024",
  },
];
const ActiveTournaments = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="py-12 bg-gray-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Active Tournaments
        </h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="w-full flex-shrink-0 px-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{tournament.name}</h3>
                        <Gamepad2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Prize Pool: {tournament.prize}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {tournament.date}
                      </p>
                      <Button className="mt-4 w-full">Join Tournament</Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {tournaments.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                size="icon"
                className={`w-3 h-3 rounded-full p-0 ${
                  currentSlide === index ? "bg-primary" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveTournaments;
