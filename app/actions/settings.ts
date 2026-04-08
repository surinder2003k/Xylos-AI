"use server";

import { createClient } from "@supabase/supabase-js";

// Server Action uses SERVICE_ROLE_KEY to bypass RLS on app_settings
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function updateAppSetting(key: string, value: unknown) {
  try {
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

export async function getAppSetting(key: string) {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) throw error;
    return { success: true, value: data?.value };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch setting";
    return { success: false, value: null, error: errorMsg };
  }
}
