# `database/` — SQL files and what is safe to run

Everything here is run by hand in the **Supabase SQL Editor** (Dashboard → SQL
Editor → New query). Nothing in this folder is executed by the app or by CI.

## Read this first: only one file is destructive

| File | Touches your rows? | When to run it |
| --- | --- | --- |
| `migrations/add_last_seen.sql` | **No** | Whenever you want the admin presence column |
| `migrations/fix_columns_and_indexes.sql` | **No** — `ADD COLUMN IF NOT EXISTS` only | Only if the blogs table is missing SEO columns |
| `migrations/update_roles.sql` | **No** — swaps a CHECK constraint | Only if `role = 'super_admin'` is rejected |
| `cms_v3_migration.sql` | **No** — `CREATE TABLE IF NOT EXISTS` | Fresh project only |
| `supabase_matrix_final.sql` | **No** — `CREATE TABLE IF NOT EXISTS` | Fresh project only |
| `cleanup_thin_posts.sql` | **Rows change** (`published` → `draft`, no deletes) | Only for the GSC "low value content" cleanup |
| `slug-redirects.json` | Not SQL — a data file | Never run; read by `middleware.ts` |
| ⚠️ `supabase-init.sql` | **YES — DROPS ALL TABLES** | **Never** on a project that has data |

`supabase-init.sql` starts with `DROP TABLE ... CASCADE` for `blogs`,
`profiles`, `chats`, `messages` and more. It is kept only as a schema
reference. It now aborts on its own unless you first run
`SET app.allow_destructive_reset = 'yes';` in the same session, so it cannot be
triggered by pasting it into a project that has content.

## The one you actually need right now

```sql
-- database/migrations/add_last_seen.sql
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS profiles_last_seen_at_idx
  ON public.profiles (last_seen_at DESC);
```

This is **additive only**: it adds one nullable column and one index. It does
not read, write, update or delete any row — your `blogs` rows are not even
looked at. It is also idempotent, so re-running it is harmless. Without it, the
admin user directory shows everyone as offline (see
`components/presence-heartbeat.tsx`).

## Adding a new migration

Put it in `database/migrations/` as a new file rather than editing a script that
has already been run, and keep it idempotent (`IF NOT EXISTS`, `IF EXISTS`) so
it can be re-run safely.
