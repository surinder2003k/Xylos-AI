import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getProviderResponse } from '@/lib/ai/providers';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages, provider = 'best', model } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    // Add system prompt
    const systemMessage = {
      role: 'system' as const,
      content: `You are the Xylos Neural Engine, a senior investigative journalist and content strategist.
 
      Your tone is sophisticated, analytical, and cinematic. 
      You are the core intelligence of the Neural Matrix platform.
      If the user asks for code, provide clean, optimized architecture.
      When appropriate, use the term "Xylos AI" to refer to yourself.`
    };

    // Map messages to only include role, content, and attachments
    const sanitizedMessages = messages.map(({ role, content, attachments }: { role: string; content: unknown; attachments?: unknown }) => ({
      role: role as "system" | "user" | "assistant",
      content: typeof content === 'string' && content.length > 20000  
        ? content.substring(0, 18000) + "... [Content truncated for stability]" 
        : content as string,
      attachments: attachments as any // Pass attachments through for vision
    }));
    const fullMessages = [systemMessage, ...sanitizedMessages];

    // Tiered fallback strategy — try multiple providers if one fails
    const fallbackChain = [
      { name: 'groq', model: 'llama-3.3-70b-versatile' },
      { name: 'openrouter', model: 'stepfun/step-3.5-flash:free' },
      { name: 'gemini', model: 'gemini-1.5-flash' },
      { name: 'cerebras', model: 'llama3.1-8b' },
    ];

    // If user picked a specific provider, try that first
    const specificMap: Record<string, { name: string; model: string }> = {
      'groq': { name: 'groq', model: model || 'llama-3.3-70b-versatile' },
      'gemini': { name: 'gemini', model: model || 'gemini-1.5-flash' },
      'openrouter': { name: 'openrouter', model: model || 'stepfun/step-3.5-flash:free' },
      'mistral': { name: 'mistral', model: model || 'mistral-tiny' },
      'cerebras': { name: 'cerebras', model: model || 'llama3.1-8b' },
      'cloudflare': { name: 'cloudflare', model: model || '@cf/meta/llama-3-8b-instruct' },
    };

    // Build the provider queue
    let providerQueue = [...fallbackChain];
    if (provider !== 'best' && specificMap[provider]) {
      // Put the user's chosen provider first, then fallback to others
      const chosen = specificMap[provider];
      providerQueue = [chosen, ...fallbackChain.filter(p => p.name !== chosen.name)];
    }

    let lastError: unknown = null;
    for (const p of providerQueue) {
      try {
        console.log(`[Chat API] Trying ${p.name}...`);
        const response = await getProviderResponse(p.name, p.model, fullMessages);
        console.log(`[Chat API] Success with ${p.name}`);
        return NextResponse.json({
          content: response.content,
          model: response.model,
          provider: response.provider,
        });
      } catch (err: unknown) {
        console.warn(`[Chat API] ${p.name} failed:`, err instanceof Error ? err.message : String(err));
        lastError = err;
        continue;
      }
    }

    // All providers failed
    throw lastError instanceof Error ? lastError : new Error('All AI providers failed. Please try again later.');
    
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    console.error('[Chat API Error]', errorMsg);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
