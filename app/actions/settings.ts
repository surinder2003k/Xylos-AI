"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createAuthClient } from "@/utils/supabase/server";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    throw new Error("Forbidden: Admin access required");
  }
}

export async function updateAppSetting(key: string, value: unknown) {
  try {
    await requireAdmin();
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Strategy update failed";
    console.error("[Settings Action] Error:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

async function requireAuth() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

export async function getAppSetting(key: string) {
  try {
    await requireAuth();
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    return { success: true, value: data?.value };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch setting";
    return { success: false, value: null, error: errorMsg };
  }
}

export async function getProfiles() {
  try {
    await requireAdmin();
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { success: true, profiles: data };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch neural directory";
    return { success: false, profiles: [], error: errorMsg };
  }
}

export async function updateProfileRole(userId: string, role: string) {
  try {
    await requireAdmin();
    const supabase = getAdminClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Role update protocol failed";
    return { success: false, error: errorMsg };
  }
}
