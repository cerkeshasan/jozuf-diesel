"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "whatsapp" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variants = {
      primary: "bg-[#C0202A] text-white hover:bg-[#a81b23] focus:ring-[#C0202A]",
      secondary: "bg-[#0D1B2A] text-white hover:bg-[#1a2f45] focus:ring-[#0D1B2A]",
      whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5a] focus:ring-[#25D366]",
      outline: "border-2 border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white focus:ring-[#0D1B2A]",
      ghost: "text-[#0D1B2A] hover:bg-gray-100 focus:ring-gray-200",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
