"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { hexToHSL } from "@/lib/utils/color";

interface PrimaryColorContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(undefined);

export function PrimaryColorProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6"); // Default violet

  useEffect(() => {
    const savedColor = localStorage.getItem("xylos-primary-color");
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("xylos-primary-color", primaryColor);
    const hsl = hexToHSL(primaryColor);
    document.documentElement.style.setProperty("--primary", hsl);
    
    // Also update accent color lightly based on primary
    // Add light version for accent if needed, otherwise use primary
    document.documentElement.style.setProperty("--ring", hsl);
  }, [primaryColor]);

  return (
    <PrimaryColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </PrimaryColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(PrimaryColorContext);
  if (context === undefined) {
    throw new Error("usePrimaryColor must be used within a PrimaryColorProvider");
  }
  return context;
}
