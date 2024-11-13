"use client";

import * as React from "react";
import { Menu, X, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/Button";
import "@/styles/nav-hamburger.css";

export default function Component() {
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
    { href: "/tournament", label: "Tournament" },
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
  ];

  return (
    <>
      <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <Link href="/" className="logo">
          <HeartHandshake className="logo-text" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-6 w-6" size={36} />
          ) : (
            <Menu className="h-6 w-6" size={36} />
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
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
