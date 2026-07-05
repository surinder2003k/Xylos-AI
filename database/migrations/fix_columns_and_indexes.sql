-- Xylos AI | Fix: Add missing columns, unique constraints, and improve indexing
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- 1. Add missing SEO columns to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(user_id);

-- 2. Add index on slug for faster lookups (used in sitemap + blog pages)
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);

-- 3. Add unique constraint on blogs.title to prevent duplicate titles
-- This is the MAIN fix for Google Search Console duplicate errors
-- Note: If existing duplicates exist, you may need to clean them first
-- Run this AFTER cleaning duplicates:
-- ALTER TABLE public.blogs ADD CONSTRAINT unique_blog_title UNIQUE (title);

-- 4. Add unique constraint on blogs.slug (already in schema but ensure it exists)
-- Run this if slug column doesn't have a unique constraint:
-- ALTER TABLE public.blogs ADD CONSTRAINT unique_blog_slug UNIQUE (slug);

-- 5. Create app_settings table if not exists (for auto-posting configuration)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Insert default settings if they don't exist
INSERT INTO public.app_settings (key, value)
VALUES 
  ('auto_publish', 'true'),
  ('auto_category', '"Technology"'),
  ('available_categories', '["Technology", "Business", "Science", "Health", "AI & Machine Learning", "Cybersecurity", "Blockchain", "Space & Astronomy"]'),
  ('auto_topics', '["Global Technology Advancements", "Startup & VC Ecosystem", "Artificial Intelligence & Ethics", "Cybersecurity Protocols", "Neural Networks & Deep Learning", "Quantum Computing Frontiers", "Renewable Energy Innovation", "Biotechnology Breakthroughs"]')
ON CONFLICT (key) DO NOTHING;

-- 7. Allow service_role to bypass RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin CRUD Settings' AND tablename = 'app_settings') THEN
    CREATE POLICY "Admin CRUD Settings" ON public.app_settings FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- 8. Notify to reload schema
NOTIFY pgrst, 'reload schema';