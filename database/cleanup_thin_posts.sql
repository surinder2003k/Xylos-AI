-- ============================================================
-- Xylos AI — Thin / Off-topic Post Cleanup (SAFE VERSION)
-- Purpose: Google Search Console "Crawled - currently not indexed"
--          (validation failed) + AdSense "low value content" rejection.
--
-- ✅ ZERO DATA LOSS GUARANTEE:
--   - Koi DELETE nahi hai — sirf status 'published' -> 'draft' hota hai
--   - Update se PEHLE affected rows ka full backup table ban jaata hai
--     (cleanup_thin_posts_backup) — original data 100% recoverable
--   - Section 5 se ek click me sab WAPAS restore ho jaata hai
--
-- HOW TO RUN (Supabase Dashboard -> SQL Editor):
--   Section 1: Preview (kuch change NAHI karta) — pehle ye chalao
--   Section 2: Backup table banao
--   Section 3: Unpublish (draft me move)
--   Section 4: Verify — kitni posts draft hui
--   Section 5: (Sirf agar WAPAS chahiye) Full restore
-- ============================================================

-- ------------------------------------------------------------
-- 1) PREVIEW: list published posts matching off-topic patterns
--    (READ-ONLY — isse kuch change nahi hota)
-- ------------------------------------------------------------
SELECT id, slug, title, category, status, published_at
FROM blogs
WHERE status = 'published'
  AND (
    title ILIKE '%insurance%'
    OR title ILIKE '%denture%'
    OR title ILIKE '%oral surgery%'
    OR title ILIKE '%attorney%'
    OR title ILIKE '%lawyer%'
    OR title ILIKE '%gutter%'
    OR title ILIKE '%roof%'
    OR title ILIKE '%burger%'
    OR title ILIKE '%restaurant%'
    OR title ILIKE '%half-cow%'
    OR title ILIKE '%cow price%'
    OR title ILIKE '%recipe%'
    OR title ILIKE '%casino%'
    OR title ILIKE '%betting%'
  );

-- ------------------------------------------------------------
-- 2) BACKUP: affected rows ka snapshot table banao
--    (Agar backup table pehle se hai to drop karke fresh banega)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS cleanup_thin_posts_backup;

CREATE TABLE cleanup_thin_posts_backup AS
SELECT id, slug, title, category, status, published_at, updated_at, now() AS backed_up_at
FROM blogs
WHERE status = 'published'
  AND (
    title ILIKE '%insurance%'
    OR title ILIKE '%denture%'
    OR title ILIKE '%oral surgery%'
    OR title ILIKE '%attorney%'
    OR title ILIKE '%lawyer%'
    OR title ILIKE '%gutter%'
    OR title ILIKE '%roof%'
    OR title ILIKE '%burger%'
    OR title ILIKE '%restaurant%'
    OR title ILIKE '%half-cow%'
    OR title ILIKE '%cow price%'
    OR title ILIKE '%recipe%'
    OR title ILIKE '%casino%'
    OR title ILIKE '%betting%'
  );

-- ------------------------------------------------------------
-- 3) UNPUBLISH: move matched posts to 'draft' (reversible)
--    Sirf wahi posts change hongi jo backup me captured hain
-- ------------------------------------------------------------
UPDATE blogs
SET status = 'draft'
WHERE id IN (SELECT id FROM cleanup_thin_posts_backup);

-- ------------------------------------------------------------
-- 4) VERIFY: kitni posts draft hui + backup ka record count
--    (Dono counts MATCH hone chahiye)
-- ------------------------------------------------------------
SELECT
  (SELECT COUNT(*) FROM cleanup_thin_posts_backup) AS backed_up,
  (SELECT COUNT(*) FROM blogs WHERE status = 'draft' AND id IN (SELECT id FROM cleanup_thin_posts_backup)) AS moved_to_draft;

-- ------------------------------------------------------------
-- 5) RESTORE (sirf tab chalao jab sab posts WAPAS chahiye):
--   UPDATE blogs
--    SET status = backup.status
--    FROM cleanup_thin_posts_backup backup
--    WHERE blogs.id = backup.id;
--
-- Restore ke baad backup table clean karna ho to:
--    DROP TABLE cleanup_thin_posts_backup;
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- 6) BONUS REVIEW: near-duplicate AI posts (same slug prefix with
--    random suffixes like "-6k0es" vs "-k376m"). Ye DELETE nahi karta —
--    sirf dikhata hai kaunsi posts ke variants hain, review ke liye.
-- ------------------------------------------------------------
SELECT slug, title, status, published_at,
       LEFT(slug, 60) AS slug_prefix,
       COUNT(*) OVER (PARTITION BY LEFT(slug, 60)) AS variant_count
FROM blogs
WHERE status = 'published'
ORDER BY LEFT(slug, 60), published_at DESC;