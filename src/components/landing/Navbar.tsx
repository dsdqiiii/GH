"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

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

    </nav>
  );
}