"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

<<<<<<< HEAD
export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // === SCROLL LISTENER === //
=======
export default function Navbar({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);


>>>>>>> upstream/main
  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
<<<<<<< HEAD
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
=======

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [transparent]);


  const solid = !transparent || scrolled;


  return (
    <nav
      className="
        fixed
        top-0
        w-full
        z-50
        transition-all
        duration-300
      "
      style={{
        backgroundColor: solid
          ? "#FBF9F4"
          : "transparent",

        boxShadow: solid
          ? "0 4px 20px rgba(31,59,54,.08)"
          : "none",

        color: solid
          ? "#1F3B36"
          : "#FBF9F4",
      }}
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-5
          flex
          justify-between
          items-center
        "
      >

        {/* Logo */}
        <Link
          href="/"
          className="
            font-semibold
            text-xl
            tracking-wide
          "
        >
          Guest House Andalusia
        </Link>


        {/* Desktop */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-8
            text-sm
            font-medium
          "
        >

          <Link
            href="/tentang"
            className="transition-opacity hover:opacity-70"
          >
            About Us
          </Link>


          <Link
            href="/kontak"
            className="transition-opacity hover:opacity-70"
          >
            Contact Us
          </Link>

        </div>


        {/* Mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Menu"
        >
          {open ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>



      {/* Mobile */}
      {open && (

        <div
          className="
            md:hidden
            px-6
            py-5
            flex
            flex-col
            gap-4
          "
          style={{
            backgroundColor:"#FBF9F4",
            color:"#1F3B36",
            boxShadow:
              "0 8px 20px rgba(31,59,54,.08)",
          }}
        >

          <Link
            href="/tentang"
            onClick={() => setOpen(false)}
            className="text-sm"
          >
            About Us
          </Link>


          <Link
            href="/kontak"
            onClick={() => setOpen(false)}
            className="text-sm"
          >
            Contact Us
          </Link>

        </div>

      )}

>>>>>>> upstream/main
    </nav>
  );
}