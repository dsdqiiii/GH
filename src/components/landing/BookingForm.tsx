"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import type { PropertyMasterAddons } from "@/lib/types/main";

interface BookingFormProps {
  unitId: string;
  unitName: string;
  pricePerNight: number;
  pricePerHour: number | null;
  isTransitEnabled: boolean;
  addons: PropertyMasterAddons[];
  isLoggedIn?: boolean;
}

type BookingType = "inap" | "transit";

interface FormState {
  bookingType: BookingType;
  checkIn: string;
  checkOut: string;
  totalGuest: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  selectedAddons: Record<string, number>; // addon.id -> quantity
}

interface FormErrors {
  checkIn?: string;
  checkOut?: string;
  totalGuest?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

const initialState: FormState = {
  bookingType: "inap",
  checkIn: "",
  checkOut: "",
  totalGuest: 1,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  selectedAddons: {},
};

export default function BookingForm({
  unitId,
  unitName,
  pricePerNight,
  pricePerHour,
  isTransitEnabled,
  addons,
  isLoggedIn = false,
}: BookingFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleAddon(addonId: string) {
    setForm((prev) => {
      const next = { ...prev.selectedAddons };
      if (next[addonId]) {
        delete next[addonId];
      } else {
        next[addonId] = 1;
      }
      return { ...prev, selectedAddons: next };
    });
  }

  function updateAddonQuantity(addonId: string, quantity: number) {
    setForm((prev) => ({
      ...prev,
      selectedAddons: {
        ...prev.selectedAddons,
        [addonId]: Math.max(1, quantity),
      },
    }));
  }

  function calculateNights(): number {
    if (!form.checkIn || !form.checkOut) return 0;
    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  function calculateHours(): number {
    if (!form.checkIn || !form.checkOut) return 0;
    const inDate = new Date(form.checkIn);
    const outDate = new Date(form.checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  }

  function calculateRoomSubtotal(): number {
    if (form.bookingType === "inap") {
      return calculateNights() * pricePerNight;
    }
    return calculateHours() * (pricePerHour ?? 0);
  }

  function calculateAddonSubtotal(): number {
    const nights = calculateNights();
    return addons.reduce((sum, addon) => {
      const qty = form.selectedAddons[addon.id];
      if (!qty) return sum;

      switch (addon.pricing_unit) {
        case "per_guest":
          return sum + addon.price * form.totalGuest;
        case "per_night":
          return sum + addon.price * Math.max(1, nights);
        case "per_guest_per_night":
          return sum + addon.price * form.totalGuest * Math.max(1, nights);
        case "flat":
        default:
          return sum + addon.price * qty;
      }
    }, 0);
  }

  function calculateTotal(): number {
    return calculateRoomSubtotal() + calculateAddonSubtotal();
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.checkIn) newErrors.checkIn = "Tanggal check-in wajib diisi";
    if (!form.checkOut) newErrors.checkOut = "Tanggal check-out wajib diisi";

    if (form.checkIn && form.checkOut) {
      const inDate = new Date(form.checkIn);
      const outDate = new Date(form.checkOut);
      if (outDate <= inDate) {
        newErrors.checkOut = "Check-out harus setelah check-in";
      }
    }

    if (form.totalGuest < 1) {
      newErrors.totalGuest = "Jumlah tamu minimal 1";
    }

    if (!isLoggedIn) {
      if (!form.guestName.trim()) newErrors.guestName = "Nama wajib diisi";
      if (!form.guestPhone.trim()) {
        newErrors.guestPhone = "Nomor WhatsApp wajib diisi";
      } else if (!/^[0-9+\-\s]{8,20}$/.test(form.guestPhone)) {
        newErrors.guestPhone = "Format nomor tidak valid";
      }
      if (form.guestEmail && !/^\S+@\S+\.\S+$/.test(form.guestEmail)) {
        newErrors.guestEmail = "Format email tidak valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      unitId,
      bookingType: form.bookingType,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      totalGuest: form.totalGuest,
      guest: isLoggedIn
        ? null
        : {
            name: form.guestName,
            phone: form.guestPhone,
            email: form.guestEmail || null,
          },
      addons: Object.entries(form.selectedAddons).map(([addonId, quantity]) => ({
        propertyAddonId: addonId,
        quantity,
      })),
      roomSubtotal: calculateRoomSubtotal(),
      addonSubtotal: calculateAddonSubtotal(),
      total: calculateTotal(),
    };

    // TODO: sambungkan ke server action / API route untuk insert ke
    // orders -> order_items -> order_item_addons -> payments (status PENDING_PAYMENT)
    console.log("Booking payload:", payload);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
  }

  const nights = calculateNights();
  const hours = calculateHours();
  const roomSubtotal = calculateRoomSubtotal();
  const addonSubtotal = calculateAddonSubtotal();
  const total = calculateTotal();

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
        <h3 className="text-lg font-semibold mb-1" style={{ color: "#1F3B36" }}>
          Booking {unitName}
        </h3>
        <p className="text-sm" style={{ color: "#6B5D4F" }}>
          Isi detail berikut untuk melanjutkan pemesanan
        </p>
      </div>

      {/* Booking type */}
      {bookingTypes.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#1F3B36" }}>
            Tipe Booking
          </label>
          <div className="flex gap-3">
            {bookingTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField("bookingType", type)}
                className="flex-1 rounded-lg border py-2 text-sm capitalize transition-all"
                style={{
                  borderColor: form.bookingType === type ? "#B5654A" : "#CFC2B2",
                  backgroundColor: form.bookingType === type ? "#B5654A15" : "transparent",
                  color: form.bookingType === type ? "#B5654A" : "#6B5D4F",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#1F3B36" }}>
            Check-in
          </label>
          <input
            type="datetime-local"
            value={form.checkIn}
            onChange={(e) => updateField("checkIn", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: errors.checkIn ? "#B54A4A" : "#CFC2B2" }}
          />
          {errors.checkIn && (
            <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
              {errors.checkIn}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#1F3B36" }}>
            Check-out
          </label>
          <input
            type="datetime-local"
            value={form.checkOut}
            onChange={(e) => updateField("checkOut", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: errors.checkOut ? "#B54A4A" : "#CFC2B2" }}
          />
          {errors.checkOut && (
            <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
              {errors.checkOut}
            </p>
          )}
        </div>
      </div>

      {/* Guest count */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "#1F3B36" }}>
          Jumlah Tamu
        </label>
        <input
          type="number"
          min={1}
          value={form.totalGuest}
          onChange={(e) => updateField("totalGuest", Number(e.target.value))}
          className="w-full rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: errors.totalGuest ? "#B54A4A" : "#CFC2B2" }}
        />
        {errors.totalGuest && (
          <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
            {errors.totalGuest}
          </p>
        )}
      </div>

      {/* Addons */}
      {addons.length > 0 && (
        <div className="pt-2 border-t" style={{ borderColor: "#E5DDD0" }}>
          <p className="text-sm font-medium mb-3" style={{ color: "#1F3B36" }}>
            Tambahan (Opsional)
          </p>
          <div className="flex flex-col gap-2">
            {addons.map((addon) => {
              const isSelected = Boolean(form.selectedAddons[addon.id]);
              return (
                <div
                  key={addon.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                  style={{
                    borderColor: isSelected ? "#B5654A" : "#CFC2B2",
                    backgroundColor: isSelected ? "#B5654A0D" : "transparent",
                  }}
                >
                  <label className="flex items-center gap-2 text-sm flex-1 cursor-pointer" style={{ color: "#2C2420" }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddon(addon.id)}
                    />
                    <span>
                      {addon.name}
                      <span className="block text-xs" style={{ color: "#6B5D4F" }}>
                        Rp {addon.price.toLocaleString("id-ID")}{" "}
                        {addon.pricing_unit === "per_guest" && "/ tamu"}
                        {addon.pricing_unit === "per_night" && "/ malam"}
                        {addon.pricing_unit === "per_guest_per_night" && "/ tamu / malam"}
                        {addon.pricing_unit === "flat" && "/ item"}
                      </span>
                    </span>
                  </label>

                  {isSelected && addon.pricing_unit === "flat" && (
                    <input
                      type="number"
                      min={1}
                      value={form.selectedAddons[addon.id]}
                      onChange={(e) =>
                        updateAddonQuantity(addon.id, Number(e.target.value))
                      }
                      className="w-16 rounded border px-2 py-1 text-sm text-center"
                      style={{ borderColor: "#CFC2B2" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Guest info - only if not logged in */}
      {!isLoggedIn && (
        <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: "#E5DDD0" }}>
          <p className="text-sm font-medium" style={{ color: "#1F3B36" }}>
            Data Pemesan
          </p>

          <div>
            <input
              type="text"
              placeholder="Nama lengkap"
              value={form.guestName}
              onChange={(e) => updateField("guestName", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: errors.guestName ? "#B54A4A" : "#CFC2B2" }}
            />
            {errors.guestName && (
              <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
                {errors.guestName}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Nomor WhatsApp"
              value={form.guestPhone}
              onChange={(e) => updateField("guestPhone", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: errors.guestPhone ? "#B54A4A" : "#CFC2B2" }}
            />
            {errors.guestPhone && (
              <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
                {errors.guestPhone}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email (opsional)"
              value={form.guestEmail}
              onChange={(e) => updateField("guestEmail", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: errors.guestEmail ? "#B54A4A" : "#CFC2B2" }}
            />
            {errors.guestEmail && (
              <p className="text-xs mt-1" style={{ color: "#B54A4A" }}>
                {errors.guestEmail}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="pt-3 border-t flex flex-col gap-1" style={{ borderColor: "#E5DDD0" }}>
        {form.bookingType === "inap" && nights > 0 && (
          <p className="text-sm" style={{ color: "#6B5D4F" }}>
            {nights} malam &times; Rp {pricePerNight.toLocaleString("id-ID")} = Rp{" "}
            {roomSubtotal.toLocaleString("id-ID")}
          </p>
        )}
        {form.bookingType === "transit" && hours > 0 && (
          <p className="text-sm" style={{ color: "#6B5D4F" }}>
            {hours} jam &times; Rp {(pricePerHour ?? 0).toLocaleString("id-ID")} = Rp{" "}
            {roomSubtotal.toLocaleString("id-ID")}
          </p>
        )}
        {addonSubtotal > 0 && (
          <p className="text-sm" style={{ color: "#6B5D4F" }}>
            Tambahan: Rp {addonSubtotal.toLocaleString("id-ID")}
          </p>
        )}
        <p className="text-xl font-semibold mt-1" style={{ color: "#1F3B36" }}>
          Rp {total.toLocaleString("id-ID")}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg px-6 py-3 text-sm w-full"
        style={{ backgroundColor: "#B5654A" }}
      >
        {isSubmitting ? "Memproses..." : "Lanjutkan Booking"}
      </Button>
    </form>
  );
}