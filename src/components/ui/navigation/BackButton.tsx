"use client";

import { useRouter } from "next/navigation";
import { Button } from "../core/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className="flex items-center gap-2 rounded-xl transition-colors"
      style={
        {
          color: "#1F3B36",
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#dec18a";
        e.currentTarget.style.color = "#B5654A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#F8F4EC";
        e.currentTarget.style.color = "#1F3B36";
      }}
    >
      <ArrowLeft size={20} />
    </Button>
  );
}