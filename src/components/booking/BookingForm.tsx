"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import PickRange from "./PickRange";
import type { BookingFormProps, FormState, FormErrors, BookingPayload } from "@/lib/types/booking.types";
import {
  initialBookingState,
  calculateNights,
  calculateRoomSubtotal,
  calculateAddonSubtotal,
  validateBookingForm,
} from "@/utils/booking.utils";
import { createBooking } from "@/actions/bookings";

function formatDateDisplay(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingForm({
  unitId,
  unitName,
  pricePerNight,
  pricePerHour,
  isTransitEnabled,
  addons,
  isLoggedIn = false,
  checkIn,
  checkOut,
  bookingType,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initialBookingState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const nights = bookingType === "inap"
    ? calculateNights(new Date(checkIn), new Date(checkOut))
    : 0;

  const durationHours = bookingType === "transit"
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60))
    : 0;

  const roomSubtotal = calculateRoomSubtotal(
    bookingType,
    nights,
    durationHours,
    pricePerNight,
    pricePerHour
  );
  const addonSubtotal = calculateAddonSubtotal(form, addons, nights);
  const total = roomSubtotal + addonSubtotal;

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const validationErrors = validateBookingForm(form, isLoggedIn);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    const payload: BookingPayload = {
      unitId,
      bookingType,
      checkIn,
      checkOut,
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
    };

    const userId = undefined;

    const result = await createBooking(payload, userId);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
  }

  if (isEditingDate) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsEditingDate(false)}
          className="text-sm text-taupe mb-3 hover:text-forest transition-colors"
        >
          ← Batal, kembali ke ringkasan
        </button>
        <PickRange />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 flex flex-col gap-5 bg-surface shadow-[0_2px_12px_rgba(31,59,54,0.08)]"
    >
      <div>
        <h3 className="text-lg font-semibold text-forest">
          Booking {unitName}
        </h3>
        <p className="text-sm text-taupe">
          Lengkapi detail pemesanan di bawah ini
        </p>
      </div>

      {/* Ringkasan tanggal — read-only */}
      <div className="rounded-lg border border-sand bg-white p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-taupe mb-1">
            {bookingType === "inap" ? "Check-in — Check-out" : "Tanggal Transit"}
          </p>
          <p className="text-sm font-medium text-forest">
            {formatDateDisplay(checkIn)} → {formatDateDisplay(checkOut)}
          </p>
          {bookingType === "inap" && nights > 0 && (
            <p className="text-xs text-taupe mt-1">{nights} malam</p>
          )}
          {bookingType === "transit" && durationHours > 0 && (
            <p className="text-xs text-taupe mt-1">{durationHours} jam</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsEditingDate(true)}
          className="text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors whitespace-nowrap"
        >
          Ubah Tanggal
        </button>
      </div>

      <div>
        <label className="text-sm text-taupe">Jumlah Tamu</label>
        <input
          type="numeric"
          min={1}
          max={20}
          value={form.totalGuest}
          onChange={(e) => updateField("totalGuest", Number(e.target.value))}
          className="w-full border border-sand rounded-lg px-3 py-2 mt-1 text-ink"
        />
        {errors.totalGuest && (
          <p className="text-xs text-red-500 mt-1">{errors.totalGuest}</p>
        )}
      </div>

      {!isLoggedIn && (
        <div className="flex flex-col gap-3 border-t border-sand pt-3">
          <div>
            <label className="text-sm text-taupe">Nama Tamu</label>
            <input
              placeholder="Nama lengkap"
              value={form.guestName}
              onChange={(e) => updateField("guestName", e.target.value)}
              className="w-full border border-sand rounded-lg px-3 py-2 text-ink"
            />
            {errors.guestName && (
              <p className="text-xs text-red-500 mt-1">{errors.guestName}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-taupe">No. Handphone (Whatsapp) Aktif</label>
            <input
              placeholder="WhatsApp"
              value={form.guestPhone}
              onChange={(e) => updateField("guestPhone", e.target.value)}
              className="w-full border border-sand rounded-lg px-3 py-2 text-ink"
            />
            {errors.guestPhone && (
              <p className="text-xs text-red-500 mt-1">{errors.guestPhone}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-taupe">Email Aktif</label>
            <input
              placeholder="Email"
              value={form.guestEmail}
              onChange={(e) => updateField("guestEmail", e.target.value)}
              className="w-full border border-sand rounded-lg px-3 py-2 text-ink"
            />
            {errors.guestEmail && (
              <p className="text-xs text-red-500 mt-1">{errors.guestEmail}</p>
            )}
          </div>
        </div>
      )}
      {addons.length > 0 && (
  <div className="border-t border-sand pt-3">
    <p className="text-sm font-medium text-forest mb-3">Tambahan</p>

    <div className="flex flex-col gap-3">
      {addons.map((addon) => {
        const isChecked = Boolean(form.selectedAddons[addon.id]);

        return (
          <label
            key={addon.id}
            className="flex items-start gap-3 rounded-lg border border-sand p-3 cursor-pointer hover:bg-cream/40 transition-colors"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                const next = { ...form.selectedAddons };
                if (e.target.checked) {
                  next[addon.id] = 1;
                } else {
                  delete next[addon.id];
                }
                updateField("selectedAddons", next);
              }}
              className="mt-1 accent-terracotta"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink">
                  {addon.name}
                </span>
                <span className="text-sm text-taupe whitespace-nowrap">
                  Rp {addon.price.toLocaleString("id-ID")}
                  {addon.pricing_unit === "per_night" && " / malam"}
                  {addon.pricing_unit === "per_guest" && " / tamu"}
                  {addon.pricing_unit === "per_guest_per_night" && " / tamu / malam"}
                </span>
              </div>

              {addon.description && (
                <p className="text-xs text-taupe mt-1">{addon.description}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  </div>
)}

      <div className="border-t border-sand pt-3 space-y-1">
        <p className="text-sm text-taupe">
          Kamar: Rp {roomSubtotal.toLocaleString("id-ID")}
        </p>
        <p className="text-sm text-taupe">
          Tambahan: Rp {addonSubtotal.toLocaleString("id-ID")}
        </p>
        <p className="font-semibold text-xl text-forest pt-1">
          Total: Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <Button disabled={isSubmitting} type="submit" variant="brand" isLoading={isSubmitting}>
        Lanjutkan Booking
      </Button>
    </form>
  );
}