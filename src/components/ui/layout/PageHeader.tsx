import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/navigation/BackButton";

interface PageHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  size?: "lg" | "xl";
  className?: string;
}

export function PageHeader({
  title,
  eyebrow,
  size = "xl",
  className = "",
}: PageHeaderProps) {
  const titleSize =
    size === "xl" ? "text-4xl lg:text-5xl" : "text-4xl md:text-5xl";

  return (
    <div className={className}>
      {eyebrow && (
        <p
          className="text-xs uppercase tracking-widest mb-2 text-terracotta"
          style={{ letterSpacing: "0.12em" }}
        >
          {eyebrow}
        </p>
      )}

      <div className="flex items-center gap-5">
        {size === "xl" && <BackButton />}
        <h1 className={`${titleSize} font-semibold text-forest`}>{title}</h1>
      </div>
    </div>
  );
}