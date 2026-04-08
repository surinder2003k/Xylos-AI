/**
 * Xylos AI | Image Production Engine
 * Generates high-definition professional imagery using Cloudflare Workers AI.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateAIImage(prompt: string): Promise<string | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.warn("[Neural Image] Cloudflare credentials missing. Falling back...");
    return null;
  }

  try {
    console.log(`[Neural Image] Generating image for: ${prompt}`);
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: `ultra-realistic professional photography, 8k resolution, highly detailed, cinematic lighting, sharp focus, masterfully composed: ${prompt}` }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.errors?.[0]?.message || "Cloudflare AI Failure");
    }

    const imageBlob = await response.blob();
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Upload to Supabase Storage
    const fileName = `generated-${Math.random().toString(36).substring(2)}-${Date.now()}.png`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    console.log(`[Neural Image] Successfully generated & synced: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error("[Neural Image] Engine Failure:", error.message);
    return null;
  }
}
