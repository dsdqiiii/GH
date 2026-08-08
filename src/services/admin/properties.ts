import { createSupabaseServer } from "@/lib/supabase/server";
import type { MasterProperties, MasterPropertiesUpdate } from "@/lib/types/main.types";

export type UpdatePropertyResult =
  | { data: MasterProperties; error: null }
  | { data: null; error: string };

/**
 * Update data master_properties berdasarkan id.
 * Tidak melakukan validasi bisnis tambahan (mis. cek booking aktif) —
 * murni update kolom yang dikirim.
 */
export async function updateProperty(
  propertyId: string,
  payload: MasterPropertiesUpdate
): Promise<UpdatePropertyResult> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("master_properties")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", propertyId)
    .select("*")
    .single<MasterProperties>();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Gagal memperbarui properti" };
  }

  return { data, error: null };
}

/**
 * Toggle is_active untuk sebuah property.
 * Simpel: tidak ada validasi booking aktif di unit-unit bawahnya (untuk saat ini).
 */
export async function togglePropertyActive(
  propertyId: string,
  isActive: boolean
): Promise<UpdatePropertyResult> {
  return updateProperty(propertyId, { is_active: isActive });
}