"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Gamepad, Trophy, Users, UserPlus, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Glitch from "../Glitch/Glitch";
import Button from "../Button/Button";
import toast from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("You have signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleSignIn = () => {
    router.push("/auth");
  };

  const links = [
    { href: "/", label: "Dashboard", icon: <Home /> },
    { href: "/games", label: "Games", icon: <Gamepad /> },
    { href: "/tournament", label: "Tournaments", icon: <Trophy /> },
    { href: "/teams", label: "Teams", icon: <Users /> },
    { href: "/findplayer", label: "Players", icon: <UserPlus /> },
  ];

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-white text-xl font-semibold">
            <Glitch text="Gaming Hub" link="/" />
          </div>
          <div className="flex items-center space-x-6">
            {links.map((link) => (
              <div key={link.href} className="relative group">
                <Glitch text={link.label} link={link.href} />
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300
                    ${
                      pathname === link.href
                        ? "scale-x-100 bg-green-500"
                        : "scale-x-0 bg-green-500 group-hover:scale-x-100"
                    }`}
                />
              </div>
            ))}
            {session ? (
              <Button text="Sign Out" onClick={handleSignOut} />
            ) : (
              <Button text="Sign In" onClick={handleSignIn} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
