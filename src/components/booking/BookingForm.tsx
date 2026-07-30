"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import { FileUpload } from "@/components/booking/FileUpload";
import type {
  BookingFormProps,
  FormState,
  FormErrors,
  BookingPayload,
} from "@/lib/types/booking.types";
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

  // State terpisah untuk menampung file upload identitas/bukti
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // Helper untuk scroll ke PickRange di sidebar atas
  function handleScrollToSidebarPicker() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const nights =
    bookingType === "inap"
      ? calculateNights(new Date(checkIn), new Date(checkOut))
      : 0;

  const durationHours =
    bookingType === "transit"
      ? Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60)
        )
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Validasi form biasa
    const validationErrors = validateBookingForm(form, isLoggedIn);
    setErrors(validationErrors);

    // Optional: Validasi file identitas jika wajib bagi guest (non-logged in)
    if (!isLoggedIn && !identityFile) {
      setFileError("Silakan unggah foto identitas (KTP/SIM) terlebih dahulu");
      if (Object.keys(validationErrors).length > 0) return;
      return;
    } else {
      setFileError(null);
    }

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    // 2. Dummy Process Upload File
    let uploadedFileUrl: string | null = null;
    if (identityFile) {
      console.log("[DUMMY UPLOAD] Memproses upload file:", identityFile.name);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      uploadedFileUrl = `https://dummy-storage.local/uploads/${Date.now()}_${identityFile.name}`;
      console.log("[DUMMY UPLOAD] File berhasil diunggah ke:", uploadedFileUrl);
    }

    // 3. Menyiapkan payload booking
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

    console.log("[DUMMY BOOKING SUBMIT]", payload);

    const userId = undefined;

    // 4. Kirim data ke backend / Server Action
    const result = await createBooking(payload, userId);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
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
            {bookingType === "inap"
              ? "Check-in — Check-out"
              : "Tanggal Transit"}
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

        {/* Klik tombol ini untuk scroll kembali ke PickRange di sidebar */}
        <Button
          type="button"
          variant="ghost"
          onClick={handleScrollToSidebarPicker}
          className="text-terracotta hover:text-terracotta-dark font-medium whitespace-nowrap h-auto p-0"
        >
          Ubah Tanggal
        </Button>
      </div>

      <div>
        <label className="text-sm text-taupe">Jumlah Tamu</label>
        <input
          type="number"
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
            <label className="text-sm text-taupe">
              No. Handphone (Whatsapp) Aktif
            </label>
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
                        {addon.pricing_unit === "per_guest_per_night" &&
                          " / tamu / malam"}
                      </span>
                    </div>

                    {addon.description && (
                      <p className="text-xs text-taupe mt-1">
                        {addon.description}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Total Harga */}
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

      {/* Upload File (khusus guest non-logged in) */}
      {!isLoggedIn && (
        <div className="border-t border-sand pt-4">
          <FileUpload
            label="Upload Bukti Pembayaran"
            accept="image/jpeg,image/png,application/pdf,.pdf"
            maxSizeMB={2}
            value={identityFile}
            onChange={(file) => {
              setIdentityFile(file);
              if (file) setFileError(null);
            }}
            error={fileError || undefined}
          />
        </div>
      )}

      <Button
        disabled={isSubmitting}
        type="submit"
        variant="brand"
        isLoading={isSubmitting}
      >
        {isSubmitting ? "Memproses..." : "Lanjutkan Booking"}
      </Button>
    </form>
  );
}