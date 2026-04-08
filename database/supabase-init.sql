-- Aether AI | Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- 1. PROFILES TABLE
-- Stores user-specific information linked to Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);


-- 2. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON public.conversations
    FOR ALL USING (auth.uid() = user_id);


-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model_used TEXT,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = messages.conversation_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = messages.conversation_id AND user_id = auth.uid()
        )
    );


-- 4. USER API KEYS TABLE
-- Keys should be stored ENCRYPTED (handled by server logic)
CREATE TABLE IF NOT EXISTS public.user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, provider_name)
);

ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own API keys" ON public.user_api_keys
    FOR ALL USING (auth.uid() = user_id);


-- 5. TRIGGER FOR NEW USER PROFILE
-- Automatically creates a profile record when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. BLOGS TABLE (Auto-Blogging CMS)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    feature_image_url TEXT,
    category TEXT DEFAULT 'Technology',
    status TEXT DEFAULT 'draft',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to read published blogs on the landing page
CREATE POLICY "Anyone can view published blogs" ON public.blogs
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to view all blogs (including drafts)
CREATE POLICY "Authenticated users can view all blogs" ON public.blogs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert, update, delete blogs
CREATE POLICY "Authenticated users can create blogs" ON public.blogs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Authenticated users can update blogs" ON public.blogs
    FOR UPDATE USING (auth.role() = 'authenticated');
    
CREATE POLICY "Authenticated users can delete blogs" ON public.blogs
    FOR DELETE USING (auth.role() = 'authenticated');
