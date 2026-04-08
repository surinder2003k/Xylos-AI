-- Xylos AI | Neural Matrix: Final Persistence & Storytelling Engine Fix
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- 1. Initialize Neural Tables
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Technology',
    status TEXT DEFAULT 'published',
    feature_image_url TEXT,
    alt_text TEXT,
    user_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Chat Matrix: Persistence Infrastructure
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT DEFAULT 'New Neural Mission',
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    attachment JSONB, -- Stores {name, type, url} for vision/files
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security Protocols (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Blogs Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'blogs') THEN
        CREATE POLICY "Public Read Access" ON public.blogs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Insert' AND tablename = 'blogs') THEN
        CREATE POLICY "Authenticated Insert" ON public.blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    -- Chats Policies (Strictly User-Owned)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User Chat Access' AND tablename = 'chats') THEN
        CREATE POLICY "User Chat Access" ON public.chats FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Messages Policies (Linked to User Chats)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'User Message Access' AND tablename = 'messages') THEN
        CREATE POLICY "User Message Access" ON public.messages FOR ALL 
        USING (EXISTS (SELECT 1 FROM public.chats WHERE id = chat_id AND user_id = auth.uid()));
    END IF;
END $$;

-- 4. Storage Ingestion: Image Matrix
-- Ensure the storage bucket exists for high-fidelity assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Protocols
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Uploads' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- 5. User Sync (Profiles Table Evolution)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
ADD COLUMN IF NOT EXISTS email TEXT;

-- 6. Trigger for Automatic Profile Sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  )
  ON CONFLICT (user_id) DO UPDATE 
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup & Finalization
NOTIFY pgrst, 'reload schema';
