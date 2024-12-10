import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const GamesCarousel = ({ games }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Featured Games
      </h2>

      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 3,
        }}
      >
        <CarouselContent className="-ml-4">
          {games.map((game) => (
            <CarouselItem
              key={game.id}
              className="md:basis-1/2 lg:basis-1/3 pl-4"
            >
              <Card
                style={{ backgroundImage: `url(${game.source})` }}
                className="w-full bg-cover bg-no-repeat bg-center py-10 border-transparent shadow-white shadow-md hover:shadow-white hover:shadow-lg"
              >
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-lg text-white">
                      {game.name}
                    </h3>
                    <p className="text-sm text-white">
                      {game.players} Active Players
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white bg-black" />
        <CarouselNext className="text-white bg-black" />
      </Carousel>
    </div>
  );
};

export default GamesCarousel;
