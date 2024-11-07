"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900 text-gray-100">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Subscribe to our newsletter
            </h3>
            <form className="flex flex-col gap-2">
              <Input
                className="bg-gray-800 border-gray-700"
                placeholder="Enter your email"
                type="email"
              />
              <Button>Subscribe</Button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link className="hover:text-primary" href="#">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="#">
                  Games
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary" href="#">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Games</h3>
            <ul className="space-y-2">
              {games.map((game) => (
                <li key={game.id}>
                  <Link className="hover:text-primary" href="#">
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <Button variant="outline" size="icon">
                <Link href="#">Discord</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Link href="#">Twitter</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Link href="#">Instagram</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 Gaming Tournament Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
