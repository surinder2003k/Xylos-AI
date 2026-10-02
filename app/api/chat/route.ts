import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getProviderResponse } from '@/lib/ai/providers';
import { recordModelResult } from '@/lib/ai/model-catalog';

const MODEL_ID_MAX = 120;
const MODEL_ID_OK = /^[A-Za-z0-9][A-Za-z0-9._:/@-]*$/;

/**
 * Validates a user-supplied model id. Returns the trimmed id, or null when it
 * must be rejected. Cloudflare/HuggingFace interpolate the id into a URL, so
 * the charset and path-traversal checks here are load-bearing.
 */
function sanitizeModelId(raw: string, provider: string): string | null {
  const value = raw.trim();
  if (!value || value.length > MODEL_ID_MAX) return null;
  if (!MODEL_ID_OK.test(value)) return null;
  if (value.includes('..') || value.includes('//')) return null;
  if (provider === 'cloudflare' && !/^@(cf|hf)\//.test(value)) return null;
  if (provider === 'huggingface' && !value.includes('/')) return null;
  return value;
}

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

    // A missing or non-JSON body is a client error, so parse defensively: an
    // unhandled throw here would surface as a 500 for what is a bad request.
    const body = (await request.json().catch(() => null)) ?? {};
    const { messages, provider = 'best', model, strict: strictRequested } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    // Model ids reach third-party APIs and get interpolated straight into the
    // Cloudflare / Hugging Face URLs, so validate the charset before use.
    const requestedModel = sanitizeModelId(typeof model === 'string' ? model : '', provider);
    if (model && !requestedModel) {
      return NextResponse.json(
        { error: 'That model id is not valid for this provider.' },
        { status: 400 }
      );
    }

    // "Strict" = the user explicitly pinned a model, so we must not silently
    // answer with a different model. "Best Free Route" keeps the fallback chain.
    const strict = strictRequested === true || Boolean(requestedModel);
    if (strict && (provider === 'best' || !provider)) {
      return NextResponse.json(
        { error: 'A provider is required when a specific model is selected.' },
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

    // Tiered fallback strategy — try multiple providers if one fails (models live-tested 2026-08)
    const fallbackChain = [
      { name: 'groq', model: 'openai/gpt-oss-120b' },
      { name: 'gemini', model: 'gemini-3.6-flash' },
      { name: 'openrouter', model: 'nvidia/nemotron-3-super-120b-a12b:free' },
      { name: 'mistral', model: 'mistral-medium-2505' },
      { name: 'cerebras', model: 'gpt-oss-120b' },
    ];

    // If user picked a specific provider, try that first
    const specificMap: Record<string, { name: string; model: string }> = {
      'groq': { name: 'groq', model: requestedModel || 'openai/gpt-oss-120b' },
      'gemini': { name: 'gemini', model: requestedModel || 'gemini-3.6-flash' },
      'openrouter': { name: 'openrouter', model: requestedModel || 'nvidia/nemotron-3-super-120b-a12b:free' },
      'mistral': { name: 'mistral', model: requestedModel || 'mistral-medium-2505' },
      'cerebras': { name: 'cerebras', model: requestedModel || 'gpt-oss-120b' },
      'cloudflare': { name: 'cloudflare', model: requestedModel || '@cf/meta/llama-3-8b-instruct' },
      'huggingface': { name: 'huggingface', model: requestedModel || 'microsoft/Phi-3-mini-4k-instruct' },
    };

    // Build the provider queue. Strict picks try exactly one model; the flexible
    // path keeps the tiered fallback so an outage never leaves the user stuck.
    let providerQueue: { name: string; model: string }[];
    if (provider !== 'best' && specificMap[provider]) {
      const chosen = specificMap[provider];
      providerQueue = strict
        ? [chosen]
        : [chosen, ...fallbackChain.filter(p => p.name !== chosen.name)];
    } else {
      providerQueue = [...fallbackChain];
    }

    let lastError: unknown = null;
    for (const p of providerQueue) {
      try {
        console.log(`[Chat API]${strict ? ' [strict]' : ''} Trying ${p.name} (${p.model})...`);
        const response = await getProviderResponse(p.name, p.model, fullMessages);
        recordModelResult(p.name, p.model, true);
        console.log(`[Chat API] Success with ${p.name}`);
        return NextResponse.json({
          content: response.content,
          model: response.model,
          provider: response.provider,
          strict,
        });
      } catch (err: unknown) {
        recordModelResult(p.name, p.model, false);
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
