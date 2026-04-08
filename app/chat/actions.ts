"use server";

import { createClient } from "@/utils/supabase/server";
import { getProviderResponse } from "@/lib/ai/providers";
import { revalidatePath } from "next/cache";

export async function createConversation(title?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title: title || "New Strategy" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  provider: string,
  model: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Save User Message
  const { data: userMsg, error: userErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: 'user',
      content: content
    })
    .select()
    .single();

  if (userErr) throw userErr;

  // 2. Fetch Conversation History
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const formattedHistory = (history || []).map(m => ({
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content
  }));

  // 3. Get AI Response
  const aiResponse = await getProviderResponse(provider, model, formattedHistory);

  // 4. Save AI Response
  const { data: aiMsg, error: aiErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: aiResponse.content,
      model_used: aiResponse.model,
      provider: aiResponse.provider
    })
    .select()
    .single();

  if (aiErr) throw aiErr;

  revalidatePath(`/chat/${conversationId}`);
  return { userMsg, aiMsg };
}

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return data || [];
}
