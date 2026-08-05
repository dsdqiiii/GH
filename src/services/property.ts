import { createSupabaseServer } from "@/lib/supabase/server";
import type { MasterProperties } from "@/lib/types/main.types";

export async function getProperties (): Promise<MasterProperties[]> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('master_properties')
        .select('*');

    if (error) return [];

    return data;
}

export async function getPropertyByPropertyId (propertyId: string): Promise<MasterProperties | null> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('master_properties')
        .select('*')
        .eq('id', propertyId)
        .single();

    if (error) return null;

    return data;
}

export async function getPropertyBySlug (slug: string): Promise<MasterProperties|null> {

    const supabase = await createSupabaseServer();
    const {data, error} = await supabase
        .from('master_properties')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;

    return data;
}