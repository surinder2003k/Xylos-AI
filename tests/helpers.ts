import { test } from "@playwright/test";

/**
 * Tests that read or write real content need a configured Supabase backend.
 *
 * CI deliberately runs without server secrets (see .github/workflows/ci.yml) so
 * that a build depending on them fails loudly rather than passing by luck. That
 * means content-backed assertions — blog posts from the database, endpoints
 * that resolve a Supabase session — cannot pass there, so they skip themselves
 * instead of pretending to be verified. Locally, with .env.local present, they
 * all run.
 */
export const hasBackend = Boolean(
  process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL
);

/** Skips the current test when no backend is configured. */
export function skipWithoutBackend() {
  test.skip(!hasBackend, "no Supabase backend configured");
}
