/**
 * Pulse AI | Universal AI Provider Service
 * Handles unified requests to 7+ AI providers.
 */

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: {
    name: string;
    type: string;
    url: string; // base64 or URL
  }[];
};

type ProviderResponse = {
  content: string;
  model: string;
  provider: string;
};

/**
 * Per-call tuning. Kept optional so existing callers (the chat route) keep the
 * exact previous behaviour: prose output, provider default token budget.
 */
type CallOptions = {
  /** Force a single JSON object back (blog generator only — never for chat). */
  jsonMode?: boolean;
  /** Output token ceiling. */
  maxTokens?: number;
  /**
   * Reasoning-token budget for hybrid reasoning models (gpt-oss, qwen3...).
   * These models otherwise spend most of `maxTokens` on hidden reasoning and
   * return truncated JSON.
   */
  reasoningEffort?: 'low' | 'medium' | 'high';
};

export async function getProviderResponse(
  provider: string,
  model: string,
  messages: Message[],
  options?: CallOptions
): Promise<ProviderResponse> {

  // High-Performance Link & Asset Pre-processor
  const processedMessages = messages.map(m => {
    let content = m.content;
    if (m.attachments && m.attachments.length > 0) {
      m.attachments.forEach(file => {
        // If it's a text/code file (not a data URL image), inject it as context
        if (!file.url.startsWith('data:image/') && !file.url.startsWith('data:application/pdf')) {
          content += `\n\n[NEURAL ASSET DISCOVERED: ${file.name}]\n${file.url}\n[END OF ASSET DATA]`;
        }
      });
    }
    return { ...m, content };
  });

  // 1. OPENROUTER
  if (provider === 'openrouter') {
    const safeMessages = processedMessages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "nvidia/nemotron-3-super-120b-a12b:free",
        messages: safeMessages
      })
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message) {
      throw new Error(data.error?.message || 'OpenRouter API Error: No choices returned');
    }
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openrouter'
    };
  }

  // 2. GROQ
  if (provider === 'groq') {
    const safeMessages = processedMessages.map(m => ({ role: m.role, content: m.content }));
    const groqModel = model || "llama-3.3-70b-versatile";

    const body: Record<string, unknown> = {
      model: groqModel,
      messages: safeMessages,
      temperature: 0.7,
    };

    // JSON mode is opt-in: the blog generator needs one raw JSON object, but the
    // chat route must stay prose. Forcing json_object for chat returned JSON
    // blobs instead of answers.
    if (options?.jsonMode) body.response_format = { type: "json_object" };
    if (options?.maxTokens) body.max_tokens = options.maxTokens;

    // Hybrid reasoning models (gpt-oss, qwen3) otherwise burn most of the token
    // budget on hidden reasoning, which truncated the JSON mid-object and broke
    // the parser. Cap it — and include the reasoning field when asked for.
    if (options?.reasoningEffort && /gpt-oss|qwen3|deepseek-r1/i.test(groqModel)) {
      body.reasoning_effort = options.reasoningEffort;
      body.include_reasoning = false;
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message) {
      throw new Error(data.error?.message || 'Groq API Error: No choices returned');
    }
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'groq'
    };
  }

  // 3. GOOGLE GEMINI
  if (provider === 'gemini') {
    const systemInstruction = processedMessages.find(m => m.role === 'system')?.content;
    const chatMessages = processedMessages.filter(m => m.role !== 'system');

    const modelToUse = "gemini-3.6-flash";

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: systemInstruction ? {
          parts: [{ text: systemInstruction }]
        } : undefined,
        contents: chatMessages.map(m => {
          const parts: any[] = [{ text: m.content || " " }];

          if (m.attachments && m.attachments.length > 0) {
            m.attachments.forEach(file => {
              if (file.type.startsWith('image/')) {
                const base64Data = file.url.split(';base64,').pop() || '';
                parts.push({
                  inline_data: {
                    mime_type: file.type,
                    data: base64Data
                  }
                });
              }
            });
          }

          return {
            role: m.role === 'user' ? 'user' : 'model',
            parts: parts
          };
        })
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error('[Neural Sync] Gemini Interface Error:', data.error);
      throw new Error(`Gemini Protocol Rejected: ${data.error.message || 'Invalid Request / Key'}`);
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Xylos AI Safety Protocol: Content blocked due to sensitive material.');
      }
      throw new Error('Gemini API Connectivity Failure (v1beta Protocol)');
    }

    return {
      content: data.candidates[0].content.parts[0].text,
      model: modelToUse,
      provider: 'gemini'
    };
  }

  // 4. MISTRAL AI
  if (provider === 'mistral') {
    const safeMessages = processedMessages.map(m => ({ role: m.role, content: m.content }));
    // "mistral-medium-2505" is not a valid model id for this account (the live
    // /v1/models list exposes mistral-medium-latest, mistral-medium-3-5 and
    // mistral-medium-2604). Use the rolling alias so the provider keeps working
    // when Mistral rotates snapshots.
    const mistralModel = model && model !== 'mistral-medium-2505' ? model : 'mistral-medium-latest';
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: mistralModel,
        messages: safeMessages
      })
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message) {
      throw new Error(data.error?.message || 'Mistral API Error: No choices returned');
    }
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'mistral'
    };
  }

  // 5. FIREWORKS AI
  if (provider === 'fireworks') {
    const safeMessages = processedMessages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FIREWORKS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "accounts/fireworks/models/llama-v3-8b-instruct",
        messages: safeMessages
      })
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message) {
      throw new Error(data.error?.message || 'Fireworks API Error: No choices returned');
    }
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'fireworks'
    };
  }

  // 6. CEREBRAS
  if (provider === 'cerebras') {
    const safeMessages = processedMessages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "gpt-oss-120b",
        messages: safeMessages
      })
    });
    const data = await res.json();
    if (!data.choices?.[0]?.message) {
      throw new Error(data.error?.message || 'Cerebras API Error: No choices returned');
    }
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'cerebras'
    };
  }

  // 6. HUGGING FACE
  if (provider === 'huggingface') {
    const lastMsg = processedMessages[processedMessages.length - 1];
    const res = await fetch(`https://api-inference.huggingface.co/models/${model || 'microsoft/Phi-3-mini-4k-instruct'}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: lastMsg.content })
    });
    const data = await res.json();
    return {
      content: Array.isArray(data) ? data[0].generated_text : data.generated_text,
      model: model || 'hf-model',
      provider: 'huggingface'
    };
  }

  // 7. CLOUDFLARE WORKERS AI
  if (provider === 'cloudflare') {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model || '@cf/meta/llama-3-8b-instruct'}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: processedMessages })
    });
    const data = await res.json();
    if (!data.result?.response) {
      throw new Error(data.errors?.[0]?.message || 'Cloudflare API Error: No response returned');
    }
    return {
      content: data.result.response,
      model: model || '@cf/meta/llama-3-8b-instruct',
      provider: 'cloudflare'
    };
  }

  // BEST FREE ROUTE (Groq llama-3.3-70b-versatile — fastest free, no hidden
  // reasoning tokens, live-tested for valid JSON)
  return getProviderResponse('groq', 'llama-3.3-70b-versatile', processedMessages, options);
}
