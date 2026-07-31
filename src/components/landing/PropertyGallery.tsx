"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
=======
import Image from "next/image";
>>>>>>> upstream/main

interface PropertyGalleryProps {
  images: string[];
  alt: string;
}

export default function PropertyGallery({ images, alt }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div
        className="rounded-2xl overflow-hidden bg-gray-200"
        style={{ aspectRatio: "16/9" }}
      />
    );
  }

  return (
    <>
      {/* Hero slideshow */}
<<<<<<< HEAD
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
=======
      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {images.map((img, i) => (
          <Image
            key={img}
            src={img}
            alt={`${alt} ${i + 1}`}
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="(max-width: 768px) 100vw, 1024px"
            className={`object-cover transition-opacity duration-[1200ms] ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
>>>>>>> upstream/main
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
<<<<<<< HEAD
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
=======
              key={img}
              onClick={() => setCurrentIndex(i)}
              className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all"
>>>>>>> upstream/main
              style={{
                width: "88px",
                height: "66px",
                border: i === currentIndex ? "2px solid #B5654A" : "2px solid transparent",
                opacity: i === currentIndex ? 1 : 0.6,
              }}
            >
<<<<<<< HEAD
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
=======
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="88px"
                className="object-cover"
              />
>>>>>>> upstream/main
            </button>
          ))}
        </div>
      )}
    </>
  );
}