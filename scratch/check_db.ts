
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  console.log("Checking for admin profiles...");
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, email, role')
    .in('role', ['super_admin', 'admin']);

  if (error) {
    console.error("Error fetching profiles:", error.message);
  } else {
    console.log("Admins found:", data);
    if (data.length === 0) {
      console.log("WARNING: No admins found! The autoposting script will fail to assign an author.");
    }
  }
  
  console.log("\nChecking blogs table structure...");
  // We can't easily get table info via JS client, but we can try a test insert with dry run or just query columns
  const { data: blogSample, error: blogError } = await supabase
    .from('blogs')
    .select('*')
    .limit(1);
    
  if (blogError) {
    console.error("Error fetching blogs:", blogError.message);
  } else {
    console.log("Blog columns:", Object.keys(blogSample[0] || {}));
  }
}

checkAdmins();
