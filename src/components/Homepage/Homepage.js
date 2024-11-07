"use client";
import Hero from "@/components/import/import";
import GameSection from "@/components/import/import";
import Features from "@/components/import/import";
import Team from "@/components/import/import";
import Footer from "@/components/import/import";
import ActiveTournaments from "@/components/import/import";
export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />
      {/* Games Section */}
      <GameSection />
      {/* Features Section */}
      <Features />
      {/* Active Tournaments Section */}
      <ActiveTournaments />
      {/* Team Section */}
      <Team />
      {/* Footer */}
      <Footer />
    </div>
  );
}
