import { supabaseAdmin } from "@/lib/supabase/admin"; // Sesuaikan path Supabase/Database client Anda
import type { ActivityLogItem } from "@/lib/types/activity-log.types";

export async function getActivityLogs({
  search = "",
  limit = 100,
}: {
  search?: string;
  limit?: number;
}): Promise<ActivityLogItem[]> {
  const supabase = supabaseAdmin;

  let query = supabase
    .from("activity_logs")
    .select(`
      id,
      actor_type,
      actor_id,
      event,
      entity_type,
      entity_id,
      metadata,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Jika ada parameter pencarian
  if (search) {
    query = query.or(
      `event.ilike.%${search}%,entity_type.ilike.%${search}%,actor_type.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  // Mapping hasil query dari snake_case database ke camelCase TypeScript
  return (data || []).map((item: any) => ({
    id: item.id,
    actorType: item.actor_type,
    actorId: item.actor_id,
    actorName: item.profiles?.name ?? null,
    actorEmail: item.profiles?.email ?? null,
    event: item.event,
    entityType: item.entity_type,
    entityId: item.entity_id,
    metadata: item.metadata ?? {},
    createdAt: item.created_at,
  }));
}