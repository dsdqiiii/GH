import { createSupabaseServer } from "@/lib/supabase/server";
import { PropertyMasterAddons } from "@/lib/types/main";

export async function getPropertyAddons(
  propertyId: string
): Promise<PropertyMasterAddons[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("property_addons")
    .select(`
      id,
      price,
      master_addons (
        id,
        code,
        name,
        description,
        pricing_unit
      )
    `)
    .eq("master_properties_id", propertyId)
    .eq("is_active", true);

  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    price: item.price,
    addon_id: item.master_addons.id,
    code: item.master_addons.code,
    name: item.master_addons.name,
    description: item.master_addons.description,
    pricing_unit: item.master_addons.pricing_unit,
  }));
}