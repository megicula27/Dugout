"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Search } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Trophy,
      title: "Play Tournaments",
      description:
        "Compete in daily tournaments across multiple games and win exciting prizes.",
    },
    {
      icon: Search,
      title: "Find Players",
      description:
        "Search and connect with active players to build your dream team.",
    },
    {
      icon: Users,
      title: "Build Teams",
      description:
        "Create or join teams, practice together, and dominate tournaments.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
