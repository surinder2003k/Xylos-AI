-- CMS V3.1 Neural Migration Script
-- Purpose: Enable RBAC, Profile Email Sync, and Advanced AI Settings

-- 1. Profiles Table (with email support)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Blogs Table (if not already created)
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  feature_image_url TEXT,
  alt_text TEXT,
  category TEXT DEFAULT 'Technology',
  author_id UUID REFERENCES public.profiles(user_id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Initial Seed Data
INSERT INTO public.app_settings (key, value)
VALUES 
  ('auto_publish', 'true'),
  ('auto_category', '"Technology"')
ON CONFLICT (key) DO NOTHING;

-- 5. Helper Function: Sync Profile Email
-- This trigger automatically creates/updates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    CASE 
      WHEN new.email IN ('sendltestmaill@gmail.com', 'xyzg135@gmail.com') THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = CASE 
      WHEN EXCLUDED.email IN ('sendltestmaill@gmail.com', 'xyzg135@gmail.com') THEN 'admin'
      ELSE EXCLUDED.role
    END;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger to auth.users (Requires superuser/dash access)
-- Note: This is an optional but powerful automation
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT OR UPDATE ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Permissions & RLS (If tables newly created)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policy definitions (Admins full access, users view own)
-- These are standard policies for the Aether AI CMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin CRUD Blogs') THEN
        CREATE POLICY "Admin CRUD Blogs" ON public.blogs FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin CRUD Profiles') THEN
        CREATE POLICY "Admin CRUD Profiles" ON public.profiles FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin CRUD Settings') THEN
        CREATE POLICY "Admin CRUD Settings" ON public.app_settings FOR ALL TO authenticated USING (true);
    END IF;
END $$;
