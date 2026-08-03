import { createSupabaseServer } from "@/lib/supabase/server";
import type { PropertyMasterAddons } from "@/lib/types/main";

export async function getPropertyAddons(
  propertyId: string
): Promise<PropertyMasterAddons[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("property_addons")
    .select(
      `
      id,
      price,
      master_addons (
        id,
        code,
        name,
        description,
        pricing_unit
      )
    `
    )
    .eq("master_properties_id", propertyId)
    .eq("is_active", true);

  if (error) {
    console.error("getPropertyAddons error:", error);
    return [];
  }

  if (!data) return [];

  return data
    .map((item) => {
      // Supabase typing quirk: nested to-one relations are typed as arrays.
      // Normalize to a single object regardless of whether it comes back
      // as an object or a single-element array.
      const masterAddon = Array.isArray(item.master_addons)
        ? item.master_addons[0]
        : item.master_addons;

      if (!masterAddon) return null;

      return {
        id: item.id,
        price: item.price,
        addon_id: masterAddon.id,
        code: masterAddon.code,
        name: masterAddon.name,
        description: masterAddon.description,
        pricing_unit: masterAddon.pricing_unit,
      };
    })
    .filter((addon): addon is PropertyMasterAddons => addon !== null);
}