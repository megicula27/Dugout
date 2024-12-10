"use client";
import GamesCarousel from "./GameCarousel";

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
    {
      id: 5,
      name: "Counter-Strike: Global Offensive",
      players: "10M+",
      source: "/homepage/csgo.jpg",
    },
  ];

  return <GamesCarousel games={games} />;
}
