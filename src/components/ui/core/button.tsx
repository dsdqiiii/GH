// components/ui/core/button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "brand";
  isLoading?: boolean;
  href?: string;
}

const baseStyles =
  "px-6 py-3 rounded-2xl font-medium transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100",
  secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 shadow-none",
  brand: "bg-terracotta hover:bg-terracotta-dark text-surface shadow-sm",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  href,
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="opacity-70">Memproses...</span> : children}
    </button>
  );
}