import React from "react";
import { cn } from "./input";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = "primary", 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-crimson text-cream hover:bg-crimson/90",
    secondary: "bg-forest text-cream hover:bg-forest/90",
    ghost: "bg-transparent text-espresso hover:bg-espresso/5",
  };

  return (
    <button
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold tracking-wide transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
      ) : (
        children
      )}
    </button>
  );
}
