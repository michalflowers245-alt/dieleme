import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-8 h-8", className)}
      {...props}
    >
      {/* Central Axis / Body - Symbolizing connection between earth and sky */}
      <path d="M12 21V5" className="opacity-80" />
      
      {/* Upper Wings / Petals - Symbolizing ascension and peace */}
      <path d="M12 5C16 1 21 4 18 10L12 15" />
      <path d="M12 5C8 1 3 4 6 10L12 15" />
      
      {/* Lower Leaves / Base - Symbolizing grounding and support */}
      <path d="M12 15C15 18 18 17 18 14" className="opacity-80" />
      <path d="M12 15C9 18 6 17 6 14" className="opacity-80" />
      
      {/* Halo / Aura (Optional subtle detail) */}
      <circle cx="12" cy="5" r="1" fill="currentColor" className="opacity-60" />
    </svg>
  );
};
