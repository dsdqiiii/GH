"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import BookingCalendar from "./BookingCalendar";
import type { BookingFormProps, FormState, FormErrors, BookingType } from "@/lib/types/booking.types";
import {
  initialBookingState,
  calculateNights,
  calculateRoomSubtotal,
  calculateAddonSubtotal,
  validateBookingForm,
} from "@/utils/booking.utils";

export default function BookingForm({
  unitId,
  unitName,
  pricePerNight,
  pricePerHour,
  isTransitEnabled,
  addons,
  isLoggedIn = false,
  bookedDates = [], // Opsional: passing tanggal terisi dari database/API
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initialBookingState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // Handle Klik Tanggal di Kalender
  function handleDateSelect(selectedDate: Date) {
    if (form.bookingType === "transit") {
      updateField("transitDate", selectedDate);
      return;
    }

    // Untuk Booking Inap (Range Selection)
    if (!form.checkInDate || (form.checkInDate && form.checkOutDate)) {
      setForm((prev) => ({
        ...prev,
        checkInDate: selectedDate,
        checkOutDate: null,
      }));
    } else if (selectedDate > form.checkInDate) {
      setForm((prev) => ({
        ...prev,
        checkOutDate: selectedDate,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        checkInDate: selectedDate,
        checkOutDate: null,
      }));
    }
  }

  const nights = calculateNights(form.checkInDate, form.checkOutDate);
  const roomSubtotal = calculateRoomSubtotal(form, pricePerNight, pricePerHour);
  const addonSubtotal = calculateAddonSubtotal(form, addons);
  const total = roomSubtotal + addonSubtotal;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateBookingForm(form, isLoggedIn);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    const payload = {
      unitId,
      bookingType: form.bookingType,
      dates:
        form.bookingType === "inap"
          ? {
              checkIn: form.checkInDate,
              checkOut: form.checkOutDate,
              nights,
            }
          : {
              date: form.transitDate,
              hours: form.hours,
            },
      totalGuest: form.totalGuest,
      guest: isLoggedIn
        ? null
        : {
            name: form.guestName,
            phone: form.guestPhone,
            email: form.guestEmail || null,
          },
      addons: Object.entries(form.selectedAddons).map(
        ([propertyAddonId, quantity]) => ({
          propertyAddonId,
          quantity,
        })
      ),
      subtotal: { room: roomSubtotal, addons: addonSubtotal },
      total,
    };

    console.log("Booking payload:", payload);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
  }

  const bookingTypes: BookingType[] = isTransitEnabled
    ? ["inap", "transit"]
    : ["inap"];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: "#FBF9F4",
        boxShadow: "0 2px 12px rgba(31,59,54,0.08)",
      }}
    >
      <div>
        <h3 className="text-lg font-semibold" style={{ color: "#1F3B36" }}>
          Booking {unitName}
        </h3>
        <p className="text-sm" style={{ color: "#6B5D4F" }}>
          Pilih tanggal dan isi detail pemesanan
        </p>
      </div>

      {bookingTypes.length > 1 && (
        <div className="flex gap-3">
          {bookingTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField("bookingType", type)}
              className={`flex-1 border rounded-lg py-2 capitalize font-medium ${
                form.bookingType === type
                  ? "bg-emerald-900 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Component Calendar */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {form.bookingType === "inap"
            ? "Pilih Tanggal Menginap"
            : "Pilih Tanggal Transit"}
        </label>
        <BookingCalendar
          checkIn={form.bookingType === "inap" ? form.checkInDate : form.transitDate}
          checkOut={form.checkOutDate}
          bookedDates={bookedDates}
          onSelectDate={handleDateSelect}
        />
        {errors.dates && (
          <p className="text-xs text-red-500 mt-1">{errors.dates}</p>
        )}
      </div>

      {/* Ringkasan Durasi */}
      {form.bookingType === "inap" && nights > 0 && (
        <div className="text-xs bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-200">
          Menginap selama <strong>{nights} malam</strong>
        </div>
      )}

      {form.bookingType === "transit" && (
        <div>
          <label className="text-sm">Lama Transit (Jam)</label>
          <input
            type="number"
            min={1}
            value={form.hours}
            onChange={(e) => updateField("hours", Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>
      )}

      <div>
        <label className="text-sm">Jumlah Tamu</label>
        <input
          type="number"
          min={1}
          value={form.totalGuest}
          onChange={(e) => updateField("totalGuest", Number(e.target.value))}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        />
        {errors.totalGuest && (
          <p className="text-xs text-red-500 mt-1">{errors.totalGuest}</p>
        )}
      </div>

      {!isLoggedIn && (
        <div className="flex flex-col gap-3 border-t pt-3">
          <div>
            <input
              placeholder="Nama lengkap"
              value={form.guestName}
              onChange={(e) => updateField("guestName", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.guestName && (
              <p className="text-xs text-red-500 mt-1">{errors.guestName}</p>
            )}
          </div>

          <div>
            <input
              placeholder="WhatsApp"
              value={form.guestPhone}
              onChange={(e) => updateField("guestPhone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.guestPhone && (
              <p className="text-xs text-red-500 mt-1">{errors.guestPhone}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              value={form.guestEmail}
              onChange={(e) => updateField("guestEmail", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.guestEmail && (
              <p className="text-xs text-red-500 mt-1">{errors.guestEmail}</p>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-3 space-y-1">
        <p className="text-sm text-gray-600">
          Kamar: Rp {roomSubtotal.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-gray-600">
          Tambahan: Rp {addonSubtotal.toLocaleString("id-ID")}
        </p>
        <p className="font-semibold text-xl text-gray-900 pt-1">
          Total: Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Memproses..." : "Lanjutkan Booking"}
      </Button>
    </form>
  );
}