import { createSupabaseServer } from "@/lib/supabase/server";
import type { Units } from "@/lib/types/main";

export async function getUnits (): Promise<Units[]> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('units')
        .select('*')
        .is('deleted_at', null);

    if (error) return [];

    return data;
}

export async function getUnitsById (unitId: string): Promise<Units | null> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('units')
        .select('*')
        .is('deleted_at', null)
        .eq('id', unitId)
        .single();

    if (error) return null;

    return data;
}

export async function getUnitsByPropertyId (propertyId: string): Promise<Units[]> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('units')
        .select('*')
        .is('deleted_at', null)
        .eq('master_properties_id', propertyId)
        .eq('is_active', true)
        .order("name", { ascending: true });

    if (error) return [];

    return data;
}

export async function getUnitBySlug (slug: string): Promise<Units|null> {

    const supabase = await createSupabaseServer();
    const {data, error} =await supabase
        .from('units')
        .select('*')
        .is('deleted_at', null)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) return null;

    return data;
}