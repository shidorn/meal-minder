"use client";
import React, { useState } from "react";

interface ButtonProps {
  title: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const buttonStyle: React.CSSProperties = {
    backgroundColor: hovered ? "#BF2121" : "#941E1E",
    color: "white",
    padding: "12px 24px",
    marginBottom: "10px",
    textAlign: "center",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "inline-block",
    transition: "background-color 0.3s ease",
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return React.createElement(
    "div",
    {
      style: buttonStyle,
      onClick: onClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    title
  );
};

export default Button;
