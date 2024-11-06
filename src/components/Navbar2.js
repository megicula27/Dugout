"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart2,
  FileText,
} from "lucide-react";

const NavLink = ({ href, icon, children, isActive, onClick }) => {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors duration-300 cursor-pointer ${
          isActive
            ? "bg-white text-[#6C63FF] shadow-lg"
            : "bg-[#6C63FF] hover:bg-[#5a51e6] text-white"
        }`}
        animate={{
          y: isActive ? 0 : -8,
          scale: isActive ? 1.05 : 1,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        whileHover={{
          scale: 1.1,
          y: isActive ? 0 : -12,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        }}
        whileTap={{
          scale: 0.95,
          y: isActive ? 0 : -4,
          transition: { duration: 0.2 },
        }}
      >
        {icon}
        <span>{children}</span>
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
      <motion.svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        animate={{
          x: [0, "50%", 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "linear",
        }}
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
      </motion.svg>
    </motion.div>
  );
};

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6C63FF] to-transparent"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-[#6C63FF] to-transparent"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#6C63FF] to-transparent"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6C63FF] to-transparent"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  );
};

export default function Navbar() {
  const [activeLink, setActiveLink] = useState(0);

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
    { href: "#", icon: <Calendar className="h-5 w-5" />, label: "Calendar" },
    { href: "#", icon: <BarChart2 className="h-5 w-5" />, label: "Charts" },
    { href: "#", icon: <FileText className="h-5 w-5" />, label: "Documents" },
  ];

  return (
    <div className="relative bg-[#6C63FF] overflow-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between py-4 relative">
          <motion.div
            className="text-white text-xl font-semibold"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            Navbar
          </motion.div>
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <NavLink
                key={index}
                href={link.href}
                icon={link.icon}
                isActive={activeLink === index}
                onClick={() => setActiveLink(index)}
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
