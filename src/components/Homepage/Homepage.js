"use client";
import {
  Hero,
  GameSection,
  Features,
  Team,
  Footer,
  ActiveTournaments,
} from "@/components/import/import";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black pt-28 pb-10">
        <div className="mx-auto  px-4 md:px-6">
          <Hero />
        </div>
      </section>

      {/* Games Section */}
      <section className="bg-[url('/homepage/features-background.png')] bg-cover bg-no-repeat bg-center py-10">
        <div className="bg-transparent  mx-auto px-4 py-14 md:px-6">
          <GameSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-12">
        <div className="mx-auto px-4 md:px-6">
          <Features />
        </div>
      </section>

      {/* Active Tournaments Section */}
      <section className="bg-[url('/homepage/background.png')] bg-cover bg-no-repeat bg-center py-28">
        <div className="mx-auto py-28 px-4 md:px-6">
          <ActiveTournaments />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-black py-24 ">
        <div className="  mx-auto px-4 py-10 md:px-6">
          <Team />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-gray-950 ">
        <Footer />
      </section>
    </div>
  );
}
