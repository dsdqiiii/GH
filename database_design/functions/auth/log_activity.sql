CREATE OR REPLACE FUNCTION log_activity(
  p_actor_type text,
  p_actor_id uuid DEFAULT NULL,
  p_event text DEFAULT '',
  p_entity_type text DEFAULT '',
  p_entity_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO public.activity_logs (
    actor_type,
    actor_id,
    event,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_actor_type,
    p_actor_id,
    p_event,
    p_entity_type,
    p_entity_id,
    p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Berikan akses eksekusi ke anon dan authenticated role
GRANT EXECUTE ON FUNCTION log_activity TO anon, authenticated, service_role;