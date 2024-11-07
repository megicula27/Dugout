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
    <div className="container">
      <h1 className="text">
        TEXT EFFECT<span>WOAH</span>
      </h1>
      <h1 className="text">
        GSAP<span>AND CLIPPING</span>
      </h1>
      <h1 className="text">
        CRAZYYY<span>CRAZYYY</span>
      </h1>
      <h1 className="text">
        HOVER ON ME
        <span>
          <a
            href="https://stacksorted.com/text-effects/minh-pham"
            target="_blank"
            rel="noreferrer"
          >
            SOURCE
          </a>
        </span>
      </h1>
      <h1 className="text">
        LIKE THIS?
        <span>
          <a
            href="https://twitter.com/juxtopposed"
            target="_blank"
            rel="noreferrer"
          >
            LET'S CONNECT
          </a>
        </span>
      </h1>
    </div>
  );
};

export default textEffects;
