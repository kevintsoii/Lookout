import React, { useState, useEffect } from "react";
import "./Eye.css"; // Import the styles

const Eye = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = (eye) => {
    const eyeRect = eye.getBoundingClientRect();
    const eyeX = eyeRect.left + eyeRect.width / 2;
    const eyeY = eyeRect.top + eyeRect.height / 2;
    const deltaX = mousePosition.x - eyeX;
    const deltaY = mousePosition.y - eyeY;
    const angle = Math.atan2(deltaY, deltaX);
    const maxDistanceX = 25; // Limit the pupil movement
    const maxDistanceY = 45;
    const distanceX = Math.min(
      maxDistanceX,
      Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    );
    const distanceY = Math.min(
      maxDistanceY,
      Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    );
    const pupilX = distanceX * Math.cos(angle);
    const pupilY = distanceY * Math.sin(angle);
    return { x: pupilX, y: pupilY };
  };

  return (
    <div className="flex flex-row justify-center items-center gap-4 ">
      <div className="eye-container">
        <div
          className="eye"
          ref={(eyeRef) => {
            if (eyeRef) {
              const { x, y } = calculatePupilPosition(eyeRef);
              eyeRef.querySelector(
                ".pupil"
              ).style.transform = `translate(${x}px, ${y}px)`;
            }
          }}
        >
          <div className="pupil"></div>
        </div>
      </div>
      <div className="eye-container">
        <div
          className="eye"
          ref={(eyeRef) => {
            if (eyeRef) {
              const { x, y } = calculatePupilPosition(eyeRef);
              eyeRef.querySelector(
                ".pupil"
              ).style.transform = `translate(${x}px, ${y}px)`;
            }
          }}
        >
          <div className="pupil"></div>
        </div>
      </div>
    </div>
  );
};

export default Eye;
