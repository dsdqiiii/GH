"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FLOOR } from "@/lib/constants/floor";
import { Button } from "@/components/ui/core/button";

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

export default function PickRange({ onSearch }: PickRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [checkin, setCheckin] = useState(searchParams.get("checkin") ?? "");
  const [checkout, setCheckout] = useState(searchParams.get("checkout") ?? "");
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

    if (!checkin || !checkout) {
      setError("Tanggal check-in dan check-out wajib diisi");
      return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
      setError("Tanggal check-out harus setelah check-in");
      return;
    }

    if (!Number.isFinite(adult) || adult < 1) {
      setError("Jumlah tamu minimal 1");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("checkin", checkin);
    params.set("checkout", checkout);
    params.set("adult", String(adult));
    if (floor === ALL_FLOOR) {
      params.delete("floor");
    } else {
      params.set("floor", floor);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });

    onSearch?.({ checkin, checkout, adult, floor });
  }

  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "rounded-lg px-3 py-2 text-sm border border-sand text-ink bg-white outline-none transition-colors focus:ring-2 focus:ring-terracotta focus:ring-offset-0";

  return (
    <div className="rounded-xl p-4 bg-surface border border-sand shadow-[0_2px_12px_rgba(31,59,54,0.08)]">
      <h2 className="text-base font-semibold mb-3 text-forest">
        Cari range yang tersedia dulu, yuk!
      </h2>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col md:flex-row gap-3 md:items-end"
      >
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

        <div className="flex flex-col gap-1 w-full md:w-32">
          <label htmlFor="adult" className="text-xs font-medium text-taupe">
            Tamu (dewasa)
          </label>
          <input
            id="adult"
            type="number"
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