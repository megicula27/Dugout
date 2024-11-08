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
      <section className="bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <Hero />
        </div>
      </section>

      {/* Games Section */}
      <section className="bg-gray-200 py-12 z-10">
        <div className="bg-white container mx-auto px-4 py-10 md:px-6">
          <GameSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className=" mx-auto px-4 md:px-6">
          <Features />
        </div>
      </section>

      {/* Active Tournaments Section */}
      <section className="bg-gray-50 py-12">
        <div className="bg-white mx-auto py-10 px-4 md:px-6">
          <ActiveTournaments />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-200 py-12 ">
        <div className="bg-slate-50  mx-auto px-4 py-10 md:px-6">
          <Team />
        </div>
      </section>

      {/* Footer */}
      <section className="bg-gray-900 ">
        <Footer />
      </section>
    </div>
  );
}
