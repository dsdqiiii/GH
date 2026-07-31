"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/core/button";

interface HeroProps {
  images: string[];
}

export default function Hero({ images }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt="Guest House Andalusia"
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1200ms] ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          Guest House Andalusia
        </h1>

        <p className="text-base sm:text-lg md:text-xl mb-8 drop-shadow-lg max-w-2xl">
          Where comfort meets spirituality in the heart of Jakarta
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Button href="/guesthouse" variant="brand" className="text-sm sm:text-base">
            Lihat Guesthouse
          </Button>
        </div>
      </div>
    </section>
  );
}