CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_type text NOT NULL CHECK (actor_type IN ('anonymous', 'user', 'admin', 'system')),
    actor_id uuid NULL,
    event text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT activity_logs_actor_id_required_check
    CHECK (
        (actor_type IN ('user', 'admin') AND actor_id IS NOT NULL)
        OR (actor_type IN ('anonymous', 'system'))
    )
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity
ON activity_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_actor
ON activity_logs(actor_type, actor_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_event
ON activity_logs(event);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at
ON activity_logs(created_at DESC);