"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  PersonStanding,
  Swords,
  LogOut,
  LogIn,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const NavLink = ({ href, icon, children, isActive, onClick }) => {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors duration-300 cursor-pointer ${
          isActive
            ? "bg-white text-[#6C63FF]"
            : "bg-[#6C63FF] hover:bg-[#5a51e6] text-white"
        }`}
        whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: isActive ? 0 : -8,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <motion.div
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <motion.span
          animate={isActive ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
        >
          {children}
        </motion.span>
      </motion.div>
    </Link>
  );
};

const WaveTransition = ({ activeIndex, totalLinks }) => {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-3 bg-white"
      initial={false}
      animate={{
        clipPath: `inset(0 0 0 ${(activeIndex / totalLinks) * 100}%)`,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,0 Q50,100 100,0 L100,100 L0,100 Z"
          fill="white"
          animate={{
            d: [
              "M0,0 Q50,100 100,0 L100,100 L0,100 Z",
              "M0,0 Q50,0 100,0 L100,100 L0,100 Z",
              "M0,0 Q50,100 100,0 L100,100 L0,100 Z",
            ],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
};

export default function Navbar() {
  const [activeLink, setActiveLink] = useState(0);
  const { data: session } = useSession();

  const links = [
    {
      href: "#",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "#",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Address Book",
    },
    { href: "/games", icon: <Gamepad2 className="h-5 w-5" />, label: "Games" },
    {
      href: "/tournament",
      icon: <Swords className="h-5 w-5" />,
      label: "Tournaments",
    },
    {
      href: "/findplayer",
      icon: <PersonStanding className="h-5 w-5" />,
      label: "Players",
    },
    {
      href: session ? "#" : "/api/auth/signin",
      icon: session ? (
        <LogOut className="h-5 w-5" />
      ) : (
        <LogIn className="h-5 w-5" />
      ),
      label: session ? "Sign Out" : "Sign In",
      onClick: session ? () => signOut({ callbackUrl: "/" }) : undefined,
    },
  ];

  return (
    <div className="relative bg-[#6C63FF]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 relative">
          <div className="text-white text-xl font-semibold">Navbar</div>
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <NavLink
                key={index}
                href={link.href}
                icon={link.icon}
                isActive={activeLink === index}
                onClick={() => {
                  setActiveLink(index);
                  if (link.onClick) {
                    link.onClick();
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <WaveTransition activeIndex={activeLink} totalLinks={links.length} />
        </div>
      </div>
    </div>
  );
}
