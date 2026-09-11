"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  maxDistance?: number;
  className?: string;
  debug?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.4,
  maxDistance = 40,
  className,
  debug = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // Calcula respecto al contenedor estático para evitar vibraciones.
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = (e.clientX - centerX) * strength;
    let y = (e.clientY - centerY) * strength;

    const distance = Math.hypot(x, y);
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      x *= scale;
      y *= scale;
    }

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const hasMoved = position.x !== 0 || position.y !== 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center justify-center relative select-none",
        debug && "rounded-xl border border-dashed border-blue-400/40 p-1",
        className
      )}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.1 }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
};
