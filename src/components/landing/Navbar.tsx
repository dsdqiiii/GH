"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // === SCROLL LISTENER === //
  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  // === DINAMIS STYLE === //
  const activeStyle = transparent
    ? scrolled
      ? "bg-white shadow-md text-black"
      : "bg-transparent text-white"
    : "bg-white shadow-md text-black";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${activeStyle}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* === LOGO === */}
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl tracking-wide">
            Guest House Andalusia
          </span>
        </Link>

        {/* === DESKTOP MENU === */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/tentang" className="hover:opacity-70 transition">
            About Us
          </Link>
          <Link href="/kontak" className="hover:opacity-70 transition">
            Contact Us
          </Link>
        </div>

        {/* === MOBILE MENU TOGGLE === */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* === MOBILE MENU === */}
      {open && (
        <div
          className={`md:hidden px-4 pb-4 space-y-3 transition-all duration-300
            ${
              scrolled || !transparent
                ? "bg-white text-black shadow-md"
                : "bg-black/70 text-white backdrop-blur-sm py-4"
            }
          `}
        >
          <Link href="/tentang" onClick={() => setOpen(false)} className="block">
            About Us
          </Link>
          <Link href="/kontak" onClick={() => setOpen(false)} className="block">
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}