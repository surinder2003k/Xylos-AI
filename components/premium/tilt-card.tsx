"use client";

import React, { useRef, useState, useEffect } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  degree?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = "", 
  degree = 8 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 768px) or (pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setStyle({
      transform: `perspective(1200px) rotateX(${-y * degree}deg) rotateY(${x * degree}deg)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1200px) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 0.5s ease-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative rounded-[2rem] overflow-hidden ${className} will-change-transform`}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
