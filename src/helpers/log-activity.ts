import { createSupabaseServer } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/supabase";

type ActorType = "user" | "system" | "guest";

/**
 * Memanggil RPC log_activity untuk mencatat aktivitas admin/staff.
 * Dipanggil dari actions setelah operasi write (update/toggle/dll) sukses.
 *
 * Gagal log TIDAK boleh menggagalkan action utama — di-swallow & di-console.error
 * saja, supaya UX tidak terganggu hanya karena audit log gagal tercatat.
 */
export async function logActivity(params: {
  actorType?: ActorType;
  event: string;
  entityType: string;
  entityId: string;
  metadata?: Json;
}) {
  const { actorType = "user", event, entityType, entityId, metadata = {} } = params;

  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("logActivity skipped: no authenticated user");
      return;
    }

    const { error } = await supabase.rpc("log_activity", {
      p_actor_type: actorType,
      p_actor_id: user.id,
      p_event: event,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_metadata: metadata,
    });

    if (error) {
      console.error("logActivity failed:", error.message);
    }
  } catch (err) {
    console.error("logActivity threw:", err);
  }
}