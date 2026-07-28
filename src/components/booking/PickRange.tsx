"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FLOOR } from "@/lib/constants/floor";
import { Button } from "@/components/ui/core/button";

const ALL_FLOOR = "Semua Lantai";
type FloorOption = typeof ALL_FLOOR | (typeof FLOOR)[number];
type BookingMode = "inap" | "transit";

const MAX_TRANSIT_HOURS = 5;

interface PickRangeProps {
  onSearch?: (params: {
    checkin: string;
    checkout: string;
    adult: number;
    floor: FloorOption;
    type: BookingMode;
  }) => void;
}

export default function PickRange({ onSearch }: PickRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [mode, setMode] = useState<BookingMode>(
    (searchParams.get("type") as BookingMode) ?? "inap"
  );

  // Mode inap
  const [checkin, setCheckin] = useState(searchParams.get("checkin") ?? "");
  const [checkout, setCheckout] = useState(searchParams.get("checkout") ?? "");

  // Mode transit
  const [transitDate, setTransitDate] = useState("");
  const [transitStartTime, setTransitStartTime] = useState("14:00");
  const [transitHours, setTransitHours] = useState(2);

  const [adult, setAdult] = useState(
    Number(searchParams.get("adult")) || 2
  );
  const [floor, setFloor] = useState<FloorOption>(
    (searchParams.get("floor") as FloorOption) ?? ALL_FLOOR
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!Number.isFinite(adult) || adult < 1) {
      setError("Jumlah tamu minimal 1");
      return;
    }

    let finalCheckin: string;
    let finalCheckout: string;

    if (mode === "inap") {
      if (!checkin || !checkout) {
        setError("Tanggal check-in dan check-out wajib diisi");
        return;
      }
      if (new Date(checkout) <= new Date(checkin)) {
        setError("Tanggal check-out harus setelah check-in");
        return;
      }
      finalCheckin = new Date(checkin).toISOString();
      finalCheckout = new Date(checkout).toISOString();
    } else {
      if (!transitDate || !transitStartTime) {
        setError("Tanggal dan jam mulai transit wajib diisi");
        return;
      }
      if (!Number.isFinite(transitHours) || transitHours < 1 || transitHours > MAX_TRANSIT_HOURS) {
        setError(`Durasi transit 1-${MAX_TRANSIT_HOURS} jam`);
        return;
      }

      const start = new Date(`${transitDate}T${transitStartTime}`);
      const end = new Date(start.getTime() + transitHours * 60 * 60 * 1000);

      finalCheckin = start.toISOString();
      finalCheckout = end.toISOString();
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("type", mode);
    params.set("checkin", finalCheckin);
    params.set("checkout", finalCheckout);
    params.set("adult", String(adult));
    if (floor === ALL_FLOOR) {
      params.delete("floor");
    } else {
      params.set("floor", floor);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });

    onSearch?.({ checkin: finalCheckin, checkout: finalCheckout, adult, floor, type: mode });
  }

  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "rounded-lg px-3 py-2 text-sm border border-sand text-ink bg-white outline-none transition-colors focus:ring-2 focus:ring-terracotta focus:ring-offset-0";

  return (
    <div className="rounded-xl p-4 bg-surface border border-sand shadow-[0_2px_12px_rgba(31,59,54,0.08)]">
      <h2 className="text-base font-semibold mb-3 text-forest">
        Cari range yang tersedia dulu, yuk!
      </h2>

      {/* Toggle mode */}
      <div className="flex gap-2 mb-4">
        {(["inap", "transit"] as BookingMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              mode === m
                ? "bg-terracotta text-white"
                : "bg-white border border-sand text-taupe"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col md:flex-row gap-3 md:items-end"
      >
        {mode === "inap" ? (
          <>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="checkin" className="text-xs font-medium text-taupe">
                Check-in
              </label>
              <input
                id="checkin"
                type="date"
                min={today}
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="checkout" className="text-xs font-medium text-taupe">
                Check-out
              </label>
              <input
                id="checkout"
                type="date"
                min={checkin || today}
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="transitDate" className="text-xs font-medium text-taupe">
                Tanggal
              </label>
              <input
                id="transitDate"
                type="date"
                min={today}
                value={transitDate}
                onChange={(e) => setTransitDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:w-32">
              <label htmlFor="transitStartTime" className="text-xs font-medium text-taupe">
                Jam Mulai
              </label>
              <input
                id="transitStartTime"
                type="time"
                value={transitStartTime}
                onChange={(e) => setTransitStartTime(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1 w-full md:w-28">
              <label htmlFor="transitHours" className="text-xs font-medium text-taupe">
                Durasi (jam)
              </label>
              <input
                id="transitHours"
                type="number"
                min={1}
                max={MAX_TRANSIT_HOURS}
                value={Number.isFinite(transitHours) ? transitHours : ""}
                onChange={(e) => setTransitHours(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1 w-full md:w-32">
          <label htmlFor="adult" className="text-xs font-medium text-taupe">
            Tamu (dewasa)
          </label>
          <input
            id="adult"
            type="number"
            readOnly
            min={1}
            value={Number.isFinite(adult) ? adult : ""}
            onChange={(e) => setAdult(Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1 w-full md:w-36">
          <label htmlFor="floor" className="text-xs font-medium text-taupe">
            Lantai
          </label>
          <select
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value as FloorOption)}
            className={inputClass}
          >
            <option value={ALL_FLOOR}>{ALL_FLOOR}</option>
            {FLOOR.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="brand" isLoading={isPending} className="px-5 py-2 text-sm">
          Cari Kamar
        </Button>

        {error && (
          <p className="text-xs md:absolute md:-bottom-6 text-terracotta">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}