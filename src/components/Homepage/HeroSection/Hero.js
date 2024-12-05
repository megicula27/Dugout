"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Hero = () => {
  return (
    <section className="relative py-20 bg-black text-white before:absolute before:top-0 before:left-1/4 before:right-1/4 before:border-t-2 before:border-dashed before:border-slate-800">
      <div className="px-4 md:px-6">
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
              <div className="flex w-full space-x-4">
                <Link
                  href="/games"
                  className="
          w-full 
          text-center 
          px-4 
          py-2 
          bg-green-600 
          text-white 
          font-semibold 
          rounded-md 
          relative 
          
          outline 
          outline-2 
          outline-slate-400  
          transition-all 
          duration-300 
          hover:-outline-offset-8 
          hover:outline-white
          hover:bg-green-700 
          focus:outline-none 
          focus:ring 
          focus:ring-green-300
        "
                >
                  Start Playing
                </Link>
                <Link
                  href="/tournaments"
                  className="
          w-full 
          text-center 
          px-4 
          py-2 
          bg-green-600 
          text-white 
          font-semibold 
          rounded-md 
          relative 
          
          outline 
          outline-2 
          outline-slate-400 
          transition-all 
          duration-300 
          hover:-outline-offset-8 
          hover:bg-green-700 
           hover:outline-white
          focus:outline-none 
          focus:ring 
          focus:ring-green-300
        "
                >
                  Browse Tournaments
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="Gaming Setup"
              className="aspect-video overflow-hidden rounded-xl object-cover"
              height="300"
              src="/homepage/thumbnail.png"
              width="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
