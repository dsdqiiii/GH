"use client";

import { Button } from "@/components/ui/core/button";
import { FileUpload } from "@/components/booking/FileUpload";
import type { BookingFormProps } from "@/lib/types/booking.types";
import { formatDateDisplay } from "@/utils/formatter.utils";
import { useBookingForm } from "@/hooks/useBookingForm";

export default function BookingForm({
  unitId,
  unitName,
  pricePerNight,
  pricePerHour,
  isTransitEnabled,
  addons,
  isLoggedIn = false,
  checkIn,
  duration,
  bookingType,
}: BookingFormProps) {
  const {
    form,
    errors,
    isSubmitting,
    submitStage,
    proofFile,
    fileError,
    submitError,
    nights,
    durationHours,
    roomSubtotal,
    addonSubtotal,
    total,
    updateField,
    updateProofFile,
    handleSubmit,
  } = useBookingForm({
    unitId,
    pricePerNight,
    pricePerHour,
    isLoggedIn,
    checkIn,
    duration,
    bookingType,
    addons,
  });

  function handleScrollToSidebarPicker() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const submitLabel =
    submitStage === "uploading"
      ? "Mengunggah bukti..."
      : submitStage === "booking"
        ? "Membuat booking..."
        : "Lanjutkan Booking";

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

      <div className="rounded-lg border border-sand bg-white p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-taupe mb-1">
            {bookingType === "inap" ? "Check-in" : "Tanggal Transit"}
          </p>
          <p className="text-sm font-medium text-forest">
            {formatDateDisplay(checkIn)}
          </p>
          {bookingType === "inap" && nights > 0 && (
            <p className="text-xs text-taupe mt-1">{nights} malam</p>
          )}
          {bookingType === "transit" && durationHours > 0 && (
            <p className="text-xs text-taupe mt-1">{durationHours} jam</p>
          )}
        </div>

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

      <div className="border-t border-sand pt-4">
        <FileUpload
          label="Upload Bukti Pembayaran"
          accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
          maxSizeMB={2}
          value={proofFile}
          disabled={isSubmitting}
          onChange={updateProofFile}
          error={fileError || undefined}
        />
      </div>

      {submitError && (
        <p className="text-sm text-red-500 text-center">{submitError}</p>
      )}

      <Button
        disabled={isSubmitting}
        type="submit"
        variant="brand"
        isLoading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </form>
  );
}