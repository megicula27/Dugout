import React from "react";
import Link from "next/link";
import "@/styles/button.css";
const Button = ({ text, link }) => {
  return (
    <Link href={link} className="btn">
      {text}
    </Link>
  );
};

export default Button;
