import { z } from "zod";

/**
 * Validation & sanitation layer for the create_booking flow.
 *
 * Scope: this is the SERVER-SIDE (Next.js) sanitation layer, sitting in
 * front of the `create_booking` Postgres RPC. It handles:
 *   - basic type/shape/format correctness
 *   - string trimming/sanitation
 *   - conditional requiredness (guest identity vs logged-in user)
 *   - date-range picking correctness (check_out after check_in)
 *
 * It intentionally does NOT duplicate business rules that must remain
 * server-authoritative in the RPC itself, since those can never be fully
 * trusted from a client layer:
 *   - booking cut-off rules (inap H+1 07:00 WIB, transit -30 min)
 *   - inap check-in/out time normalization to 14:00/12:00 WIB
 *   - unit availability / overlap checks
 *   - capacity vs unit.capacity
 *   - addon existence/active state and pricing
 *   - bank account resolution
 * Those remain enforced in the RPC regardless of what passes here.
 */

// -------------------------------------------------------------------------
// Shared primitives
// -------------------------------------------------------------------------

/** Trims and rejects empty/whitespace-only strings. */
const trimmedNonEmptyString = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(maxLength, `Must be at most ${maxLength} characters`);

const uuidSchema = z.uuid("Must be a valid UUID");

/**
 * Indonesian phone number, tolerant of common formats:
 * 08xxxxxxxxxx, +62xxxxxxxxxx, 62xxxxxxxxxx.
 * Sanitizes by stripping spaces/dashes before validating.
 */
const phoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/[\s\-()]/g, ""))
  .pipe(
    z
      .string()
      .regex(
        /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
        "Must be a valid Indonesian phone number"
      )
      .max(20, "Must be at most 20 characters")
  );

const emailSchema = z.email("Must be a valid email address").max(255).trim();

const proofUrlSchema = z
  .url("proof_url must be a valid URL")
  .max(2048, "proof_url is too long");

const bookingTypeSchema = z.enum(["inap", "transit"], {
  error: "booking_type must be either 'inap' or 'transit'",
});

// -------------------------------------------------------------------------
// Date-range picker input
//
// Client sends native Date objects from the date/datetime picker. We only
// sanity-check the range shape here (valid dates, check_out after check_in,
// not absurdly far in the past/future). Actual hour normalization for
// 'inap' (forcing 14:00/12:00 WIB) is done server-side in the RPC, not here.
// -------------------------------------------------------------------------

const dateRangeSchema = z
  .object({
    checkIn: z.date({ error: "checkIn must be a valid date" }),
    checkOut: z.date({ error: "checkOut must be a valid date" }),
  })
  .refine((val) => val.checkOut.getTime() > val.checkIn.getTime(), {
    message: "checkOut must be after checkIn",
    path: ["checkOut"],
  })
  .refine(
    (val) => {
      // Reject checkIn dates absurdly in the past (defensive UX guard only;
      // the real cut-off enforcement happens in the RPC).
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return val.checkIn.getTime() >= oneDayAgo.getTime();
    },
    { message: "checkIn cannot be in the past", path: ["checkIn"] }
  )
  .refine(
    (val) => {
      // Reject ranges further than ~1 year out (sanity guard against
      // accidental fat-fingered years from a date picker).
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      return val.checkIn.getTime() <= oneYearFromNow.getTime();
    },
    { message: "checkIn is too far in the future", path: ["checkIn"] }
  );

// -------------------------------------------------------------------------
// Addons
// -------------------------------------------------------------------------

const addonSchema = z.object({
  propertyAddonId: uuidSchema,
  quantity: z
    .number({ error: "quantity must be a number" })
    .int("quantity must be an integer")
    .min(1, "quantity must be at least 1")
    .max(999, "quantity is unreasonably large"),
});

const addonsSchema = z
  .array(addonSchema)
  .max(50, "Too many addons in a single booking")
  .default([]);

// -------------------------------------------------------------------------
// Guest identity — conditional on whether the user is logged in
// -------------------------------------------------------------------------

const guestIdentitySchema = z
  .object({
    userId: uuidSchema.nullable().optional(),
    guestName: trimmedNonEmptyString(255).nullable().optional(),
    guestPhone: phoneSchema.nullable().optional(),
    guestEmail: emailSchema.nullable().optional(),
  })
  .refine(
    (val) => {
      const isLoggedIn = !!val.userId;
      if (isLoggedIn) return true;
      return !!val.guestName && !!val.guestPhone;
    },
    {
      message:
        "guestName and guestPhone are required for anonymous (non-logged-in) bookings",
      path: ["guestName"],
    }
  );

// -------------------------------------------------------------------------
// Full create_booking input schema
// -------------------------------------------------------------------------

export const createBookingSchema = z
  .object({
    unitId: uuidSchema,
    bookingType: bookingTypeSchema,
    dateRange: dateRangeSchema,
    totalGuest: z
      .number({ error: "totalGuest must be a number" })
      .int("totalGuest must be an integer")
      .min(1, "totalGuest must be at least 1")
      .max(100, "totalGuest is unreasonably large"),
    proofUrl: proofUrlSchema,
    addons: addonsSchema,
  })
  .and(guestIdentitySchema);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/**
 * Maps a validated CreateBookingInput into the exact positional shape
 * expected by the `create_booking` Postgres RPC (see create_booking_v3.sql).
 * Keeps the RPC call site simple and avoids relying on field name matching.
 */
export function toCreateBookingRpcArgs(input: CreateBookingInput) {
  return {
    p_unit_id: input.unitId,
    p_booking_type: input.bookingType,
    p_check_in: input.dateRange.checkIn.toISOString(),
    p_check_out: input.dateRange.checkOut.toISOString(),
    p_total_guest: input.totalGuest,
    p_proof_url: input.proofUrl,
    p_user_id: input.userId ?? null,
    p_guest_name: input.guestName ?? null,
    p_guest_phone: input.guestPhone ?? null,
    p_guest_email: input.guestEmail ?? null,
    p_addons: input.addons.map((a) => ({
      property_addon_id: a.propertyAddonId,
      quantity: a.quantity,
    })),
  };
}

/**
 * Safe-parse helper for use in server actions / API routes.
 * Returns either the sanitized data or a flattened error map ready to
 * send back to the client for form field errors.
 */
export function validateCreateBookingInput(input: unknown) {
  const result = createBookingSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      errors: z.flattenError(result.error),
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}