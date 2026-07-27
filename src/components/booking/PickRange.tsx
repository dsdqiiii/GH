"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FLOOR } from "@/lib/constants/floor";

const ALL_FLOOR = "Semua Lantai";
type FloorOption = typeof ALL_FLOOR | (typeof FLOOR)[number];

interface PickRangeProps {
  onSearch?: (params: {
    checkin: string;
    checkout: string;
    adult: number;
    floor: FloorOption;
  }) => void;
}

/**
 * PickRange
 * Dummy component untuk pencarian range tanggal (check-in/check-out) + jumlah tamu (adult) + filter lantai.
 * Belum ada validasi availability nyata — hanya mengelola state form & sinkronisasi ke URL query params.
 *
 * TODO (next iteration):
 * - Ganti native <input type="date"> dengan custom calendar (biar bisa highlight tanggal penuh/booked)
 * - Disable tanggal yang sudah lewat (min = today)
 * - Loading state saat submit (menunggu hasil filter unit)
 */
export default function PickRange({ onSearch }: PickRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checkin, setCheckin] = useState(searchParams.get("checkin") ?? "");
  const [checkout, setCheckout] = useState(searchParams.get("checkout") ?? "");
  const [adult, setAdult] = useState(
    Number(searchParams.get("adult")) || 2 // default 2 pax
  );
  const [floor, setFloor] = useState<FloorOption>(
    (searchParams.get("floor") as FloorOption) ?? ALL_FLOOR
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!checkin || !checkout) {
      setError("Tanggal check-in dan check-out wajib diisi");
      return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
      setError("Tanggal check-out harus setelah check-in");
      return;
    }

    if (adult < 1) {
      setError("Jumlah tamu minimal 1");
      return;
    }

    // Sinkronisasi ke URL query params
    const params = new URLSearchParams(searchParams.toString());
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("adult", String(adult));
    if (floor === ALL_FLOOR) {
      params.delete("floor");
    } else {
      params.set("floor", floor);
    }

    router.push(`${pathname}?${params.toString()}`);

    // Callback opsional, kalau parent mau handle langsung tanpa reload dari URL
    onSearch?.({ checkin, checkout, adult, floor });
  }

  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "rounded-lg px-3 py-2 text-sm border outline-none transition-colors focus:ring-2 focus:ring-offset-0";

  const fieldStyle = {
    borderColor: "#CFC2B2",
    color: "#2C2420",
    backgroundColor: "#FFFFFF",
    "--tw-ring-color": "#B5654A",
  } as React.CSSProperties;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "#FBF9F4",
        border: "1px solid #CFC2B2",
        boxShadow: "0 2px 12px rgba(31,59,54,0.08)",
      }}
    >
      <h2 className="text-base font-semibold mb-3" style={{ color: "#1F3B36" }}>
        Cari range yang tersedia dulu, yuk!
      </h2>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col md:flex-row gap-3 md:items-end"
      >
        <div className="flex flex-col gap-1 flex-1">
          <label
            htmlFor="checkin"
            className="text-xs font-medium"
            style={{ color: "#6B5D4F" }}
          >
            Check-in
          </label>
          <input
            id="checkin"
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            className={inputClass}
            style={fieldStyle}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label
            htmlFor="checkout"
            className="text-xs font-medium"
            style={{ color: "#6B5D4F" }}
          >
            Check-out
          </label>
          <input
            id="checkout"
            type="date"
            min={checkin || today}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            className={inputClass}
            style={fieldStyle}
          />
        </div>

        <div className="flex flex-col gap-1 w-full md:w-32">
          <label
            htmlFor="adult"
            className="text-xs font-medium"
            style={{ color: "#6B5D4F" }}
          >
            Tamu (dewasa)
          </label>
          <input
            id="adult"
            type="number"
            min={1}
            value={adult}
            onChange={(e) => setAdult(Number(e.target.value))}
            className={inputClass}
            style={fieldStyle}
          />
        </div>

        {/* Filter lantai — opsi ALL + daftar lantai dari constants */}
        <div className="flex flex-col gap-1 w-full md:w-36">
          <label
            htmlFor="floor"
            className="text-xs font-medium"
            style={{ color: "#6B5D4F" }}
          >
            Lantai
          </label>
          <select
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value as FloorOption)}
            className={inputClass}
            style={fieldStyle}
          >
            <option value={ALL_FLOOR}>{ALL_FLOOR}</option>
            {FLOOR.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: "#B5654A", color: "#FBF9F4" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#9C5540")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#B5654A")
          }
        >
          Cari Kamar
        </button>

        {error && (
          <p
            className="text-xs md:absolute md:-bottom-6"
            style={{ color: "#B5654A" }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}