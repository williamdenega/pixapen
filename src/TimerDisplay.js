import React, { useState, useEffect } from "react";

const TimerDisplay = ({ remainingTime, cursorPosition, isDrawingAllowed }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const timerStyle = {
    position: isMobile ? "fixed" : "absolute",
    top: isMobile ? "20%" : cursorPosition.y + 10,
    left: isMobile ? "50%" : cursorPosition.x + 10,
    transform: isMobile ? "translateX(-50%)" : "none",
    backgroundColor: "white",
    padding: "5px 10px",
    border: "2px solid black",
    borderRadius: "5px",
    fontSize: "1.5rem",
    fontFamily: "Luckiest Guy, Pixelify Sans",
    pointerEvents: "none",
    zIndex: 1000, // Ensure the timer is above other content
  };

  return (
    isDrawingAllowed && (
      <div style={timerStyle}>Time Remaing: {remainingTime}</div>
    )
  );
};

export default TimerDisplay;
