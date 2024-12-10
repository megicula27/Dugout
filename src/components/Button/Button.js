import React from "react";
import Link from "next/link";
import "@/styles/button.css";
const Button = ({ text, onClick }) => {
  return (
    <div className="btn" onClick={onClick}>
      {text}
    </div>
  );
};

export default Button;
