"use client";

import { Button } from "@/components/ui/core/button";

export function BookingActionButtons() {
  return (
    <div className="space-y-2.5 pt-2 border-t border-neutral-100">
      <Button
        variant="primary"
        disabled
        className="w-full text-sm py-2.5 rounded-xl"
        onClick={() => alert("Selesai diklik (Dummy)")}
      >
        Selesai
      </Button>

      <Button
        variant="danger"
        className="w-full text-sm py-2.5 rounded-xl"
        onClick={() => alert("Batalkan diklik (Dummy)")}
      >
        Batalkan
      </Button>

      <Button
        variant="ghost"
        className="w-full text-sm py-2.5 rounded-xl"
        onClick={() => alert("Cek Bukti Bayar diklik (Dummy)")}
      >
        Cek Bukti Bayar
      </Button>
    </div>
  );
}