# Supabase Database Constraint Fix

If you are experiencing the error: `ERROR: 23514: new row for relation "profiles" violates check constraint "profiles_role_check"` when assigning the "super_admin" role, it means your live database has an older check constraint that doesn't include "super_admin".

Please run the following SQL snippet in your **Supabase SQL Editor** to fix it:

```sql
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'user'));
```
