
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBrokenLinks() {
  const brokenFragment = "revisioning-education-through-artificial-intelligence";
  const correctFragment = "revolutionizing-education-through-artificial-intelligence";
  
  console.log(`Searching for blog content with: ${brokenFragment}`);
  
  // Fetch all posts that contain the broken link
  const { data: posts, error } = await supabase
    .from("blogs")
    .select("id, content")
    .ilike("content", `%${brokenFragment}%`);
    
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }
  
  if (!posts || posts.length === 0) {
    console.log("No posts found with broken links.");
    return;
  }
  
  console.log(`Found ${posts.length} posts to repair.`);
  
  for (const post of posts) {
    const updatedContent = post.content.replace(new RegExp(brokenFragment, "g"), correctFragment);
    
    const { error: updateError } = await supabase
      .from("blogs")
      .update({ content: updatedContent })
      .eq("id", post.id);
      
    if (updateError) {
      console.error(`Failed to update post ${post.id}:`, updateError);
    } else {
      console.log(`Successfully repaired post ${post.id}`);
    }
  }
  
  console.log("Database remediation complete.");
}

fixBrokenLinks();
