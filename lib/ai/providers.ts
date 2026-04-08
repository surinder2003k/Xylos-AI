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

export async function getProviderResponse(
  provider: string,
  model: string,
  messages: Message[]
): Promise<ProviderResponse> {
  
  // 1. OPENROUTER
  if (provider === 'openrouter') {
    const safeMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "stepfun/step-3.5-flash:free",
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
    const safeMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: safeMessages
      })
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
    // Filter system message and handle role mapping for Gemini
    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const chatMessages = messages.filter(m => m.role !== 'system');
    
    // Explicit model ID for stable vision support
    const modelToUse = "gemini-1.5-flash"; // Optimized for v1beta Protocol Sync
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
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
    const safeMessages = messages.map(m => ({ role: m.role, content: m.content }));
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "mistral-tiny",
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
    const safeMessages = messages.map(m => ({ role: m.role, content: m.content }));
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
     const safeMessages = messages.map(m => ({ role: m.role, content: m.content }));
     const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "llama3.1-8b",
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
    const res = await fetch(`https://api-inference.huggingface.co/models/${model || 'microsoft/Phi-3-mini-4k-instruct'}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: messages[messages.length - 1].content })
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
      body: JSON.stringify({ messages })
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

  // BEST FREE ROUTE (Fallback to Groq Llama 3 as it's the fastest and free)
  return getProviderResponse('groq', 'llama-3.3-70b-versatile', messages);
}
