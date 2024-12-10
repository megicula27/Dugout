"use client";

import * as React from "react";
import { Menu, X, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import "@/styles/nav-hamburger.css";
import { signOut, useSession } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.4,
        ease: [0.2, 0.8, 0.4, 1],
      },
    },
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      y: 10,
    },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.2, 0.8, 0.4, 1],
      },
    }),
  };

  const links = [
    { href: "/games", label: "Games" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
  ];
  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut({ callbackUrl: "/" });
      toast.success("You have signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <Link href="/" className="logo">
          <HeartHandshake className="logo-text" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="menu-button hover:bg-slate-800"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-10 w-10 text-white " size={36} />
          ) : (
            <Menu className="h-10 w-10 text-white " />
          )}
        </Button>
      </header>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav className="nav">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      href={link.href}
                      className="nav-link"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  custom={links.length}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  className="button-container"
                >
                  {session?.user?.id ? (
                    <Link
                      href="/auth"
                      className="w-full text-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md relative border-white outline outline-2 outline-white-500  transition-all duration-300 hover:-outline-offset-8 hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Link>
                  ) : (
                    <Link
                      href="/auth"
                      className="w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md relative border-white outline outline-2 outline-white-500  transition-all duration-300 hover:-outline-offset-8 hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
