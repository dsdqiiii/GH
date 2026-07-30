"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/core/button";
import { FLOOR } from "@/lib/constants/floor"; // sesuaikan path import sesuai lokasi file constants Anda

interface PropertyOption {
  id: string;
  slug: string;
  name: string;
}

interface PickRangeProps {
  mode?: "global" | "property";
  properties?: PropertyOption[];
}

export default function PickRange({
  mode = "property",
  properties = [],
}: PickRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const currentSlug = (params?.slug as string) || properties[0]?.slug || "";

  // State
  const [selectedSlug, setSelectedSlug] = useState<string>(currentSlug);
  const [bookingType, setBookingType] = useState<"inap" | "transit">(
    (searchParams.get("type") as "inap" | "transit") || "inap"
  );

  // State untuk Mode Inap
  const [checkIn, setCheckIn] = useState(searchParams.get("checkin") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkout") || "");

  // State untuk Mode Transit
  const [transitDate, setTransitDate] = useState(
    searchParams.get("transitDate") || searchParams.get("checkin")?.split("T")[0] || ""
  );
  const [checkInTime, setCheckInTime] = useState(
    searchParams.get("time") || "10:00"
  );
  const [durationHours, setDurationHours] = useState(
    searchParams.get("duration") || "3"
  );

  const [adult, setAdult] = useState(searchParams.get("adult") || "1");
  const [floor, setFloor] = useState(searchParams.get("floor") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const query = new URLSearchParams();
    query.set("type", bookingType);
    if (adult) query.set("adult", adult);
    if (floor) query.set("floor", floor);

    if (bookingType === "inap") {
      if (checkIn) query.set("checkin", checkIn);
      if (checkOut) query.set("checkout", checkOut);
    } else {
      if (transitDate) {
        query.set("checkin", `${transitDate}T${checkInTime}`);
        query.set("transitDate", transitDate);
      }
      query.set("time", checkInTime);
      query.set("duration", durationHours);
    }

    const targetSlug = mode === "global" ? selectedSlug : currentSlug;
    if (!targetSlug) return;

    router.push(`/guesthouse/${targetSlug}?${query.toString()}`);
  }

  // Utility class agar tinggi seluruh field seragam (h-11 = 44px)
  const inputBaseClass =
    "w-full h-11 border border-sand rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-forest text-ink";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface p-5 sm:p-6 rounded-2xl border border-sand/60 shadow-sm space-y-4 text-ink"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base sm:text-lg text-forest">
          {mode === "global" ? "Cari Guest House" : "Cari Ketersediaan Kamar"}
        </h3>

        {/* Toggle Mode Inap / Transit */}
        <div className="flex bg-sand/30 p-1 rounded-lg gap-1">
          <Button
            type="button"
            variant={bookingType === "inap" ? "brand" : "ghost"}
            onClick={() => setBookingType("inap")}
            className="text-xs px-3 py-1.5 h-auto"
          >
            Inap
          </Button>
          <Button
            type="button"
            variant={bookingType === "transit" ? "brand" : "ghost"}
            onClick={() => setBookingType("transit")}
            className="text-xs px-3 py-1.5 h-auto"
          >
            Transit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* INPUT PROPERTI (Hanya di mode global) */}
        {mode === "global" && (
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-medium text-taupe mb-1">
              Pilih Guest House
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className={inputBaseClass}
            >
              {properties.map((prop) => (
                <option key={prop.id} value={prop.slug}>
                  {prop.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* INPUT KONDISIONAL BERDASARKAN TIPE BOOKING */}
        {bookingType === "inap" ? (
          <>
            <div>
              <label className="block text-xs font-medium text-taupe mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-taupe mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs font-medium text-taupe mb-1">
                Tanggal Transit
              </label>
              <input
                type="date"
                value={transitDate}
                onChange={(e) => setTransitDate(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-taupe mb-1">
                Waktu Masuk
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-taupe mb-1">
                Durasi (Jam)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className={inputBaseClass}
              />
            </div>
          </>
        )}

        {/* Jumlah Tamu */}
        <div>
          <label className="block text-xs font-medium text-taupe mb-1">
            Tamu (Dewasa)
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={adult}
            onChange={(e) => setAdult(e.target.value)}
            className={inputBaseClass}
          />
        </div>

        {/* Filter Lantai dari FLOOR Constant */}
        <div>
          <label className="block text-xs font-medium text-taupe mb-1">
            Lantai
          </label>
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className={inputBaseClass}
          >
            <option value="">Semua Lantai</option>
            {FLOOR.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" variant="brand" className="w-full h-11 mt-2 text-sm font-medium">
        Cari Kamar
      </Button>
    </form>
  );
}