
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBrokenLinks() {
  const brokenUrl = "https://pulse-blog-ai.vercel.app/blog/indias-latest-initiative-revisioning-education-through-artificial-intelligence";
  
  console.log(`Searching for broken URL: ${brokenUrl}`);
  
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, content, slug")
    .ilike("content", `%${brokenUrl}%`);
    
  if (error) {
    console.error("Error searching database:", error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log("No blogs found with that URL.");
    return;
  }
  
  console.log(`Found ${data.length} blogs with broken links:`);
  data.forEach(blog => {
    console.log(`- [${blog.id}] ${blog.title} (${blog.slug})`);
  });
}

findBrokenLinks();
