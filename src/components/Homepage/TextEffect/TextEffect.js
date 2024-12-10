// App.js or any component file
"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/TextEffect.css"; // Import your CSS file

gsap.registerPlugin(ScrollTrigger);

const textEffects = () => {
  useEffect(() => {
    const textElements = document.querySelectorAll(".text");

    textElements.forEach((text) => {
      gsap.to(text, {
        backgroundSize: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: text,
          start: "center 80%",
          end: "center 20%",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div className="py-10">
      <h1 className="text">
        DOMINATE THE GAME<span>CONQUER THE ARENA</span>
      </h1>
      <h1 className="text">
        UNITE THE CLANS<span>FORGE ALLIANCES</span>
      </h1>
      <h1 className="text">
        CHALLENGE THE BEST<span>CRUSH THE RIVALS</span>
      </h1>
      <h1 className="text">
        ACHIEVE GLORY
        <span>CLAIN THE CROWN</span>
      </h1>
      <h1 className="text">
        RISE TO VICTORY
        <span>DEFEND THE THRONE</span>
      </h1>
    </div>
  );
};

export default textEffects;
