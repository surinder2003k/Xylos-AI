import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  console.log("--- Checking Blog Status ---");
  const { data: latestPosts, error: postError } = await supabase
    .from("blogs")
    .select("id, title, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5);

  if (postError) {
    console.error("Error fetching posts:", postError.message);
  } else {
    console.log("Latest Posts:");
    latestPosts.forEach(p => console.log(`- ${p.title} (${p.created_at}) status: ${p.status}`));
  }

  console.log("\n--- Checking Automation Logs ---");
  const { data: logs, error: logError } = await supabase
    .from("automation_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (logError) {
    console.error("Error fetching logs (table might not exist):", logError.message);
  } else {
    console.log("Automation Logs:");
    logs.forEach(l => console.log(`- ${l.created_at}: ${l.event} | ${l.status} | ${l.details}`));
  }
}

checkStatus();
