import React from "react";
import "@/styles/Glitch.css";
import Link from "next/link";
const Glitch = ({ text, link }) => {
  return (
    <Link href={link || "/"} glitch={text} style={{ color: "#52fe6f" }}>
      {text}
    </Link>
  );
};

export default Glitch;
