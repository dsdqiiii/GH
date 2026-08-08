import { createSupabaseServer } from "@/lib/supabase/server";
import type { Json } from "@/lib/types/supabase";

export type ActorType = "anonymous" | "user" | "admin" | "system";

interface LogActivityParams {
  actorType?: ActorType;
  actorId?: string | null;
  event: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Json;
}

/**
 * Memanggil RPC log_activity untuk mencatat aktivitas.
 * Jika actorId tidak dikirim dan actorType bukan 'anonymous'/'system',
 * fungsi akan mencoba mengambil user.id dari session saat ini.
 */
export async function logActivity(params: LogActivityParams) {
  const {
    actorType = "admin",
    actorId,
    event,
    entityType,
    entityId = null,
    metadata = {},
  } = params;

  try {
    const supabase = await createSupabaseServer();
    let finalActorId = actorId;

    // Jika actorId tidak disediakan & bukan aksi anonim, ambil dari sesi aktif
    if (!finalActorId && actorType !== "anonymous" && actorType !== "system") {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("logActivity skipped: no authenticated user found");
        return;
      }
      finalActorId = user.id;
    }

    const { error } = await supabase.rpc("log_activity", {
      p_actor_type: actorType,
      p_actor_id: finalActorId ?? undefined,
      p_event: event,
      p_entity_type: entityType,
      p_entity_id: entityId ?? undefined,
      p_metadata: metadata,
    });

    if (error) {
      console.error("logActivity failed:", error.message, error.details);
    }
  } catch (err) {
    console.error("logActivity threw:", err);
  }
}