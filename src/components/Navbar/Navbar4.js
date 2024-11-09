"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Gamepad, Trophy, Users, UserPlus } from "lucide-react"; // Importing Lucide React icons

const Navbar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const router = useRouter();

  const handleLinkClick = (index, href) => {
    setActiveLink(index);
    router.push(href);
  };

  const links = [
    { href: "/", label: "Dashboard", icon: <Home /> },
    { href: "/games", label: "Games", icon: <Gamepad /> },
    { href: "/tournament", label: "Tournaments", icon: <Trophy /> },
    { href: "/teams", label: "Teams", icon: <Users /> },
    { href: "/findplayer", label: "Players", icon: <UserPlus /> },
  ];

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white text-xl font-semibold">
            Gaming Hub
          </Link>
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`px-3 py-2 flex items-center gap-2 rounded-lg text-white transition-all duration-300 ease-in-out transform ${
                  activeLink === index
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-700 hover:text-gray-300"
                }`}
                onClick={() => handleLinkClick(index, link.href)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
