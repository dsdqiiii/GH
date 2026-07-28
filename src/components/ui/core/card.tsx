import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "elevated";
}

export function Card({
  className = "",
  variant = "flat",
  ...props
}: CardProps) {
  const variantClass =
    variant === "elevated"
      ? "bg-surface border-sand shadow-[0_2px_12px_rgba(31,59,54,0.08)]"
      : "";

  return (
    <div
      className={`rounded-lg border p-4 ${variantClass} ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />;
}

export function CardTitle({
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-semibold text-forest ${className}`} {...props} />;
}

export function CardContent({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}