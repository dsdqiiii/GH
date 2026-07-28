import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md";
}

export function Badge({ className = "", size = "md", children, ...props }: BadgeProps) {
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2 text-sm";

  return (
    <span
      className={`rounded-full border border-sand bg-surface text-forest ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}