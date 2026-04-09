-- Xylos AI | Permission Layer Expansion
-- Purpose: Support super_admin role and allow admin-level profile lookups.

-- 1. Expand the role constraint on profiles
-- We need to drop the old constraint and add a new one that includes 'super_admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin'));

-- 2. Add RLS policy for Admin Directory Visibility
-- This allows any logged-in admin/super_admin to view all profiles in the system.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; -- Ensure RLS is on

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
);

-- 3. Notify Schema Reload
NOTIFY pgrst, 'reload schema';
