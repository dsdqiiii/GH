import { createSupabaseServer } from "@/lib/supabase/server";
import type { Units, UnitsUpdate } from "@/lib/types/main.types";

/**
 * Mengambil semua unit dalam sebuah property untuk keperluan admin.
 * Berbeda dari services/unit.ts (getUnitsByPropertyId) yang hanya untuk
 * publik (is_active = true) — di sini admin perlu lihat semua unit,
 * termasuk yang sedang dinonaktifkan (mis. untuk renovasi).
 */
export async function getUnitsByPropertyIdForAdmin(
  propertyId: string
): Promise<Units[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("master_properties_id", propertyId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching units for admin:", error);
    return [];
  }

  return data ?? [];
}

export type UpdateUnitResult =
  | { data: Units; error: null }
  | { data: null; error: string };

/**
 * Update data units berdasarkan id.
 * Tidak melakukan validasi bisnis tambahan (mis. cek booking aktif) —
 * murni update kolom yang dikirim. (Lihat diskusi terpisah soal validasi
 * booking untuk kasus unit yang perlu dinonaktifkan karena renovasi.)
 */
export async function updateUnit(
  unitId: string,
  payload: UnitsUpdate
): Promise<UpdateUnitResult> {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("units")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", unitId)
    .select("*")
    .single<Units>();

  if (error || !data) {
    console.error("[updateUnit] supabase error:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });
    return { data: null, error: error?.message ?? "Gagal memperbarui unit" };
  }

  return { data, error: null };
}

/**
 * Toggle is_active untuk sebuah unit.
 * Simpel: tidak ada validasi booking aktif (untuk saat ini).
 */
export async function toggleUnitActive(
  unitId: string,
  isActive: boolean
): Promise<UpdateUnitResult> {
  return updateUnit(unitId, { is_active: isActive });
}