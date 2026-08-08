ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert activity logs for everyone" ON public.activity_logs;

CREATE POLICY "Allow insert activity logs for everyone"
ON public.activity_logs
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select activity logs for admin only" ON public.activity_logs;

CREATE POLICY "Allow select activity logs for admin only"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (
  is_admin()
);