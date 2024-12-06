"use client";
import { Card, CardContent } from "@/components/ui/card";

const featuredGames = [
  {
    id: 1,
    name: "Valorant",
    tag: "valorant",
    image: "/homepage/valorant.jpeg",
  },
  {
    id: 2,
    name: "Brawl Stars",
    tag: "brawl-stars",
    image: "/homepage/brawlStars.jpeg",
  },
  {
    id: 3,
    name: "Apex Legends",
    tag: "apex-legends",
    image: "/homepage/apex-legends.jpg",
  },
  { id: 4, name: "Csgo", tag: "csgo", image: "/homepage/csgo.jpg" },
  {
    id: 5,
    name: "League of Legends",
    tag: "league-of-legends",
    image: "/homepage/LeagueofLegends.jpeg",
  },
];

export default function GameSelection({ onGameSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {featuredGames.map((game) => (
        <Card
          key={game.id}
          className="cursor-pointer  border-transparent text-white shadow-white shadow-md hover:shadow-white hover:shadow-lg transition-shadow duration-300"
          style={{
            backgroundImage: `url(${game.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => onGameSelect({ name: game.name, tag: game.tag })}
        >
          <CardContent className="p-4 flex flex-col items-center bg-black/50 h-64 justify-center">
            <h2 className="text-lg font-semibold text-center text-white">
              {game.name}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
