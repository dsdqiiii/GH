export type ActorType = "anonymous" | "user" | "admin" | "system";

export interface ActivityLogItem {
  id: string;
  actorType: ActorType;
  actorId: string | null;
  actorName?: string | null;  // Diambil via JOIN ke tabel users/profiles jika actor_id ada
  actorEmail?: string | null; // Diambil via JOIN ke tabel users/profiles jika actor_id ada
  event: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}