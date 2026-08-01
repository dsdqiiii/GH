import { useState } from "react";
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
  buildBookingPayload,
} from "@/utils/booking.utils";
import { createBooking } from "@/actions/bookings";
import { uploadPaymentProof, PaymentProofUploadError } from "@/helpers/upload";

type SubmitStage = "idle" | "uploading" | "booking";

type UseBookingFormArgs = Pick<
  BookingFormProps,
  | "unitId"
  | "pricePerNight"
  | "pricePerHour"
  | "isLoggedIn"
  | "checkIn"
  | "checkOut"
  | "bookingType"
  | "addons"
>;

export function useBookingForm({
  unitId,
  pricePerNight,
  pricePerHour,
  isLoggedIn = false,
  checkIn,
  checkOut,
  bookingType,
  addons,
}: UseBookingFormArgs) {
  const [form, setForm] = useState<FormState>(initialBookingState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<SubmitStage>("idle");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSubmitError(null);
  }

  function updateProofFile(file: File | null) {
    setProofFile(file);
    if (file) setFileError(null);
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

  const duration = bookingType === "inap" ? nights : durationHours;

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
    setSubmitError(null);

    const validationErrors = validateBookingForm(form, isLoggedIn);
    setErrors(validationErrors);

    const hasFileError = !proofFile;
    setFileError(
      hasFileError ? "Silakan unggah bukti pembayaran terlebih dahulu" : null
    );

    if (hasFileError || Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      setSubmitStage("uploading");
      const proofPath = await uploadPaymentProof(proofFile as File);

      const payload: BookingPayload = buildBookingPayload({
        unitId,
        bookingType,
        checkIn,
        duration,
        proofUrl: proofPath,
        form,
        isLoggedIn,
      });

      setSubmitStage("booking");
      const result = await createBooking(payload, undefined);

      if (!result) {
        setSubmitError("Gagal membuat booking. Silakan coba lagi.");
        return;
      }

      // TODO: redirect ke halaman detail booking (result.data.bookingCode)
    } catch (err) {
      if (err instanceof PaymentProofUploadError) {
        setFileError(err.message);
      } else {
        setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
      setSubmitStage("idle");
    }
  }

  return {
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
  };
}