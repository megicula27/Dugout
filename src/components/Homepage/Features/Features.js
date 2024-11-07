"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Search } from "lucide-react";

const Features = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6 space-y-2">
              <Trophy className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Play Tournaments</h3>
              <p className="text-gray-500">
                Compete in daily tournaments across multiple games and win
                exciting prizes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <Search className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Find Players</h3>
              <p className="text-gray-500">
                Search and connect with active players to build your dream team.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Build Teams</h3>
              <p className="text-gray-500">
                Create or join teams, practice together, and dominate
                tournaments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
