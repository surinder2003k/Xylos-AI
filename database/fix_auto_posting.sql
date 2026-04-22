-- ============================================================
-- Xylos AI | Auto-Posting Fix SQL
-- Run this in your Supabase SQL Editor to fix auto-posting.
-- ============================================================

-- 1. Create automation_logs table (needed for cron monitoring)
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event TEXT NOT NULL,
    status TEXT NOT NULL,
    details TEXT,
    duration_sec FLOAT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Drop old policy if it exists, then recreate
DROP POLICY IF EXISTS "Admins can view automation logs" ON public.automation_logs;

CREATE POLICY "Admins can view automation logs" ON public.automation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Allow service role full access (used by cron)
CREATE POLICY "Service role full access" ON public.automation_logs
    FOR ALL USING (true)
    WITH CHECK (true);

-- 2. Add auto_category to app_settings (default: Technology)
INSERT INTO public.app_settings (key, value)
VALUES ('auto_category', '"Technology"')
ON CONFLICT (key) DO NOTHING;

-- 3. Verify your profiles table has at least one admin
-- (auto-posting needs an author_id — if this returns empty, your cron WILL fail)
SELECT user_id, email, role FROM public.profiles WHERE role IN ('super_admin', 'admin');
