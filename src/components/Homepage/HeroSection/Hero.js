"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="relative py-20 bg-black text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Ultimate Gaming
                <br />
                Tournament Platform
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                Join millions of gamers and compete in tournaments for your
                favorite games. Build your team, showcase your skills, and win
                prizes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg">Start Playing</Button>
              <Button variant="outline" size="lg">
                Browse Tournaments
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="Gaming Setup"
              className="aspect-video overflow-hidden rounded-xl object-cover"
              height="300"
              src="/homepage/thumbnail.jpg"
              width="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
