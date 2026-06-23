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
      className="text-grey-600 hover:text-grey-700 hover:bg-grey-800 flex items-center gap-2 rounded-xl"
    >
      <ArrowLeft size={20}/>
    </Button>
  );
}