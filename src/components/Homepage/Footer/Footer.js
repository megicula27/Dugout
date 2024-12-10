"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faTwitter,
  faInstagram,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Newsletter Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Subscribe to our newsletter
          </h3>
          <div className="space-y-2">
            <Input
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
              placeholder="Enter your email"
              type="email"
            />
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-200">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Tournaments", "Games", "About Us"].map((link) => (
              <li key={link}>
                <Link
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Games */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Games</h3>
          <ul className="space-y-2">
            {[
              "Valorant",
              "League of Legends",
              "Brawl Stars",
              "Apex Legends",
            ].map((game) => (
              <li key={game}>
                <Link
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  {game}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white"
            >
              <FontAwesomeIcon icon={faDiscord} className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-white"
            >
              <FontAwesomeIcon icon={faTwitch} className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-800">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Gaming Tournament Platform. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
