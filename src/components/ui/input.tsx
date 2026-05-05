import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-widest text-espresso/60">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-12 w-full border-b border-espresso/10 bg-transparent px-0 py-2",
          "text-lg placeholder:text-espresso/20 focus:border-crimson transition-colors",
          error && "border-crimson",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-crimson">{error}</p>}
    </div>
  );
}
