"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const featuredGames = [
  { id: 1, name: "Valorant", image: "/homepage/valorant.jpeg" },
  { id: 2, name: "Brawl Stars", image: "/homepage/brawlStars.jpeg" },
  { id: 3, name: "Apex Legends", image: "/homepage/apex-legends.jpg" },
  { id: 4, name: "CS:GO", image: "/homepage/csgo.jpeg" },
  { id: 5, name: "League of Legends", image: "/homepage/LeagueofLegends.jpeg" },
];

export default function GameSelection({ onGameSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {featuredGames.map((game) => (
        <Card
          key={game.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onGameSelect(game)}
        >
          <CardContent className="p-4 flex flex-col items-center">
            <Image
              src={game.image}
              alt={game.name}
              width={100}
              height={100}
              className="rounded-lg mb-2"
            />
            <h2 className="text-lg font-semibold text-center">{game.name}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}