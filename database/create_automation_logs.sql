-- Xylos AI | Automation Reporting Layer
-- Run this in your Supabase SQL Editor to enable robust cron monitoring.

CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event TEXT NOT NULL,          -- e.g., 'start', 'generation', 'insertion', 'error'
    status TEXT NOT NULL,         -- 'success', 'failed', 'info'
    details TEXT,                 -- Detailed message or error payload
    count INTEGER DEFAULT 1,      -- Number of posts requested
    duration_sec FLOAT,           -- How long the operation took
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view logs
CREATE POLICY "Admins can view automation logs" ON public.automation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Allow service role to insert (this is handled by the admin client automatically)
