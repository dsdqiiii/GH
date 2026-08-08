import { createSupabaseServer } from "@/lib/supabase/server";
import { getFacilitiesForReference } from "@/services/admin/facility-assignments";
import type {
  Galleries,
  MasterProperties,
  UnitDetail,
  Units,
} from "@/lib/types/main.types";

/**
 * Mengambil detail lengkap satu unit berdasarkan slug property + slug unit:
 * - data unit itu sendiri
 * - property induk (untuk konteks nama & link kembali)
 * - facility yang di-assign ke unit ini (reference_type = 'unit')
 * - galleries milik unit ini (reference_type = 'unit')
 *
 * Mengembalikan null kalau property atau unit tidak ditemukan, atau kalau
 * unit tersebut bukan milik property yang dimaksud.
 */
export async function getUnitDetailBySlug(
  propertySlug: string,
  unitSlug: string
): Promise<UnitDetail | null> {
  const supabase = await createSupabaseServer();

  const { data: property, error: propertyError } = await supabase
    .from("master_properties")
    .select("*")
    .eq("slug", propertySlug)
    .single<MasterProperties>();

  if (propertyError || !property) {
    return null;
  }

  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("*")
    .eq("slug", unitSlug)
    .eq("master_properties_id", property.id)
    .is("deleted_at", null)
    .single<Units>();

  if (unitError || !unit) {
    return null;
  }

  const [facilities, galleriesRes] = await Promise.all([
    getFacilitiesForReference(supabase, "unit", unit.id),
    supabase
      .from("galleries")
      .select("*")
      .eq("reference_type", "unit")
      .eq("reference_id", unit.id)
      .order("is_main", { ascending: false })
      .order("created_at", { ascending: true }),
  ]);

  const galleries: Galleries[] = galleriesRes.data ?? [];

  return {
    unit,
    property,
    facilities,
    galleries,
  };
}