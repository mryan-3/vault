import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer V shape */}
      <path
        d="M20 25L50 75L80 25"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stylized lock handle / circle on the right arm */}
      <circle
        cx="72"
        cy="35"
        r="10"
        fill="currentColor"
      />
      <rect
        x="62"
        y="33"
        width="20"
        height="4"
        rx="2"
        fill="currentColor"
      />
    </svg>
  );
}
