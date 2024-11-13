"use client";
import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";

export default function GameSection() {
  const games = [
    {
      id: 1,
      name: "Valorant",
      players: "1M+",
      source: "/homepage/valorant.jpeg",
    },
    {
      id: 2,
      name: "League of Legends",
      players: "2M+",
      source: "/homepage/LeagueofLegends.jpeg",
    },
    {
      id: 3,
      name: "Brawl Stars",
      players: "500K+",
      source: "/homepage/brawlStars.jpeg",
    },
    {
      id: 4,
      name: "Apex Legends",
      players: "1.5M+",
      source: "/homepage/apex-legends.jpg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {games.map((game) => (
          <Card key={game.id} className="w-full max-w-sm">
            <CardContent className="p-6">
              <Image
                alt={game.name}
                className="aspect-square object-contain rounded-lg mb-4"
                height="200"
                src={game.source}
                width="200"
              />
              <h3 className="font-semibold text-lg">{game.name}</h3>
              <p className="text-sm text-gray-500">
                {game.players} Active Players
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
