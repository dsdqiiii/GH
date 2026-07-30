"use client";

import { formatDate, formatDateTime } from "@/utils/formatter.utils";

interface BookingTimelineProps {
  status: string;
  createdAt: string;
  checkIn: string | null;
  checkOut: string | null;
  checkedIn: string | null | undefined;
  checkedOut: string | null | undefined;
}

export function BookingTimeline({
  status,
  createdAt,
  checkIn,
  checkOut,
  checkedIn,
  checkedOut,
}: BookingTimelineProps) {
  // Flag penanda status
  const isCanceled = status === "CANCELED";
  const isCreated = true; // Karena data booking sudah dibuat
  const isCheckedIn = Boolean(checkedIn) || status === "CHECKED_IN";
  const isCheckedOut = Boolean(checkedOut) || status === "CHECKED_OUT";
  const isCompleted = status === "COMPLETED";

  if (isCanceled) {
    return (
      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium text-center">
        Pesanan ini telah dibatalkan (Canceled)
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between w-full px-2 pt-2">
      {/* Garis Latar / Connecting Line */}
      <div className="absolute left-8 right-8 top-5 h-0.5 bg-neutral-200 -z-0" />

      {/* Step 1: Booking Created */}
      <div className="relative z-10 flex flex-col items-center bg-white px-2 text-center">
        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
          ✓
        </div>
        <span className="text-xs font-medium text-neutral-800 mt-1.5">
          Booking Created
        </span>
        <span className="text-[10px] text-neutral-400">
          {formatDateTime(createdAt)}
        </span>
      </div>

      {/* Step 2: Checked In */}
      <div className="relative z-10 flex flex-col items-center bg-white px-2 text-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
            isCheckedIn || isCheckedOut || isCompleted
              ? "bg-emerald-600 text-white"
              : "bg-neutral-200 text-neutral-500"
          }`}
        >
          {isCheckedIn || isCheckedOut || isCompleted ? "✓" : "2"}
        </div>
        <span
          className={`text-xs font-medium mt-1.5 ${
            isCheckedIn || isCheckedOut || isCompleted
              ? "text-neutral-800"
              : "text-neutral-400"
          }`}
        >
          Checked In
        </span>
        <span className="text-[10px] text-neutral-400">
          {checkedIn ? formatDateTime(checkedIn) : "-"}
        </span>
      </div>

      {/* Step 3: Checked Out */}
      <div className="relative z-10 flex flex-col items-center bg-white px-2 text-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
            isCheckedOut || isCompleted
              ? "bg-emerald-600 text-white"
              : "bg-neutral-200 text-neutral-500"
          }`}
        >
          {isCheckedOut || isCompleted ? "✓" : "3"}
        </div>
        <span
          className={`text-xs font-medium mt-1.5 ${
            isCheckedOut || isCompleted
              ? "text-neutral-800"
              : "text-neutral-400"
          }`}
        >
          Checked Out
        </span>
        <span className="text-[10px] text-neutral-400">
          {checkedOut ? formatDateTime(checkedOut) : "-"}
        </span>
      </div>

      {/* Step 4: Completed */}
      <div className="relative z-10 flex flex-col items-center bg-white px-2 text-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
            isCompleted
              ? "bg-emerald-600 text-white"
              : "bg-neutral-200 text-neutral-500"
          }`}
        >
          {isCompleted ? "✓" : "4"}
        </div>
        <span
          className={`text-xs font-medium mt-1.5 ${
            isCompleted ? "text-neutral-800" : "text-neutral-400"
          }`}
        >
          Completed
        </span>
        <span className="text-[10px] text-neutral-400">
          {isCompleted ? "Selesai" : "-"}
        </span>
      </div>
    </div>
  );
}