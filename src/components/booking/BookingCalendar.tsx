"use client";

import { useState } from "react";
import { formatDateKey } from "@/utils/booking.utils";

interface BookingCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  bookedDates?: string[]; // array string "YYYY-MM-DD"
  onSelectDate: (date: Date) => void;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function BookingCalendar({
  checkIn,
  checkOut,
  bookedDates = [],
  onSelectDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  const daysGrid = [];
  // Slot kosong sebelum tanggal 1
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  // Tanggal 1 sampai akhir bulan
  for (let day = 1; day <= daysInMonth; day++) {
    daysGrid.push(new Date(year, month, day));
  }

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      {/* Header Bulan */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 px-3 border rounded-lg hover:bg-gray-100 text-sm"
        >
          &lt;
        </button>
        <span className="font-semibold text-sm">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 px-3 border rounded-lg hover:bg-gray-100 text-sm"
        >
          &gt;
        </button>
      </div>

      {/* Header Hari */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-2">
        <span>Min</span>
        <span>Sen</span>
        <span>Sel</span>
        <span>Rab</span>
        <span>Kam</span>
        <span>Jum</span>
        <span>Sab</span>
      </div>

      {/* Grid Tanggal */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {daysGrid.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} />;
          }

          const dateStr = formatDateKey(date);
          const isBooked = bookedDates.includes(dateStr);
          const isPast = date < today;
          const isDisabled = isBooked || isPast;

          const isCheckIn = checkIn && formatDateKey(checkIn) === dateStr;
          const isCheckOut = checkOut && formatDateKey(checkOut) === dateStr;
          const isInRange =
            checkIn &&
            checkOut &&
            date > checkIn &&
            date < checkOut;

          let btnStyles = "hover:bg-emerald-50 text-gray-700";

          if (isDisabled) {
            btnStyles = "bg-gray-100 text-gray-300 cursor-not-allowed line-through";
          } else if (isCheckIn || isCheckOut) {
            btnStyles = "bg-emerald-800 text-white font-bold rounded-lg";
          } else if (isInRange) {
            btnStyles = "bg-emerald-100 text-emerald-900";
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(date)}
              className={`h-9 w-full flex items-center justify-center rounded-md transition text-xs ${btnStyles}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Keterangan Status */}
      <div className="flex gap-4 text-xs text-gray-500 mt-4 justify-center border-t pt-3">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-emerald-800 rounded-sm"></span> Dipilih
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 rounded-sm"></span> Penuh/Lewat
        </div>
      </div>
    </div>
  );
}